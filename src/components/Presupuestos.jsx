import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Download, Printer, Copy, Check, CheckCircle, 
  AlertCircle, Search, Calendar, Clock, DollarSign, Users, Plane, 
  MapPin, Globe, Mail, Phone, ArrowRight, ShieldCheck, FileText, 
  Eye, Edit3, X, Languages, ArrowLeft
} from 'lucide-react';

export default function Presupuestos({ 
  services = [], 
  LISTA_HOTELES = [], 
  supabase, 
  fetchAllData, 
  showToast 
}) {
  // Pestaña interna: 'editor' | 'historial'
  const [activeSubTab, setActiveSubTab] = useState('editor');

  // Idioma de la cotización
  const [idioma, setIdioma] = useState('ES'); // 'ES' | 'EN'

  // Búsqueda de reservas existentes para autocompletar
  const [vincularReserva, setVincularReserva] = useState(false);
  const [searchReservaQuery, setSearchReservaQuery] = useState('');
  const [reservasFiltradas, setReservasFiltradas] = useState([]);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);

  // Estado del presupuesto actual
  const [cotizacion, setCotizacion] = useState({
    id: `COT-${Date.now()}`,
    folio: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
    fechaEmision: new Date().toISOString().split('T')[0],
    estado: 'EN REVISIÓN', // 'EN REVISIÓN' | 'COTIZADO' | 'APROBADO' | 'CONVERTIDO'
    
    // Datos del cliente
    nombreCliente: '',
    pax: '2',
    aerolineaVuelo: '',
    hotelPrincipal: '',
    metodoPago: 'Pendiente / Efectivo',
    horaCheckout: '',
    precioTotal: '0.00',
    moneda: 'USD',
    notasPersonalizadas: '',

    // Etapas / Destinos
    etapas: [
      {
        id: 'etapa-1',
        tipo: 'llegada',
        etiquetaES: 'Llegada',
        etiquetaEN: 'Arrival',
        origen: 'Aeropuerto SJD',
        destino: '',
        fecha: '',
        hora: '',
        precio: ''
      },
      {
        id: 'etapa-2',
        tipo: 'destino',
        etiquetaES: 'Destino 1',
        etiquetaEN: 'Destination 1',
        origen: '',
        destino: '',
        fecha: '',
        hora: '',
        precio: ''
      },
      {
        id: 'etapa-3',
        tipo: 'salida',
        etiquetaES: 'Retorno (Salida)',
        etiquetaEN: 'Departure / Return',
        origen: '',
        destino: 'Aeropuerto SJD',
        fecha: '',
        hora: '',
        precio: ''
      }
    ]
  });

  // Historial de cotizaciones (localStorage con fallback persistente)
  const [historialCotizaciones, setHistorialCotizaciones] = useState([]);
  const [filtroHistorial, setFiltroHistorial] = useState('');

  // Modal para convertir cotización a reserva
  const [mostrarModalConversion, setMostrarModalConversion] = useState(false);
  const [cotizacionAConvertir, setCotizacionAConvertir] = useState(null);
  const [serviciosAConvertir, setServiciosAConvertir] = useState([]);
  const [erroresValidacion, setErroresValidacion] = useState([]);
  const [guardandoReservas, setGuardandoReservas] = useState(false);

  // Referencias para imprimir / PDF / Copiar
  const ticketRef = useRef(null);
  const [copiado, setCopiado] = useState(false);
  const [generandoPDF, setGenerandoPDF] = useState(false);

  // Cargar historial de localStorage al iniciar
  useEffect(() => {
    try {
      const guardado = localStorage.getItem('ballard_presupuestos_v1');
      if (guardado) {
        setHistorialCotizaciones(JSON.parse(guardado));
      }
    } catch (e) {
      console.error('Error al cargar historial de presupuestos:', e);
    }
  }, []);

  // Guardar historial en localStorage
  const guardarEnStorage = (nuevoHistorial) => {
    setHistorialCotizaciones(nuevoHistorial);
    try {
      localStorage.setItem('ballard_presupuestos_v1', JSON.stringify(nuevoHistorial));
    } catch (e) {
      console.error('Error al guardar en storage:', e);
    }
  };

  // Filtrar reservas cuando el usuario escribe en el buscador de reservas existentes
  useEffect(() => {
    if (!searchReservaQuery.trim()) {
      setReservasFiltradas([]);
      return;
    }
    const q = searchReservaQuery.toLowerCase();
    const filtrados = (services || []).filter(s => {
      const nombreCompleto = `${s.nombre || ''} ${s.apellido || ''}`.toLowerCase();
      const reserva = (s.reserva || '').toLowerCase();
      const hotel = (s.hotel || '').toLowerCase();
      return nombreCompleto.includes(q) || reserva.includes(q) || hotel.includes(q);
    }).slice(0, 8); // Top 8 resultados
    setReservasFiltradas(filtrados);
  }, [searchReservaQuery, services]);

  // Manejador al seleccionar una reserva existente
  const handleSeleccionarReserva = (reserva) => {
    setReservaSeleccionada(reserva);
    setSearchReservaQuery(`${reserva.nombre} ${reserva.apellido || ''} - ${reserva.hotel || ''} (Folio: ${reserva.reserva || reserva.id})`);
    setReservasFiltradas([]);

    const nombreCompleto = `${reserva.nombre || ''} ${reserva.apellido || ''}`.trim();
    
    setCotizacion(prev => {
      const nuevasEtapas = [...prev.etapas];
      // Si la etapa de llegada no tiene destino, asignar el hotel de la reserva
      if (nuevasEtapas[0] && !nuevasEtapas[0].destino) {
        nuevasEtapas[0].destino = reserva.hotel || '';
      }
      // Si la etapa de salida no tiene origen, asignar el hotel de la reserva
      const idxSalida = nuevasEtapas.findIndex(e => e.tipo === 'salida');
      if (idxSalida !== -1 && !nuevasEtapas[idxSalida].origen) {
        nuevasEtapas[idxSalida].origen = reserva.hotel || '';
      }

      // Si la reserva tiene fecha/hora, sugerirla
      if (nuevasEtapas[0] && !nuevasEtapas[0].fecha && reserva.fecha) {
        nuevasEtapas[0].fecha = reserva.fecha;
      }
      if (nuevasEtapas[0] && !nuevasEtapas[0].hora && reserva.hora) {
        nuevasEtapas[0].hora = reserva.hora;
      }

      return {
        ...prev,
        nombreCliente: nombreCompleto || prev.nombreCliente,
        hotelPrincipal: reserva.hotel || prev.hotelPrincipal,
        pax: reserva.pax ? String(reserva.pax) : prev.pax,
        aerolineaVuelo: reserva.vuelo || prev.aerolineaVuelo,
        metodoPago: reserva.metodoPago || prev.metodoPago,
        horaCheckout: reserva.pickUp || prev.horaCheckout,
        etapas: nuevasEtapas
      };
    });

    if (showToast) {
      showToast(`Datos cargados desde la reserva de ${reserva.nombre || 'cliente'}`, 'success');
    }
  };

  // Limpiar vinculación
  const limpiarVinculacion = () => {
    setVincularReserva(false);
    setReservaSeleccionada(null);
    setSearchReservaQuery('');
  };

  // Agregar una nueva etapa / destino
  const agregarDestino = () => {
    setCotizacion(prev => {
      const cantidadDestinos = prev.etapas.filter(e => e.tipo === 'destino').length + 1;
      const nuevoDestino = {
        id: `etapa-${Date.now()}`,
        tipo: 'destino',
        etiquetaES: `Destino ${cantidadDestinos}`,
        etiquetaEN: `Destination ${cantidadDestinos}`,
        origen: prev.hotelPrincipal || '',
        destino: '',
        fecha: '',
        hora: '',
        precio: ''
      };

      // Si hay etapa de salida, insertar antes de ella
      const idxSalida = prev.etapas.findIndex(e => e.tipo === 'salida');
      let nuevasEtapas = [];
      if (idxSalida !== -1) {
        nuevasEtapas = [
          ...prev.etapas.slice(0, idxSalida),
          nuevoDestino,
          ...prev.etapas.slice(idxSalida)
        ];
      } else {
        nuevasEtapas = [...prev.etapas, nuevoDestino];
      }

      return {
        ...prev,
        etapas: nuevasEtapas
      };
    });

    if (showToast) {
      showToast('Nuevo destino agregado al itinerario', 'success');
    }
  };

  // Eliminar una etapa
  const eliminarEtapa = (id) => {
    setCotizacion(prev => {
      if (prev.etapas.length <= 1) {
        if (showToast) showToast('Debe haber al menos un tramo en el presupuesto', 'error');
        return prev;
      }
      const filtradas = prev.etapas.filter(e => e.id !== id);
      return { ...prev, etapas: filtradas };
    });
  };

  // Modificar campo de una etapa
  const handleEtapaChange = (id, field, value) => {
    setCotizacion(prev => {
      const nuevasEtapas = prev.etapas.map(e => {
        if (e.id === id) {
          return { ...e, [field]: value };
        }
        return e;
      });

      // Si se asignan precios individuales, calcular el total automáticamente
      let nuevoTotal = prev.precioTotal;
      if (field === 'precio') {
        const suma = nuevasEtapas.reduce((acc, curr) => {
          const val = parseFloat(curr.precio) || 0;
          return acc + val;
        }, 0);
        if (suma > 0) {
          nuevoTotal = suma.toFixed(2);
        }
      }

      return {
        ...prev,
        etapas: nuevasEtapas,
        precioTotal: nuevoTotal
      };
    });
  };

  // Modificar campo de la cotización general
  const handleCotizacionChange = (field, value) => {
    setCotizacion(prev => {
      const updated = { ...prev, [field]: value };

      // Si cambió el hotel principal, sincronizarlo en las etapas que correspondan
      if (field === 'hotelPrincipal' && value) {
        updated.etapas = prev.etapas.map(e => {
          if (e.tipo === 'llegada' && (!e.destino || e.destino === prev.hotelPrincipal)) {
            return { ...e, destino: value };
          }
          if (e.tipo === 'salida' && (!e.origen || e.origen === prev.hotelPrincipal)) {
            return { ...e, origen: value };
          }
          return e;
        });
      }

      return updated;
    });
  };

  // Guardar cotización actual en el historial
  const handleGuardarCotizacion = () => {
    if (!cotizacion.nombreCliente.trim()) {
      if (showToast) showToast('Por favor ingrese el nombre del cliente', 'error');
      return;
    }

    const nuevaCotizacion = {
      ...cotizacion,
      fechaGuardado: new Date().toISOString(),
      idiomaGuardado: idioma
    };

    const indexExistente = historialCotizaciones.findIndex(c => c.id === cotizacion.id);
    let nuevoHistorial;
    if (indexExistente >= 0) {
      nuevoHistorial = [...historialCotizaciones];
      nuevoHistorial[indexExistente] = nuevaCotizacion;
      if (showToast) showToast(`Presupuesto ${cotizacion.folio} actualizado`, 'success');
    } else {
      nuevoHistorial = [nuevaCotizacion, ...historialCotizaciones];
      if (showToast) showToast(`Presupuesto ${cotizacion.folio} guardado en el historial`, 'success');
    }

    guardarEnStorage(nuevoHistorial);
  };

  // Crear una nueva cotización limpia
  const handleNuevoPresupuesto = () => {
    limpiarVinculacion();
    setCotizacion({
      id: `COT-${Date.now()}`,
      folio: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
      fechaEmision: new Date().toISOString().split('T')[0],
      estado: 'EN REVISIÓN',
      nombreCliente: '',
      pax: '2',
      aerolineaVuelo: '',
      hotelPrincipal: '',
      metodoPago: 'Pendiente / Efectivo',
      horaCheckout: '',
      precioTotal: '0.00',
      moneda: 'USD',
      notasPersonalizadas: '',
      etapas: [
        {
          id: 'etapa-1',
          tipo: 'llegada',
          etiquetaES: 'Llegada',
          etiquetaEN: 'Arrival',
          origen: 'Aeropuerto SJD',
          destino: '',
          fecha: '',
          hora: '',
          precio: ''
        },
        {
          id: 'etapa-2',
          tipo: 'destino',
          etiquetaES: 'Destino 1',
          etiquetaEN: 'Destination 1',
          origen: '',
          destino: '',
          fecha: '',
          hora: '',
          precio: ''
        },
        {
          id: 'etapa-3',
          tipo: 'salida',
          etiquetaES: 'Retorno (Salida)',
          etiquetaEN: 'Departure / Return',
          origen: '',
          destino: 'Aeropuerto SJD',
          fecha: '',
          hora: '',
          precio: ''
        }
      ]
    });
    setActiveSubTab('editor');
    if (showToast) showToast('Formulario de presupuesto listo', 'success');
  };

  // Cargar una cotización del historial al editor
  const handleCargarCotizacion = (cotiz) => {
    setCotizacion(cotiz);
    if (cotiz.idiomaGuardado) {
      setIdioma(cotiz.idiomaGuardado);
    }
    setActiveSubTab('editor');
    if (showToast) showToast(`Cotización ${cotiz.folio} cargada en el editor`, 'success');
  };

  // Eliminar cotización del historial
  const handleEliminarCotizacion = (id, folio) => {
    if (!window.confirm(`¿Estás seguro de eliminar el presupuesto ${folio}?`)) return;
    const filtrado = historialCotizaciones.filter(c => c.id !== id);
    guardarEnStorage(filtrado);
    if (showToast) showToast(`Presupuesto ${folio} eliminado`, 'success');
  };

  // Generar y descargar PDF Nativo con jsPDF + html2canvas
  const handleDescargarPDF = async () => {
    const elemento = ticketRef.current;
    if (!elemento) {
      if (showToast) showToast('No se encontró el elemento del ticket', 'error');
      return;
    }

    try {
      setGenerandoPDF(true);
      if (showToast) showToast('Generando PDF nativo de alta resolución...', 'success');

      // Si no están cargadas las librerías en window, intentar cargar o esperar
      if (!window.html2canvas || !window.jspdf) {
        throw new Error('Librerías de PDF no disponibles aún');
      }

      const canvas = await window.html2canvas(elemento, {
        scale: 2.5, // Alta resolución para nitidez vectorial
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false
      });

      const imgData = canvas.toDataURL('image/png');
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF('p', 'mm', 'a4');
      
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 5, pdfWidth, pdfHeight);

      const nombreLimpio = (cotizacion.nombreCliente || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
      const filename = `Presupuesto_Ballard_${cotizacion.folio}_${nombreLimpio}.pdf`;

      pdf.save(filename);
      if (showToast) showToast('PDF descargado con éxito', 'success');
    } catch (err) {
      console.error('Error al generar PDF:', err);
      // Fallback a impresión nativa
      handleImprimirNativo();
    } finally {
      setGenerandoPDF(false);
    }
  };

  // Imprimir con diálogo del navegador (Guardar como PDF nativo de Chrome/Edge)
  const handleImprimirNativo = () => {
    const tituloOriginal = document.title;
    const nombreLimpio = (cotizacion.nombreCliente || 'Cliente').replace(/[^a-zA-Z0-9]/g, '_');
    document.title = `Presupuesto_Ballard_${cotizacion.folio}_${nombreLimpio}`;

    const estilo = document.createElement('style');
    estilo.innerHTML = `
      @media print {
        body * {
          visibility: hidden !important;
        }
        #area-impresion-presupuesto, #area-impresion-presupuesto * {
          visibility: visible !important;
        }
        #area-impresion-presupuesto {
          position: fixed !important;
          left: 0 !important;
          top: 0 !important;
          width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          box-shadow: none !important;
          border: none !important;
        }
        @page {
          size: letter portrait;
          margin: 8mm;
        }
      }
    `;
    document.head.appendChild(estilo);

    window.print();

    setTimeout(() => {
      document.title = tituloOriginal;
      if (document.head.contains(estilo)) {
        document.head.removeChild(estilo);
      }
    }, 1200);
  };

  // Copiar el contenido HTML del ticket para pegar en Word / Outlook / Excel
  const handleCopiarPortapapeles = async () => {
    const elemento = ticketRef.current;
    if (!elemento) return;
    try {
      const htmlContent = elemento.outerHTML;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const textBlob = new Blob([elemento.innerText], { type: 'text/plain' });
      
      if (navigator.clipboard && window.ClipboardItem) {
        const item = new ClipboardItem({
          'text/html': blob,
          'text/plain': textBlob
        });
        await navigator.clipboard.write([item]);
      } else {
        await navigator.clipboard.writeText(elemento.innerText);
      }
      setCopiado(true);
      if (showToast) showToast('¡Copiado con formato listo para Word o Correo!', 'success');
      setTimeout(() => setCopiado(false), 2500);
    } catch (err) {
      console.error('Error al copiar:', err);
      if (showToast) showToast('No se pudo copiar automáticamente', 'error');
    }
  };

  // -------------------------------------------------------------------------------------
  // LÓGICA DE CONVERSIÓN DE COTIZACIÓN A RESERVAS EN AUTOMÁTICO (CON DETECCIÓN DE FALTANTES)
  // -------------------------------------------------------------------------------------
  const iniciarConversionAReserva = (cotiz) => {
    const c = cotiz || cotizacion;
    if (!c.nombreCliente.trim()) {
      if (showToast) showToast('Se requiere el nombre del cliente para crear reservas', 'error');
      return;
    }

    setCotizacionAConvertir(c);

    // Separar nombre y apellido si es posible
    const partesNombre = c.nombreCliente.trim().split(' ');
    const nombre = partesNombre[0] || '';
    const apellido = partesNombre.slice(1).join(' ') || '';

    // Convertir cada etapa en un candidato a servicio
    const candidatos = c.etapas.map((etapa, idx) => {
      let tipoServicio = 'Tour / Traslado';
      if (etapa.tipo === 'llegada') tipoServicio = 'Llegada';
      else if (etapa.tipo === 'salida') tipoServicio = 'Salida';

      let hotelTramo = '';
      if (etapa.tipo === 'llegada') hotelTramo = etapa.destino || c.hotelPrincipal || '';
      else if (etapa.tipo === 'salida') hotelTramo = etapa.origen || c.hotelPrincipal || '';
      else hotelTramo = etapa.destino || etapa.origen || c.hotelPrincipal || '';

      // Descripción del trayecto
      const trayectoDesc = etapa.origen && etapa.destino 
        ? `${etapa.origen} → ${etapa.destino}`
        : (etapa.tipo === 'llegada' ? `Aeropuerto SJD → ${hotelTramo}` : (etapa.tipo === 'salida' ? `${hotelTramo} → Aeropuerto SJD` : (etapa.destino || 'Destino')));

      return {
        idLocal: `conv-${idx}-${Date.now()}`,
        etapaId: etapa.id,
        nombreEtapa: etapa.etiquetaES || `Tramo ${idx + 1}`,
        reserva: c.folio,
        nombre: nombre,
        apellido: apellido,
        agencia: 'Directo',
        tipoServicio: tipoServicio,
        pax: c.pax || '2',
        telefono: '',
        fecha: etapa.fecha || (idx === 0 ? c.fechaEmision : ''),
        hora: etapa.hora || '',
        vuelo: etapa.tipo === 'llegada' ? (c.aerolineaVuelo || '') : '',
        pickUp: etapa.tipo === 'salida' ? (c.horaCheckout || etapa.hora || '') : (etapa.hora || ''),
        hotel: hotelTramo,
        cobro: etapa.precio || (idx === 0 && c.precioTotal ? c.precioTotal : ''),
        metodoPago: c.metodoPago || 'Efectivo',
        tipoViaje: 'One way',
        comentario: `Cotización ${c.folio} - ${trayectoDesc}`
      };
    });

    setServiciosAConvertir(candidatos);
    validarServiciosAConvertir(candidatos);
    setMostrarModalConversion(true);
  };

  // Validar si falta información en los servicios a convertir
  const validarServiciosAConvertir = (lista) => {
    const errs = [];
    lista.forEach((s, idx) => {
      const faltan = [];
      if (!s.fecha) faltan.push('Fecha');
      if (!s.hora && s.tipoServicio === 'Llegada') faltan.push('Hora de Vuelo / Llegada');
      if (!s.pickUp && s.tipoServicio === 'Salida') faltan.push('Hora de Pick-Up (Salida)');
      if (!s.hotel) faltan.push('Hotel / Destino');
      if (!s.pax) faltan.push('Número de PAX');
      if (faltan.length > 0) {
        errs.push({
          idx,
          nombreEtapa: s.nombreEtapa,
          faltan
        });
      }
    });
    setErroresValidacion(errs);
  };

  // Actualizar campo dentro del modal de conversión
  const handleCambioServicioConversion = (idx, field, value) => {
    setServiciosAConvertir(prev => {
      const actualizados = prev.map((item, i) => i === idx ? { ...item, [field]: value } : item);
      validarServiciosAConvertir(actualizados);
      return actualizados;
    });
  };

  // Confirmar y guardar reservas en Supabase
  const handleConfirmarCreacionReservas = async () => {
    if (erroresValidacion.length > 0) {
      if (showToast) showToast('Por favor completa los datos obligatorios marcados en rojo/amarillo', 'error');
      return;
    }

    try {
      setGuardandoReservas(true);

      // Formatear para la tabla `servicios` en Supabase
      const timestampBase = Date.now();
      const servicesToSave = serviciosAConvertir.map((s, idx) => ({
        id: `${timestampBase}_${idx}`,
        reserva: s.reserva || cotizacionAConvertir.folio,
        nombre: s.nombre,
        apellido: s.apellido,
        agencia: s.agencia || 'Directo',
        tipo_servicio: s.tipoServicio,
        pax: s.pax?.toString() || '1',
        telefono: s.telefono || '',
        fecha: s.fecha,
        vuelo: s.vuelo || '',
        pick_up: s.pickUp || '',
        tipo_viaje: 'One way',
        hora: s.hora || '',
        hotel: s.hotel,
        cobro: s.cobro?.toString() || '',
        metodo_pago: s.metodoPago || '',
        car_seat: 0,
        baby_seat: 0,
        booster: 0,
        parada_compras: false,
        comentario: s.comentario || `Generado de cotización ${cotizacionAConvertir.folio}`,
        chofer: '',
        vehiculo: '',
        proveedor: '',
        costo_proveedor: ''
      }));

      // Guardar en Supabase
      if (supabase) {
        const { error } = await supabase.from('servicios').upsert(servicesToSave);
        if (error) throw error;
      }

      // Actualizar el estado de la cotización a CONVERTIDO
      const cotizActualizada = {
        ...cotizacionAConvertir,
        estado: 'CONVERTIDO'
      };
      const index = historialCotizaciones.findIndex(c => c.id === cotizacionAConvertir.id);
      let nuevoHistorial = [...historialCotizaciones];
      if (index >= 0) {
        nuevoHistorial[index] = cotizActualizada;
      } else {
        nuevoHistorial = [cotizActualizada, ...historialCotizaciones];
      }
      guardarEnStorage(nuevoHistorial);

      if (cotizacion.id === cotizacionAConvertir.id) {
        setCotizacion(prev => ({ ...prev, estado: 'CONVERTIDO' }));
      }

      // Refrescar datos en toda la aplicación
      if (fetchAllData) {
        await fetchAllData();
      }

      setMostrarModalConversion(false);
      if (showToast) {
        showToast(`¡Se crearon con éxito ${servicesToSave.length} reservas en el sistema!`, 'success');
      }
    } catch (err) {
      console.error('Error al guardar reservas:', err);
      if (showToast) showToast('Error al crear las reservas en Supabase: ' + (err.message || 'Intente nuevamente'), 'error');
    } finally {
      setGuardandoReservas(false);
    }
  };

  // Filtrado de cotizaciones en el historial
  const cotizacionesFiltradas = historialCotizaciones.filter(c => {
    if (!filtroHistorial.trim()) return true;
    const q = filtroHistorial.toLowerCase();
    return (
      (c.nombreCliente || '').toLowerCase().includes(q) ||
      (c.folio || '').toLowerCase().includes(q) ||
      (c.hotelPrincipal || '').toLowerCase().includes(q)
    );
  });

  // Textos y etiquetas según el idioma seleccionado
  const t = {
    tituloPrincipal: idioma === 'EN' ? 'TRANSPORTATION QUOTE' : 'PRESUPUESTO DE TRANSPORTE',
    subtituloSeguro: idioma === 'EN' ? '✔ Private Transportation / Safe Ticket' : '✔ Transporte Privado / Boleto Seguro',
    badgeEstado: idioma === 'EN' 
      ? (cotizacion.estado === 'CONVERTIDO' ? 'RESERVED' : (cotizacion.estado === 'APROBADO' ? 'CONFIRMED' : 'IN REVIEW'))
      : cotizacion.estado,
    folioLabel: idioma === 'EN' ? 'FOLIO:' : 'FOLIO:',
    fechaLabel: idioma === 'EN' ? 'DATE:' : 'FECHA:',
    nombreClienteLabel: idioma === 'EN' ? 'PASSENGER / CLIENT NAME' : 'NOMBRE DEL PASAJERO / CLIENTE',
    paxLabel: idioma === 'EN' ? 'PASSENGERS (PAX)' : 'PASAJEROS (PAX)',
    vueloLabel: idioma === 'EN' ? 'AIRLINE & FLIGHT' : 'AEROLÍNEA Y VUELO',
    hotelLabel: idioma === 'EN' ? 'HOTEL / MAIN LODGING' : 'HOTEL / ALOJAMIENTO PRINCIPAL',
    metodoPagoLabel: idioma === 'EN' ? 'PAYMENT METHOD' : 'MÉTODO DE PAGO',
    horaCheckoutLabel: idioma === 'EN' ? 'RETURN TIME (CHECK-OUT)' : 'HORA DE REGRESO (CHECK-OUT)',
    itinerarioTitulo: idioma === 'EN' ? 'Requested Itinerary and Destinations' : 'Itinerario y Destinos Solicitados',
    colEtapa: idioma === 'EN' ? 'STAGE' : 'ETAPA',
    colDescripcion: idioma === 'EN' ? 'ROUTE / DESTINATION DESCRIPTION' : 'DESCRIPCIÓN DEL TRAYECTO / DESTINO',
    colFechaHora: idioma === 'EN' ? 'DATE AND TIME' : 'FECHA Y HORA',
    totalPresupuesto: idioma === 'EN' ? 'TOTAL QUOTE:' : 'TOTAL DEL PRESUPUESTO:',
    tituloInstrucciones: idioma === 'EN' ? '• How to find your driver upon arrival?' : '• ¿Cómo encontrar a su chofer a la llegada?',
    textoInstrucciones: idioma === 'EN'
      ? 'All transport companies are waiting outside the departure gate. You just have to walk to the parking lot and look for your name on a sign. We are usually located in the "GROUP EXIT" (Shadow 3 / Terminal 1). When you get there, walk into the parking lot and you will see our staff holding up your name signs.'
      : 'Todas las compañías de transporte esperan afuera de la puerta de salidas. Solo tiene que caminar hacia el estacionamiento y buscar su nombre en un letrero. Usualmente nos encontramos en la "SALIDA DE GRUPOS" (Shadow 3 / Terminal 1). Cuando llegue ahí, camine al estacionamiento y verá a nuestro personal sosteniendo sus letreros.'
  };

  return (
    <div className="space-y-6">
      {/* HEADER DE LA SECCIÓN DE PRESUPUESTOS */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="text-amber-500" /> Presupuestos y Cotizaciones
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Diseña, cotiza y exporta boletos de presupuesto en PDF o conviértelos directamente en Reservas reales.
          </p>
        </div>

        {/* NAVEGACIÓN ENTRE EDITOR E HISTORIAL */}
        <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveSubTab('editor')}
            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
              activeSubTab === 'editor'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Edit3 size={16} /> Diseñador de Presupuesto
          </button>
          <button
            onClick={() => setActiveSubTab('historial')}
            className={`px-4 py-2 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
              activeSubTab === 'historial'
                ? 'bg-amber-500 text-white shadow-md'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileText size={16} /> Historial
            {historialCotizaciones.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-black ${
                activeSubTab === 'historial' ? 'bg-amber-700 text-white' : 'bg-amber-200 text-amber-900'
              }`}>
                {historialCotizaciones.length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* VISTA 1: DISEÑADOR / EDITOR DE PRESUPUESTO */}
      {/* ========================================================================= */}
      {activeSubTab === 'editor' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* PANEL IZQUIERDO: FORMULARIO Y CONTROLES (5 columnas) */}
          <div className="lg:col-span-5 space-y-5">
            {/* BARRA DE ACCIÓN RÁPIDA: IDIOMA Y BOTÓN NUEVO */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Languages className="text-amber-500" size={18} />
                <span className="text-xs font-bold uppercase text-slate-600">Idioma del Ticket:</span>
                <div className="flex bg-slate-100 rounded-lg p-1 border border-slate-200">
                  <button
                    onClick={() => setIdioma('ES')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      idioma === 'ES' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🇪🇸 Español
                  </button>
                  <button
                    onClick={() => setIdioma('EN')}
                    className={`px-3 py-1 rounded text-xs font-bold transition-all ${
                      idioma === 'EN' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                    }`}
                  >
                    🇺🇸 English
                  </button>
                </div>
              </div>

              <button
                onClick={handleNuevoPresupuesto}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                title="Limpiar formulario para un nuevo presupuesto"
              >
                + Nuevo
              </button>
            </div>

            {/* SELECCIÓN: VINCULAR CON RESERVA EXISTENTE O INGRESO MANUAL */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-3">
                <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                  <Users size={18} className="text-blue-600" />
                  ¿El cliente ya tiene reserva en el sistema?
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={vincularReserva}
                    onChange={(e) => {
                      setVincularReserva(e.target.checked);
                      if (!e.target.checked) limpiarVinculacion();
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {vincularReserva ? (
                <div className="space-y-2 relative">
                  <label className="text-xs font-bold text-slate-600 uppercase">Buscar Reserva Previa (Nombre, Folio o Hotel)</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 text-slate-400" size={16} />
                    <input
                      type="text"
                      value={searchReservaQuery}
                      onChange={(e) => setSearchReservaQuery(e.target.value)}
                      placeholder="Escribe el nombre o folio del cliente..."
                      className="w-full pl-9 pr-8 py-2 text-sm border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-blue-50/30"
                    />
                    {searchReservaQuery && (
                      <button
                        onClick={limpiarVinculacion}
                        className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>

                  {/* RESULTADOS DEL BUSCADOR */}
                  {reservasFiltradas.length > 0 && (
                    <div className="absolute z-30 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl max-h-60 overflow-y-auto divide-y divide-slate-100">
                      {reservasFiltradas.map((r) => (
                        <div
                          key={r.id}
                          onClick={() => handleSeleccionarReserva(r)}
                          className="p-3 hover:bg-blue-50 cursor-pointer transition-colors flex justify-between items-center text-xs"
                        >
                          <div>
                            <p className="font-bold text-slate-800">{r.nombre} {r.apellido}</p>
                            <p className="text-slate-500 text-[11px]">{r.hotel} • {r.pax} PAX • {r.fecha}</p>
                          </div>
                          <span className="font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-[10px] font-bold">
                            {r.reserva || r.id?.slice(-5)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {reservaSeleccionada && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                      <span className="flex items-center gap-1.5 font-medium">
                        <CheckCircle size={14} className="text-emerald-600" />
                        Vinculado a reserva: <strong>{reservaSeleccionada.reserva || reservaSeleccionada.id}</strong>
                      </span>
                      <button onClick={limpiarVinculacion} className="text-emerald-700 underline text-[11px]">
                        Desvincular
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Modo Manual: Escribe libremente los datos del cliente y su itinerario personalizado.
                </p>
              )}
            </div>

            {/* DATOS DEL CLIENTE Y CONFIGURACIÓN */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide border-b pb-2 flex items-center justify-between">
                <span>Datos del Cliente y Cotización</span>
                <span className="text-xs font-mono text-slate-500 font-normal">Folio: {cotizacion.folio}</span>
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Nombre del Pasajero / Cliente *</label>
                  <input
                    type="text"
                    value={cotizacion.nombreCliente}
                    onChange={(e) => handleCotizacionChange('nombreCliente', e.target.value)}
                    placeholder="Ej. John Doe / Familia Martínez"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none font-semibold text-slate-800"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Pasajeros (PAX)</label>
                  <input
                    type="number"
                    min="1"
                    value={cotizacion.pax}
                    onChange={(e) => handleCotizacionChange('pax', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Aerolínea y Vuelo</label>
                  <input
                    type="text"
                    value={cotizacion.aerolineaVuelo}
                    onChange={(e) => handleCotizacionChange('aerolineaVuelo', e.target.value)}
                    placeholder="Ej. AA 1234 / DL 567"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none uppercase"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Hotel o Alojamiento Principal</label>
                  <input
                    type="text"
                    list="lista-hoteles-cotizacion"
                    value={cotizacion.hotelPrincipal}
                    onChange={(e) => handleCotizacionChange('hotelPrincipal', e.target.value)}
                    placeholder="Selecciona o escribe el hotel..."
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                  <datalist id="lista-hoteles-cotizacion">
                    {LISTA_HOTELES.map((h, i) => (
                      <option key={i} value={h.nombre} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Método de Pago</label>
                  <select
                    value={cotizacion.metodoPago}
                    onChange={(e) => handleCotizacionChange('metodoPago', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white"
                  >
                    <option value="Pendiente / Efectivo">Pendiente / Efectivo</option>
                    <option value="Efectivo Chófer">Efectivo Chófer</option>
                    <option value="Tarjeta / Stripe">Tarjeta / Stripe</option>
                    <option value="Transferencia">Transferencia</option>
                    <option value="Prepago">Prepago</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Hora Retorno (Check-out)</label>
                  <input
                    type="time"
                    value={cotizacion.horaCheckout}
                    onChange={(e) => handleCotizacionChange('horaCheckout', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>

                <div className="col-span-2">
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">Total del Presupuesto (USD) *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={cotizacion.precioTotal}
                      onChange={(e) => handleCotizacionChange('precioTotal', e.target.value)}
                      placeholder="0.00"
                      className="w-full pl-8 pr-16 py-2 text-base font-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none text-slate-800"
                    />
                    <span className="absolute right-3 top-2.5 text-xs font-bold text-slate-500">USD</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SECCIÓN DE DESTINOS / ETAPAS DINÁMICAS */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b pb-2">
                <div>
                  <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wide">Itinerario y Destinos</h2>
                  <p className="text-xs text-slate-500">Agrega o quita tramos libremente con su fecha y hora</p>
                </div>
                <button
                  type="button"
                  onClick={agregarDestino}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1 shadow-sm transition-colors"
                >
                  <Plus size={14} /> + Agregar Destino
                </button>
              </div>

              <div className="space-y-3 max-h-[380px] overflow-y-auto pr-1">
                {cotizacion.etapas.map((etapa, idx) => (
                  <div
                    key={etapa.id}
                    className={`p-3 rounded-xl border transition-all ${
                      etapa.tipo === 'llegada'
                        ? 'bg-slate-50 border-slate-200'
                        : etapa.tipo === 'salida'
                        ? 'bg-amber-50/40 border-amber-200'
                        : 'bg-white border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                        <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 flex items-center justify-center text-[10px] font-bold">
                          {idx + 1}
                        </span>
                        {idioma === 'EN' ? etapa.etiquetaEN : etapa.etiquetaES}
                      </span>
                      {cotizacion.etapas.length > 1 && (
                        <button
                          type="button"
                          onClick={() => eliminarEtapa(etapa.id)}
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
                          title="Eliminar este tramo"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Origen</label>
                        <input
                          type="text"
                          value={etapa.origen}
                          onChange={(e) => handleEtapaChange(etapa.id, 'origen', e.target.value)}
                          placeholder="Lugar origen"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">Destino</label>
                        <input
                          type="text"
                          value={etapa.destino}
                          onChange={(e) => handleEtapaChange(etapa.id, 'destino', e.target.value)}
                          placeholder="Lugar destino"
                          className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Calendar size={10} /> Fecha
                        </label>
                        <input
                          type="date"
                          value={etapa.fecha}
                          onChange={(e) => handleEtapaChange(etapa.id, 'fecha', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Clock size={10} /> Hora
                        </label>
                        <input
                          type="time"
                          value={etapa.hora}
                          onChange={(e) => handleEtapaChange(etapa.id, 'hora', e.target.value)}
                          className="w-full px-2 py-1.5 border border-slate-300 rounded focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN PRINCIPALES */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2.5">
              <button
                onClick={handleGuardarCotizacion}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
              >
                <CheckCircle size={18} className="text-amber-400" />
                Guardar Presupuesto en Historial
              </button>

              <button
                onClick={() => iniciarConversionAReserva(cotizacion)}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
              >
                <ArrowRight size={18} />
                Convertir a Reserva(s) en el Sistema
              </button>
            </div>
          </div>

          {/* PANEL DERECHO: VISTA PREVIA DEL TICKET (7 columnas) */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* BARRA DE HERRAMIENTAS DE DESCARGA E IMPRESIÓN */}
            <div className="w-full max-w-[800px] mb-4 flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-500 uppercase">Vista previa en tiempo real:</span>
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                  {idioma === 'ES' ? 'Español' : 'English'}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* BOTÓN COPIAR AL PORTAPAPELES */}
                <button
                  onClick={handleCopiarPortapapeles}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 border border-slate-300 transition-colors"
                  title="Copiar para pegar en Word, Excel o Correo"
                >
                  {copiado ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiado ? '¡Copiado!' : 'Copiar (Word)'}
                </button>

                {/* BOTÓN GUARDAR PDF NATIVO */}
                <button
                  onClick={handleDescargarPDF}
                  disabled={generandoPDF}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors disabled:opacity-50"
                  title="Descargar archivo PDF nativo"
                >
                  <Download size={14} />
                  {generandoPDF ? 'Generando...' : 'Descargar PDF'}
                </button>

                {/* BOTÓN IMPRIMIR / PDF DEL NAVEGADOR */}
                <button
                  onClick={handleImprimirNativo}
                  className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-1.5 px-3 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  title="Imprimir o Guardar como PDF de Alta Definición con el navegador"
                >
                  <Printer size={14} /> Imprimir / PDF
                </button>
              </div>
            </div>

            {/* CONTENEDOR DEL TICKET (Mismo formato HTML limpio del cliente) */}
            <div className="w-full flex justify-center overflow-x-auto pb-6">
              <div
                id="area-impresion-presupuesto"
                ref={ticketRef}
                style={{
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  width: '100%',
                  maxWidth: '800px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e0e0e0',
                  borderRadius: '12px',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
                  overflow: 'hidden'
                }}
              >
                {/* ENCABEZADO */}
                <table style={{ backgroundColor: '#161D2D', color: 'white', width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '25px', width: '60%', verticalAlign: 'top', border: 'none' }}>
                        <h1 style={{ margin: 0, color: '#FFB300', fontSize: '32px', fontWeight: 900, letterSpacing: '1px' }}>BALLARD</h1>
                        <p style={{ margin: 0, fontSize: '14px', letterSpacing: '1px', color: '#ffffff' }}>TOUR SERVICES</p>
                        <br />
                        <h2 style={{ margin: 0, fontSize: '20px', color: '#ffffff', fontWeight: 700 }}>{t.tituloPrincipal}</h2>
                        <p style={{ margin: 0, fontSize: '12px', color: '#FFB300' }}>{t.subtituloSeguro}</p>
                      </td>
                      <td style={{ padding: '25px', textAlign: 'right', width: '40%', verticalAlign: 'top', border: 'none' }}>
                        <div style={{ backgroundColor: '#FFB300', color: '#161D2D', fontWeight: 'bold', padding: '5px 15px', borderRadius: '5px', display: 'inline-block', fontSize: '14px', marginBottom: '10px' }}>
                          {t.badgeEstado}
                        </div>
                        <p style={{ margin: 0, fontSize: '12px', color: '#a0aabf', fontFamily: 'monospace' }}>
                          {t.folioLabel} {cotizacion.folio}
                        </p>
                        <p style={{ margin: '5px 0 0 0', fontSize: '12px', color: '#a0aabf' }}>
                          {t.fechaLabel} {cotizacion.fechaEmision || new Date().toISOString().split('T')[0]}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* CUERPO DEL TICKET */}
                <div style={{ padding: '20px 25px' }}>
                  {/* DATOS DEL CLIENTE Y VUELO */}
                  <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', border: 'none' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '40%', padding: '8px 15px', verticalAlign: 'top', border: 'none' }}>
                          <div style={{ fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.nombreClienteLabel}
                          </div>
                          <div style={{ fontSize: '18px', color: '#161D2D', fontWeight: 'bold' }}>
                            {cotizacion.nombreCliente || (idioma === 'EN' ? '[Client Name]' : '[Nombre del Cliente]')}
                          </div>
                        </td>
                        <td style={{ width: '20%', padding: '8px 15px', verticalAlign: 'top', border: 'none' }}>
                          <div style={{ fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.paxLabel}
                          </div>
                          <div style={{ fontSize: '16px', color: '#161D2D', fontWeight: 'bold' }}>
                            {cotizacion.pax || '1'}
                          </div>
                        </td>
                        <td style={{ width: '40%', padding: '8px 15px', verticalAlign: 'top', border: 'none' }}>
                          <div style={{ fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.vueloLabel}
                          </div>
                          <div style={{ fontSize: '16px', color: '#161D2D', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {cotizacion.aerolineaVuelo || (idioma === 'EN' ? '[Airline & Flight]' : '[Aerolínea y Vuelo]')}
                          </div>
                        </td>
                      </tr>
                      <tr><td colSpan="3" style={{ height: '15px', padding: 0, border: 'none' }}></td></tr>
                      <tr>
                        <td style={{ padding: '8px 15px', verticalAlign: 'top', border: 'none' }}>
                          <div style={{ fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.hotelLabel}
                          </div>
                          <div style={{ fontSize: '16px', color: '#161D2D', fontWeight: 'bold' }}>
                            {cotizacion.hotelPrincipal || (idioma === 'EN' ? '[Hotel or Villa Name]' : '[Nombre del Hotel o Villa]')}
                          </div>
                        </td>
                        <td style={{ padding: '8px 15px', verticalAlign: 'top', border: 'none' }}>
                          <div style={{ fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.metodoPagoLabel}
                          </div>
                          <div style={{ fontSize: '16px', color: '#161D2D', fontWeight: 'bold' }}>
                            {cotizacion.metodoPago || (idioma === 'EN' ? '[Pending / Cash]' : '[Pendiente / Efectivo]')}
                          </div>
                        </td>
                        <td style={{ padding: '8px 15px', verticalAlign: 'top', border: 'none' }}>
                          <div style={{ fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.horaCheckoutLabel}
                          </div>
                          <div style={{ fontSize: '16px', color: '#D97706', fontWeight: 'bold' }}>
                            {cotizacion.horaCheckout ? `${cotizacion.horaCheckout} HRS` : '[HH:MM HRS]'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  <hr style={{ border: 0, borderTop: '2px dashed #e0e0e0', margin: '20px 0' }} />

                  {/* ITINERARIO / OPCIONES DE DESTINO */}
                  <h3 style={{ color: '#161D2D', marginTop: 0, fontSize: '18px', borderBottom: '2px solid #161D2D', paddingBottom: '5px', display: 'inline-block', fontWeight: 700 }}>
                    {t.itinerarioTitulo}
                  </h3>

                  <table style={{ width: '100%', marginBottom: '25px', borderBottom: '1px solid #eee', borderCollapse: 'collapse', border: 'none' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f9f9f9' }}>
                        <th style={{ width: '25%', padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colEtapa}
                        </th>
                        <th style={{ width: '45%', padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colDescripcion}
                        </th>
                        <th style={{ width: '30%', padding: '10px', borderBottom: '1px solid #ddd', textAlign: 'left', fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colFechaHora}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion.etapas.map((etapa) => {
                        const esSalida = etapa.tipo === 'salida';
                        const backgroundFila = esSalida ? '#fff9f0' : 'transparent';
                        const colorEtapa = esSalida ? '#D97706' : '#333333';

                        // Descripción del trayecto
                        let descripcionTrayecto = '';
                        if (etapa.origen && etapa.destino) {
                          descripcionTrayecto = `${etapa.origen} → ${etapa.destino}`;
                        } else if (etapa.tipo === 'llegada') {
                          descripcionTrayecto = `Aeropuerto SJD → ${etapa.destino || cotizacion.hotelPrincipal || '[Hotel Destino]'}`;
                        } else if (etapa.tipo === 'salida') {
                          descripcionTrayecto = `${etapa.origen || cotizacion.hotelPrincipal || '[Hotel Destino]'} → Aeropuerto SJD`;
                        } else {
                          descripcionTrayecto = etapa.destino ? `Hacia ${etapa.destino}` : '[Lugar Origen → Lugar Destino]';
                        }

                        // Fecha y hora formateada
                        const fechaFormateada = etapa.fecha || '[DD-MMM-AAAA]';
                        const horaFormateada = etapa.hora || '[HH:MM]';

                        return (
                          <tr key={etapa.id} style={{ backgroundColor: backgroundFila }}>
                            <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', verticalAlign: 'top' }}>
                              <strong style={{ color: colorEtapa, fontSize: '14px' }}>
                                {idioma === 'EN' ? etapa.etiquetaEN : etapa.etiquetaES}
                              </strong>
                            </td>
                            <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', fontSize: '14px', verticalAlign: 'top', color: '#222' }}>
                              {descripcionTrayecto}
                            </td>
                            <td style={{ padding: '12px 10px', borderBottom: '1px solid #eee', fontWeight: 'bold', fontSize: '13px', verticalAlign: 'top', color: '#161D2D' }}>
                              {fechaFormateada} | {horaFormateada}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* PRECIO TOTAL */}
                  <table style={{ width: '100%', marginBottom: '20px', borderCollapse: 'collapse', border: 'none' }}>
                    <tbody>
                      <tr>
                        <td style={{ textAlign: 'right', padding: '15px', backgroundColor: '#f4f4f9', borderRadius: '8px', border: 'none' }}>
                          <span style={{ display: 'inline-block', marginRight: '15px', fontSize: '11px', color: '#7A7A7A', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {t.totalPresupuesto}
                          </span>
                          <span style={{ fontSize: '24px', color: '#161D2D', fontWeight: 900 }}>
                            $ {cotizacion.precioTotal ? parseFloat(cotizacion.precioTotal).toFixed(2) : '0.00'} USD
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* INSTRUCCIONES DE LLEGADA */}
                  <div style={{ backgroundColor: '#FFFBF0', border: '1px solid #FFE099', padding: '15px 20px', borderRadius: '8px', marginBottom: '20px' }}>
                    <h4 style={{ color: '#D97706', marginTop: 0, marginBottom: '10px', fontSize: '15px', fontWeight: 700 }}>
                      {t.tituloInstrucciones}
                    </h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#555', lineHeight: '1.5', textAlign: 'justify' }}>
                      {t.textoInstrucciones}
                    </p>
                  </div>
                </div>

                {/* PIE DE PÁGINA */}
                <table style={{ backgroundColor: '#161D2D', color: 'white', width: '100%', borderCollapse: 'collapse', border: 'none' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '15px 25px', textAlign: 'center', fontSize: '12px', border: 'none' }}>
                        <span style={{ color: '#FFB300', marginRight: '15px' }}>&#9742; +52 624 139 3497</span>
                        <span style={{ marginRight: '15px', color: '#ffffff' }}>&#9993; reservationballard@gmail.com</span>
                        <span style={{ color: '#ffffff' }}>&#127760; www.ballardtours.com</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* VISTA 2: HISTORIAL DE COTIZACIONES Y CONVERSIÓN A RESERVAS */}
      {/* ========================================================================= */}
      {activeSubTab === 'historial' && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b pb-4">
            <div>
              <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <FileText className="text-amber-500" /> Historial de Presupuestos Guardados
              </h2>
              <p className="text-xs text-slate-500">
                Consulta cotizaciones anteriores, descárgalas en PDF o conviértelas en reservas automáticas.
              </p>
            </div>

            {/* BUSCADOR DENTRO DEL HISTORIAL */}
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={filtroHistorial}
                onChange={(e) => setFiltroHistorial(e.target.value)}
                placeholder="Buscar por cliente, folio u hotel..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
              />
            </div>
          </div>

          {cotizacionesFiltradas.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <FileText size={48} className="mx-auto mb-3 opacity-30 text-amber-500" />
              <p className="text-base font-bold text-slate-600">No hay cotizaciones en el historial</p>
              <p className="text-xs text-slate-400 mt-1">Crea una nueva cotización en el diseñador y presiona "Guardar Presupuesto".</p>
              <button
                onClick={() => setActiveSubTab('editor')}
                className="mt-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors"
              >
                Ir al Diseñador
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                    <th className="p-3">Folio</th>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Cliente</th>
                    <th className="p-3">Hotel</th>
                    <th className="p-3 text-center">PAX</th>
                    <th className="p-3 text-center">Tramos</th>
                    <th className="p-3 text-right">Total USD</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cotizacionesFiltradas.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">{c.folio}</td>
                      <td className="p-3 text-slate-600">{c.fechaEmision}</td>
                      <td className="p-3 font-bold text-slate-800">{c.nombreCliente}</td>
                      <td className="p-3 text-slate-600">{c.hotelPrincipal || 'N/A'}</td>
                      <td className="p-3 text-center font-bold text-slate-700">{c.pax}</td>
                      <td className="p-3 text-center">
                        <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          {c.etapas?.length || 0}
                        </span>
                      </td>
                      <td className="p-3 text-right font-black text-slate-900 text-sm">
                        ${parseFloat(c.precioTotal || 0).toFixed(2)}
                      </td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                          c.estado === 'CONVERTIDO'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.estado === 'APROBADO'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.estado}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          {/* BOTÓN CARGAR AL EDITOR */}
                          <button
                            onClick={() => handleCargarCotizacion(c)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                            title="Editar en Diseñador"
                          >
                            <Eye size={16} />
                          </button>

                          {/* BOTÓN CONVERTIR A RESERVA */}
                          <button
                            onClick={() => iniciarConversionAReserva(c)}
                            className={`p-1.5 rounded transition-colors ${
                              c.estado === 'CONVERTIDO'
                                ? 'text-slate-400 hover:bg-slate-100'
                                : 'text-emerald-600 hover:bg-emerald-100'
                            }`}
                            title="Convertir a Reservas en el Sistema"
                          >
                            <ArrowRight size={16} />
                          </button>

                          {/* BOTÓN ELIMINAR */}
                          <button
                            onClick={() => handleEliminarCotizacion(c.id, c.folio)}
                            className="p-1.5 text-red-500 hover:bg-red-100 rounded transition-colors"
                            title="Eliminar Presupuesto"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL INTELIGENTE: CONVERTIR COTIZACIÓN A RESERVAS EN AUTOMÁTICO          */}
      {/* (Pregunta y muestra los campos faltantes para que se guarden bien)        */}
      {/* ========================================================================= */}
      {mostrarModalConversion && cotizacionAConvertir && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-8">
            {/* ENCABEZADO DEL MODAL */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <ShieldCheck className="text-emerald-400" />
                  Convertir Cotización a Reservas Reales ({cotizacionAConvertir.folio})
                </h3>
                <p className="text-xs text-slate-300 mt-1">
                  Se creará un servicio en la Base de Datos para cada tramo del itinerario. Revisa y completa los datos faltantes:
                </p>
              </div>
              <button
                onClick={() => setMostrarModalConversion(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            {/* CUERPO DEL MODAL */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* ALERTA DE ERRORES O CAMPOS FALTANTES */}
              {erroresValidacion.length > 0 ? (
                <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-3">
                  <AlertCircle className="text-amber-600 min-w-max mt-0.5" size={20} />
                  <div>
                    <h4 className="text-xs font-bold text-amber-900 uppercase">Información requerida pendiente:</h4>
                    <ul className="text-xs text-amber-800 list-disc list-inside mt-1 space-y-0.5">
                      {erroresValidacion.map((err, i) => (
                        <li key={i}>
                          <strong>{err.nombreEtapa}:</strong> Falta {err.faltan.join(', ')}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl flex items-center gap-2 text-xs text-emerald-800 font-bold">
                  <CheckCircle size={18} className="text-emerald-600" />
                  Todos los tramos tienen la información requerida lista para guardarse en la nube.
                </div>
              )}

              {/* LISTA DE SERVICIOS / RESERVAS A CREAR */}
              <div className="space-y-4">
                {serviciosAConvertir.map((srv, idx) => {
                  const errorTramo = erroresValidacion.find(e => e.idx === idx);
                  const tieneFaltantes = !!errorTramo;

                  return (
                    <div
                      key={srv.idLocal}
                      className={`p-4 rounded-xl border transition-all ${
                        tieneFaltantes
                          ? 'border-amber-400 bg-amber-50/20 shadow-xs'
                          : 'border-slate-200 bg-white shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between border-b pb-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center text-xs font-bold">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-slate-800 text-sm">{srv.nombreEtapa}</span>
                          <span className="text-xs text-slate-400">({srv.comentario})</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="text-xs text-slate-500 font-medium">Tipo:</span>
                          <select
                            value={srv.tipoServicio}
                            onChange={(e) => handleCambioServicioConversion(idx, 'tipoServicio', e.target.value)}
                            className="text-xs border border-slate-300 rounded px-2 py-1 font-bold bg-white"
                          >
                            <option value="Llegada">Llegada</option>
                            <option value="Salida">Salida</option>
                            <option value="Tour / Traslado">Tour / Traslado</option>
                            <option value="Cena">Cena</option>
                            <option value="Interhotel">Interhotel</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                        {/* FECHA */}
                        <div>
                          <label className={`block font-bold uppercase mb-1 ${!srv.fecha ? 'text-amber-700' : 'text-slate-600'}`}>
                            Fecha * {!srv.fecha && '⚠️'}
                          </label>
                          <input
                            type="date"
                            value={srv.fecha}
                            onChange={(e) => handleCambioServicioConversion(idx, 'fecha', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded text-xs ${
                              !srv.fecha ? 'border-amber-400 bg-amber-50 focus:ring-amber-500' : 'border-slate-300'
                            }`}
                          />
                        </div>

                        {/* HORA */}
                        <div>
                          <label className={`block font-bold uppercase mb-1 ${
                            srv.tipoServicio === 'Llegada' && !srv.hora ? 'text-amber-700' : 'text-slate-600'
                          }`}>
                            Hora de Vuelo / Servicio {srv.tipoServicio === 'Llegada' && !srv.hora && '⚠️'}
                          </label>
                          <input
                            type="time"
                            value={srv.hora}
                            onChange={(e) => handleCambioServicioConversion(idx, 'hora', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded text-xs ${
                              srv.tipoServicio === 'Llegada' && !srv.hora ? 'border-amber-400 bg-amber-50' : 'border-slate-300'
                            }`}
                          />
                        </div>

                        {/* HORA PICK-UP */}
                        <div>
                          <label className={`block font-bold uppercase mb-1 ${
                            srv.tipoServicio === 'Salida' && !srv.pickUp ? 'text-amber-700' : 'text-slate-600'
                          }`}>
                            Hora Pick-Up {srv.tipoServicio === 'Salida' && !srv.pickUp && '⚠️'}
                          </label>
                          <input
                            type="time"
                            value={srv.pickUp}
                            onChange={(e) => handleCambioServicioConversion(idx, 'pickUp', e.target.value)}
                            className={`w-full px-2 py-1.5 border rounded text-xs ${
                              srv.tipoServicio === 'Salida' && !srv.pickUp ? 'border-amber-400 bg-amber-50' : 'border-slate-300'
                            }`}
                          />
                        </div>

                        {/* VUELO */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">
                            Aerolínea / Vuelo
                          </label>
                          <input
                            type="text"
                            value={srv.vuelo}
                            onChange={(e) => handleCambioServicioConversion(idx, 'vuelo', e.target.value)}
                            placeholder="Ej. AA 1234"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs uppercase"
                          />
                        </div>

                        {/* HOTEL / DESTINO */}
                        <div className="md:col-span-2">
                          <label className={`block font-bold uppercase mb-1 ${!srv.hotel ? 'text-amber-700' : 'text-slate-600'}`}>
                            Hotel o Destino * {!srv.hotel && '⚠️'}
                          </label>
                          <input
                            type="text"
                            list="lista-hoteles-conversion"
                            value={srv.hotel}
                            onChange={(e) => handleCambioServicioConversion(idx, 'hotel', e.target.value)}
                            placeholder="Hotel o destino..."
                            className={`w-full px-2 py-1.5 border rounded text-xs ${
                              !srv.hotel ? 'border-amber-400 bg-amber-50' : 'border-slate-300'
                            }`}
                          />
                          <datalist id="lista-hoteles-conversion">
                            {LISTA_HOTELES.map((h, i) => (
                              <option key={i} value={h.nombre} />
                            ))}
                          </datalist>
                        </div>

                        {/* PAX */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">PAX</label>
                          <input
                            type="number"
                            min="1"
                            value={srv.pax}
                            onChange={(e) => handleCambioServicioConversion(idx, 'pax', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs"
                          />
                        </div>

                        {/* COBRO */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Cobro ($ USD)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={srv.cobro}
                            onChange={(e) => handleCambioServicioConversion(idx, 'cobro', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-800"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* PIE DEL MODAL: BOTONES DE ACCIÓN */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-between items-center">
              <button
                onClick={() => setMostrarModalConversion(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 hover:bg-slate-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>

              <button
                onClick={handleConfirmarCreacionReservas}
                disabled={guardandoReservas || erroresValidacion.length > 0}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-2 shadow-md transition-colors disabled:opacity-50"
              >
                <CheckCircle size={16} />
                {guardandoReservas ? 'Guardando en la Nube...' : `Confirmar y Crear ${serviciosAConvertir.length} Reservas`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
