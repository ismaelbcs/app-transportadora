import React, { useState, useEffect, useRef } from 'react';
import { Search, Save, Download, Send, Printer, Calendar, Clock, MapPin, Users, Car, FileText, CheckCircle, AlertCircle, X, Database, Headset, Fuel } from 'lucide-react';
import { supabase } from './supabaseClient';

const initialServiceState = {
  id: '', reserva: '', nombre: '', apellido: '', agencia: '',
  tipoServicio: 'Llegada', pax: '', telefono: '', fecha: '',
  vuelo: '', pickUp: '', tipoViaje: 'One way', hora: '', hotel: '', cobro: '',
  metodoPago: '', carSeat: 0, babySeat: 0, booster: 0, paradaCompras: false,
  comentario: '',
  fechaRegreso: '', horaPickUpRegreso: '', vueloRegreso: '', horaRegreso: '',
  chofer: '', vehiculo: '', proveedor: '', costoProveedor: ''
};

const LISTA_HOTELES = [
  // ZONA 1
  { nombre: "Cabo Azul Resort", zona: 1 },
  { nombre: "Viceroy Los Cabos", zona: 1 },
  { nombre: "Hyatt Ziva Los Cabos", zona: 1 },
  { nombre: "Royal Solaris", zona: 1 },
  { nombre: "Barceló Gran Faro", zona: 1 },
  { nombre: "Krystal Grand Los Cabos", zona: 1 },
  { nombre: "Holiday Inn Resort", zona: 1 },
  { nombre: "Posada Real", zona: 1 },
  { nombre: "Casa Natalia", zona: 1 },
  { nombre: "El Encanto Inn & Suites", zona: 1 },
  { nombre: "Alegranza Luxury Resort", zona: 1 },
  { nombre: "Las Mañanitas", zona: 1 },
  { nombre: "Royal Decameron Los Cabos", zona: 1 },
  { nombre: "Park Royal Homestay Los Cabos", zona: 1 },
  { nombre: "GR Solaris Lighthouse Los Cabos", zona: 1 },
  { nombre: "Palmilla", zona: 1 },

  // ZONA 2
  { nombre: "Las Ventanas al Paraíso (A Rosewood Resort)", zona: 2 },
  { nombre: "Grand Velas Los Cabos", zona: 2 },
  { nombre: "Chileno Bay Resort & Residences", zona: 2 },
  { nombre: "Le Blanc Spa Resort", zona: 2 },
  { nombre: "Marquis Los Cabos", zona: 2 },
  { nombre: "Hilton Los Cabos", zona: 2 },
  { nombre: "Dreams Los Cabos", zona: 2 },
  { nombre: "Garza Blanca Resort", zona: 2 },
  { nombre: "Casa del Mar / Zoëtry", zona: 2 },
  { nombre: "Mar del Cabo", zona: 2 },
  { nombre: "Las Residencias Golf & Beach Club", zona: 2 },
  { nombre: "Zadún (A Ritz-Carlton Reserve)", zona: 2 },
  { nombre: "JW Marriott Los Cabos Beach Resort & Spa", zona: 2 },
  { nombre: "Secrets Puerto Los Cabos Golf & Spa Resort", zona: 2 },
  { nombre: "Hotel El Ganzo", zona: 2 },
  { nombre: "Paradisus", zona: 2 },

  // ZONA 3
  { nombre: "Park Hyatt Los Cabos at Cabo del Sol", zona: 3 },
  { nombre: "Villas de Cabo del Sol", zona: 3 },
  { nombre: "Grand Fiesta Americana", zona: 3 },
  { nombre: "Breathless Cabo San Lucas Resort & Spa", zona: 3 },
  { nombre: "Corazón Cabo Resort & Spa", zona: 3 },
  { nombre: "ME Cabo", zona: 3 },
  { nombre: "Pueblo Bonito Blanco (Los Cabos Beach Resort)", zona: 3 },
  { nombre: "Marina Fiesta Resort & Spa", zona: 3 },
  { nombre: "Playa Grande Resort", zona: 3 },
  { nombre: "Bahía Hotel & Beach House", zona: 3 },
  { nombre: "Los Milagros Hotel", zona: 3 },
  { nombre: "The Bungalows Hotel", zona: 3 },
  { nombre: "Cabo Vista Hotel", zona: 3 },
  { nombre: "Siesta Suites", zona: 3 },
  { nombre: "Montage Los Cabos", zona: 3 },
  { nombre: "Riu Palace Cabo San Lucas", zona: 3 },
  { nombre: "Riu Palace Baja California", zona: 3 },
  { nombre: "Riu Santa Fe", zona: 3 },
  { nombre: "City Express Plus by Marriott Cabo San Lucas", zona: 3 },
  { nombre: "Holiday Inn Express Cabo San Lucas", zona: 3 },
  { nombre: "Fairfield Inn by Marriott Los Cabos", zona: 3 },
  { nombre: "Villa del Arco Beach Resort & Spa", zona: 3 },
  { nombre: "Villa del Palmar Beach Resort & Spa", zona: 3 },
  { nombre: "Villa La Estancia Beach Resort & Spa", zona: 3 },
  { nombre: "El Tezal", zona: 3 },
  { nombre: "Villas del Tezal", zona: 3 },
  { nombre: "Casas de Pedregal", zona: 3 },
  { nombre: "Villas de Pedregal", zona: 3 },
  { nombre: "The Cape, a Thompson Hotel", zona: 3 },
  { nombre: "Misiones del Cabo", zona: 3 },
  { nombre: "Cabo Bello", zona: 3 },
  { nombre: "Villas de Cabo Bello", zona: 3 },
  { nombre: "Sirena del Mar (Hyatt Vacation Club)", zona: 3 },
  { nombre: "Esperanza, Auberge Resorts Collection", zona: 3 },
  { nombre: "Hacienda Encantada Resort & Residences", zona: 3 },
  { nombre: "Vista Encantada Spa Resort & Residences", zona: 3 },
  { nombre: "Villas de Hacienda Encantada", zona: 3 },
  { nombre: "Hacienda del Mar Los Cabos Resort", zona: 3 },

  // ZONA 4
  { nombre: "Waldorf Astoria Los Cabos Pedregal", zona: 4 },
  { nombre: "Nobu Hotel Los Cabos", zona: 4 },
  { nombre: "Hard Rock Hotel Los Cabos", zona: 4 },
  { nombre: "Pueblo Bonito Sunset Beach", zona: 4 },
  { nombre: "Pueblo Bonito Pacífica (y The Towers)", zona: 4 },
  { nombre: "Grand Solmar Pacific Dunes", zona: 4 },
  { nombre: "Diamante Cabo San Lucas", zona: 4 },
  { nombre: "Montecristo Estates Luxury Villas", zona: 4 },
  { nombre: "Quivira Novaispania Residences", zona: 4 },
  { nombre: "The St. Regis Los Cabos at Quivira", zona: 4 }
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState(initialServiceState);
  const [activeTab, setActiveTab] = useState('form');

  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  const [rollDate, setRollDate] = useState(new Date().toISOString().split('T')[0]);
  const [rollData, setRollData] = useState([]);

  const [callCenterServices, setCallCenterServices] = useState([]);
  const [cierreFilters, setCierreFilters] = useState({ startDate: '', endDate: '', vehiculo: '', isCallCenter: false });

  // Nuevo Formulario de ingreso para el Call Center
  const [ccInput, setCcInput] = useState('');

  const initialExpenseState = { fecha: new Date().toISOString().split('T')[0], chofer: '', vehiculo: '', gasolina: '', casetas: '' };
  const [fleetExpenses, setFleetExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(initialExpenseState);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [renderData, setRenderData] = useState(null);

  const calcularPrecioCierre = (hotelName, precioOriginal, vehiculoFiltro) => {
    // Si no están filtrando por Expedition, devolvemos el precio original
    if (vehiculoFiltro !== 'Expedition') return precioOriginal;

    // Buscamos a qué zona pertenece el hotel
    const hotelEncontrado = LISTA_HOTELES.find(h =>
      h.nombre.trim().toLowerCase() === (hotelName || '').trim().toLowerCase()
    );

    // Si el hotel no está en la lista, devolvemos el precio original
    if (!hotelEncontrado) return precioOriginal;

    // Asignamos la tarifa según la zona
    switch (hotelEncontrado.zona) {
      case 1: return 45;
      case 2: return 48.5;
      case 3: return 52;
      case 4: return 55;
      default: return precioOriginal;
    }
  };

  const shareRef = useRef(null);
  const signRef = useRef(null);
  const rollRef = useRef(null);

  // Función para descargar todos los datos desde Supabase
  const fetchAllData = async () => {
    try {
      // 1. Traer servicios
      const { data: serviciosData, error: serviciosError } = await supabase
        .from('servicios')
        .select('*');
      if (serviciosError) throw serviciosError;

      // Mapear los nombres de la base de datos (con guion bajo) al formato de tu React (CamelCase)
      const formattedServices = (serviciosData || []).map(s => ({
        id: s.id, reserva: s.reserva, nombre: s.nombre, apellido: s.apellido, agencia: s.agencia,
        tipoServicio: s.tipo_servicio, pax: s.pax, telefono: s.telefono, fecha: s.fecha,
        vuelo: s.vuelo, pickUp: s.pick_up, tipoViaje: s.tipo_viaje, hora: s.hora, hotel: s.hotel, cobro: s.cobro,
        metodoPago: s.metodo_pago, carSeat: s.car_seat, babySeat: s.baby_seat, booster: s.booster, paradaCompras: s.parada_compras,
        comentario: s.comentario, chofer: s.chofer, vehiculo: s.vehiculo, proveedor: s.proveedor, costoProveedor: s.costo_proveedor
      }));
      setServices(formattedServices);

      // 2. Traer Call Center
      const { data: ccData, error: ccError } = await supabase
        .from('call_center')
        .select('*');
      if (ccError) throw ccError;

      const formattedCC = (ccData || []).map(cc => ({
        id: cc.id, fechaSistema: cc.fecha_sistema, fechaCliente: cc.fecha_cliente,
        cliente: cc.cliente, reserva: cc.reserva, accion: cc.accion, comision: cc.comision, rawMessage: cc.raw_message
      }));
      setCallCenterServices(formattedCC);

      // 3. Traer Gastos de Flota
      const { data: fleetData, error: fleetError } = await supabase
        .from('gastos_flota')
        .select('*');
      if (fleetError) throw fleetError;

      const formattedFleet = (fleetData || []).map(g => ({
        id: g.id, fecha: g.fecha, chofer: g.chofer, vehiculo: g.vehiculo, gasolina: g.gasolina, casetas: g.casetas, gastoTotal: g.gasto_total
      }));
      setFleetExpenses(formattedFleet);

    } catch (error) {
      console.error("Error descargando datos de Supabase:", error);
      showToast('Error al conectar con la base de datos en la nube', 'error');
    }
  };

  useEffect(() => {
    // Llamar a la descarga de datos al abrir la app
    fetchAllData();

    // Mantener la carga de librerías para PDFs que ya tenías
    const loadScript = (src) => {
      return new Promise((resolve, reject) => {
        if (document.querySelector(`script[src="${src}"]`)) return resolve();
        const script = document.createElement('script');
        script.src = src;
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
      });
    };

    Promise.all([
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js'),
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'),
      // Agregamos la librería mágica para crear Excels
      loadScript('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js')
    ]).then(() => setLibsLoaded(true)).catch(() => showToast('Error cargando librerías', 'error'));
  }, []);

  useEffect(() => {
    if (activeTab === 'roll') {
      // 1. Filtramos los servicios por la fecha seleccionada
      const filtered = services.filter(s => s.fecha === rollDate);

      // 2. Ordenamos por hora (de más temprano a más tarde)
      const sorted = filtered.sort((a, b) => (a.hora || '').localeCompare(b.hora || ''));

      // 3. Guardamos los datos ordenados en la tabla
      setRollData(sorted);
    }
  }, [rollDate, services, activeTab]);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCurrentService(prev => ({
      ...prev,
      // Si el campo modificado es la reserva, lo forzamos a mayúsculas de inmediato
      [name]: type === 'checkbox' ? checked : (name === 'reserva' ? value.toUpperCase() : value)
    }));
  };

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.length > 2) {
      const lower = term.toLowerCase();
      const results = services.filter(s =>
        (s.nombre || '').toLowerCase().includes(lower) ||
        (s.apellido || '').toLowerCase().includes(lower) ||
        (s.reserva || '').toLowerCase().includes(lower) ||
        (s.hotel || '').toLowerCase().includes(lower) ||
        (s.fecha || '').toLowerCase().includes(lower)
      );
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  };

  const selectServiceToEdit = (srv) => {
    setCurrentService({ ...initialServiceState, ...srv, tipoViaje: 'One way' });
    setIsEditing(true);
    setSearchTerm('');
    setSearchResults([]);
  };

  const generarNumeroReserva = async () => {
    try {
      showToast('Generando número de reserva...');

      // 1. Buscamos en Supabase todos los números de reserva que empiecen con BTS
      const { data, error } = await supabase
        .from('servicios')
        .select('reserva')
        .like('reserva', 'BTS%');

      if (error) throw error;

      let siguienteNumero = 1;

      if (data && data.length > 0) {
        // 2. Extraemos los números, los convertimos a enteros y buscamos el más alto
        const numeros = data.map(item => {
          const clicks = item.reserva.replace('BTS', '');
          return parseInt(clicks, 10) || 0;
        });

        const maxNumero = Math.max(...numeros);
        if (maxNumero > 0) {
          siguienteNumero = maxNumero + 1;
        }
      }

      // 3. Formateamos el número para que siempre tenga 5 dígitos (ej. BTS00001, BTS00015)
      const nuevoCodigo = `BTS${siguienteNumero.toString().padStart(5, '0')}`;

      // 4. Lo inyectamos directamente en el formulario actual
      setCurrentService(prev => ({ ...prev, reserva: nuevoCodigo }));
      showToast(`Código ${nuevoCodigo} generado`);
    } catch (error) {
      console.error("Error al generar reserva:", error);
      showToast('Error al conectar con la base de datos', 'error');
    }
  };

  const saveForm = async () => {
    let servicesToSave = [];

    // Preparar los datos mapeando a los nombres de las columnas de Supabase
    if (isEditing) {
      // MODO EDICIÓN: Solo empaquetamos el servicio que se está modificando
      servicesToSave.push({
        id: currentService.id,
        reserva: currentService.reserva,
        nombre: currentService.nombre,
        apellido: currentService.apellido,
        agencia: currentService.agencia,
        tipo_servicio: currentService.tipoServicio,
        pax: currentService.pax?.toString(),
        telefono: currentService.telefono,
        fecha: currentService.fecha,
        vuelo: currentService.vuelo,
        pick_up: currentService.pickUp,
        tipo_viaje: currentService.tipoViaje,
        hora: currentService.hora,
        hotel: currentService.hotel,
        cobro: currentService.cobro?.toString(),
        metodo_pago: currentService.metodoPago,
        car_seat: parseInt(currentService.carSeat) || 0,
        baby_seat: parseInt(currentService.babySeat) || 0,
        booster: parseInt(currentService.booster) || 0,
        parada_compras: currentService.paradaCompras,
        comentario: currentService.comentario,
        chofer: currentService.chofer || '',
        vehiculo: currentService.vehiculo || '',
        proveedor: currentService.proveedor || '',
        costo_proveedor: currentService.costoProveedor?.toString() || ''
      });
    } else {
      // MODO NUEVO: Aquí sí generamos el ID base y permitimos duplicar si es RT
      const baseId = Date.now().toString();

      const newService = {
        id: baseId,
        reserva: currentService.reserva,
        nombre: currentService.nombre,
        apellido: currentService.apellido,
        agencia: currentService.agencia,
        tipo_servicio: currentService.tipoServicio,
        pax: currentService.pax?.toString(),
        telefono: currentService.telefono,
        fecha: currentService.fecha,
        vuelo: currentService.vuelo,
        pick_up: currentService.pickUp,
        tipo_viaje: currentService.tipoViaje,
        hora: currentService.hora,
        hotel: currentService.hotel,
        cobro: currentService.cobro?.toString(),
        metodo_pago: currentService.metodoPago,
        car_seat: parseInt(currentService.carSeat) || 0,
        baby_seat: parseInt(currentService.babySeat) || 0,
        booster: parseInt(currentService.booster) || 0,
        parada_compras: currentService.paradaCompras,
        comentario: currentService.comentario,
        chofer: '',
        vehiculo: '',
        proveedor: '',
        costo_proveedor: ''
      };
      servicesToSave.push(newService);

      // SOLO si es un registro NUEVO y es RT, creamos el regreso automático
      if (currentService.tipoViaje === 'RT') {
        servicesToSave.push({
          ...newService,
          id: baseId + '_RT',
          fecha: currentService.fechaRegreso || '',
          pick_up: currentService.horaPickUpRegreso || '',
          vuelo: currentService.vueloRegreso || '',
          hora: currentService.horaRegreso || '',
          tipo_servicio: 'Salida',
          tipo_viaje: 'One way'
        });
      }
    }

    try {
      // Enviamos a la base de datos (upsert actualiza si el ID ya existe)
      const { error } = await supabase.from('servicios').upsert(servicesToSave);
      if (error) throw error;

      showToast(isEditing ? 'Servicio actualizado en la nube' : 'Servicio(s) guardado(s) en la nube');

      // Volver a descargar los datos frescos de la nube para actualizar las tablas
      fetchAllData();

      // Limpiar el formulario y apagar el modo edición
      setCurrentService(initialServiceState);
      setIsEditing(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      showToast('Error al guardar en la nube', 'error');
    }
  };

  const cancelEdit = () => {
    setCurrentService(initialServiceState);
    setIsEditing(false);
    setSearchTerm('');
  };

  const handleRollChange = (id, field, value) => {
    setRollData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const descargarCierrePDF = async () => {
    const element = document.getElementById('cierre-container');
    if (!element) {
      alert('No se encontró la tabla de cierre');
      return;
    }

    try {
      showToast('Generando PDF de Cierre...');
      const canvas = await window.html2canvas(element, {
        scale: 2,
        useCORS: true,
        // AQUÍ ESTÁ LA MAGIA PARA EVITAR EL TEXTO CORTADO
        onclone: (clonedDoc) => {
          const inputs = clonedDoc.querySelectorAll('input');
          inputs.forEach(input => {
            const span = clonedDoc.createElement('span');
            // Copiamos el valor que tenía el input
            span.innerText = input.value || input.placeholder;
            // Le pasamos las mismas clases de diseño (negritas, verde, etc.)
            span.className = input.className;
            // Nos aseguramos de que no tenga bordes raros en el PDF
            span.style.border = 'none';
            span.style.display = 'inline-block';
            span.style.paddingBottom = '4px'; // Un poco de aire para que no se corte
            // Reemplazamos el input por el texto solo para la foto
            input.parentNode.replaceChild(span, input);
          });
        }
      });
      const imgData = canvas.toDataURL('image/png');

      // Creamos el documento PDF
      const pdf = new window.jspdf.jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);

      const fecha = new Date().toISOString().split('T')[0];
      const nombreArchivo = `Cierre_${cierreFilters.vehiculo || 'General'}_${fecha}.pdf`;

      pdf.save(nombreArchivo);
      showToast('PDF descargado correctamente');
    } catch (error) {
      console.error("Error al generar PDF:", error);
      showToast('Error al generar el PDF', 'error');
    }
  };

  const saveRollUpdates = async () => {
    try {
      showToast('Guardando cambios en la nube...');

      // 1. Traducimos los datos del Rol al formato exacto de tu Supabase
      const servicesToUpdate = rollData.map(item => ({
        id: item.id,
        reserva: item.reserva,
        nombre: item.nombre,
        apellido: item.apellido,
        agencia: item.agencia,
        tipo_servicio: item.tipoServicio,
        pax: item.pax?.toString(),
        telefono: item.telefono,
        fecha: item.fecha,
        vuelo: item.vuelo,
        pick_up: item.pickUp,
        tipo_viaje: item.tipoViaje,
        hora: item.hora,
        hotel: item.hotel,
        cobro: item.cobro?.toString(),
        metodo_pago: item.metodoPago,
        car_seat: parseInt(item.carSeat) || 0,
        baby_seat: parseInt(item.babySeat) || 0,
        booster: parseInt(item.booster) || 0,
        parada_compras: item.paradaCompras,
        comentario: item.comentario,
        chofer: item.chofer || '',
        vehiculo: item.vehiculo || '',
        proveedor: item.proveedor || '',
        costo_proveedor: item.costoProveedor?.toString() || ''
      }));

      // 2. Enviamos la orden de actualización masiva a la nube
      const { error } = await supabase.from('servicios').upsert(servicesToUpdate);
      if (error) throw error;

      // 3. Si todo sale bien, actualizamos la memoria local de la app
      const updatedServices = services.map(srv => {
        const rollItem = rollData.find(r => r.id === srv.id);
        return rollItem ? { ...srv, ...rollItem } : srv;
      });
      setServices(updatedServices);

      showToast('¡Rol actualizado en la nube correctamente!');
    } catch (error) {
      console.error("Error al guardar el Rol:", error);
      showToast('Error al guardar en la nube', 'error');
    }
  };
  const handleDatabaseChange = (id, field, value) => {
    setServices(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const saveDatabaseUpdates = async () => {
    const descargarRespaldoExcel = () => {
      if (!window.XLSX) return showToast('Librería Excel cargando...', 'error');

      try {
        showToast('Generando Respaldo Total en Excel...');

        // 1. Creamos un nuevo libro de Excel vacío
        const libro = window.XLSX.utils.book_new();

        // 2. Convertimos tus 3 variables a formato de hoja de cálculo
        const hojaGeneral = window.XLSX.utils.json_to_sheet(services);
        const hojaCallCenter = window.XLSX.utils.json_to_sheet(callCenterServices);
        const hojaGastos = window.XLSX.utils.json_to_sheet(fleetExpenses);

        // 3. Metemos las 3 hojas al libro
        window.XLSX.utils.book_append_sheet(libro, hojaGeneral, "Base General");
        window.XLSX.utils.book_append_sheet(libro, hojaCallCenter, "Call Center");
        window.XLSX.utils.book_append_sheet(libro, hojaGastos, "Gastos Flota");

        // 4. Lo descargamos con la fecha de hoy
        const fecha = new Date().toISOString().split('T')[0];
        window.XLSX.writeFile(libro, `Respaldo_Ballard_Total_${fecha}.xlsx`);

        showToast('¡Respaldo descargado con éxito!');
      } catch (error) {
        console.error("Error al crear Excel:", error);
        showToast('Error al generar el respaldo', 'error');
      }
    };


    try {
      showToast('Guardando base de datos en la nube...');

      // Empaquetamos todo tal cual lo recibe Supabase
      const servicesToUpdate = services.map(item => ({
        id: item.id,
        reserva: item.reserva,
        nombre: item.nombre,
        apellido: item.apellido,
        agencia: item.agencia,
        tipo_servicio: item.tipoServicio,
        pax: item.pax?.toString(),
        telefono: item.telefono,
        fecha: item.fecha,
        vuelo: item.vuelo,
        pick_up: item.pickUp,
        tipo_viaje: item.tipoViaje,
        hora: item.hora,
        hotel: item.hotel,
        cobro: item.cobro?.toString(),
        metodo_pago: item.metodoPago,
        car_seat: parseInt(item.carSeat) || 0,
        baby_seat: parseInt(item.babySeat) || 0,
        booster: parseInt(item.booster) || 0,
        parada_compras: item.paradaCompras,
        comentario: item.comentario,
        chofer: item.chofer || '',
        vehiculo: item.vehiculo || '',
        proveedor: item.proveedor || '',
        costo_proveedor: item.costoProveedor?.toString() || ''
      }));

      // Disparamos la actualización
      const { error } = await supabase.from('servicios').upsert(servicesToUpdate);
      if (error) throw error;

      showToast('¡Base de datos actualizada en la nube!');
    } catch (error) {
      console.error("Error al guardar BD:", error);
      showToast('Error al guardar en la nube', 'error');
    }
  };

  const handleFleetChange = (id, field, value) => {
    setFleetExpenses(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const saveFleetUpdates = async () => {
    try {
      showToast('Guardando cambios en gastos...');

      // Preparamos los datos tal como los lee Supabase
      const gastosToUpdate = fleetExpenses.map(item => ({
        id: item.id,
        fecha: item.fecha,
        chofer: item.chofer,
        vehiculo: item.vehiculo,
        gasolina: item.gasolina,
        casetas: item.casetas,
        gasto_total: item.gastoTotal
      }));

      // Disparamos la actualización a la nube
      const { error } = await supabase.from('gastos_flota').upsert(gastosToUpdate);
      if (error) throw error;

      showToast('¡Gastos actualizados en la nube!');
    } catch (error) {
      console.error("Error al guardar gastos:", error);
      showToast('Error al actualizar gastos', 'error');
    }
  };

  const processCallCenterInput = async () => {
    if (!ccInput.trim()) return showToast('El mensaje está vacío', 'error');

    // Extracción mediante RegEx (Se queda exactamente igual)
    const regexAccion = /ACCI[ÓO]N:\s*(Venta|Confirmaci[óo]n)/i;
    const regexCliente = /CLIENTE:\s*(.+?)(?=\nRESERVA:)/is;
    const regexReserva = /RESERVA:\s*(.+?)(?=\nFECHA)/is;
    const regexFecha = /FECHA DEL SERVICIO:\s*(.+?)(?=\nNOTAS:|$)/is;

    const accionMatch = ccInput.match(regexAccion);
    const clienteMatch = ccInput.match(regexCliente);
    const reservaMatch = ccInput.match(regexReserva);
    const fechaMatch = ccInput.match(regexFecha);

    if (!accionMatch) return showToast('No se detectó "Acción" válida', 'error');

    const accionString = accionMatch[1].toLowerCase();
    const isVenta = accionString.includes('venta');

    // Creamos el registro adaptado a las columnas de Supabase
    // 1. Calculamos la fecha exacta local (México) restando la diferencia de zona horaria
    const offsetMinutos = new Date().getTimezoneOffset() * 60000;
    const fechaLocal = new Date(Date.now() - offsetMinutos).toISOString().split('T')[0];

    // 2. Creamos el registro con la fecha corregida
    const newCCRecord = {
      id: `CC-${Date.now().toString().slice(-5)}`,
      fecha_sistema: fechaLocal,
      fecha_cliente: fechaMatch ? fechaMatch[1].trim() : 'Sin fecha',
      cliente: clienteMatch ? clienteMatch[1].trim() : 'Desconocido',
      reserva: reservaMatch ? reservaMatch[1].trim() : 'N/A',
      accion: isVenta ? 'Venta' : 'Confirmation',
      comision: isVenta ? 10 : 5,
      raw_message: ccInput
    };

    try {
      // Mandamos el registro a la tabla call_center
      const { error } = await supabase.from('call_center').insert([newCCRecord]);
      if (error) throw error;

      showToast('¡Datos del Call Center guardados en la nube!');
      setCcInput('');

      // Actualizamos la pantalla con los nuevos datos
      fetchAllData();
    } catch (error) {
      console.error("Error en Call Center:", error);
      showToast('Error al guardar en el Call Center', 'error');
    }
  };

  const handleExpenseChange = (e) => {
    const { name, value } = e.target;
    setCurrentExpense(prev => ({ ...prev, [name]: value }));
  };

  const saveExpense = async () => {
    const gas = parseFloat(currentExpense.gasolina) || 0;
    const casetas = parseFloat(currentExpense.casetas) || 0;
    const total = gas + casetas;

    if (total === 0 && !currentExpense.chofer && !currentExpense.vehiculo) {
      return showToast('Por favor llena al menos el vehículo, chofer o un monto', 'error');
    }

    // Estructura para la tabla gastos_flota en Supabase
    const newExpense = {
      id: `G-${Date.now().toString().slice(-4)}`,
      fecha: currentExpense.fecha || new Date().toISOString().split('T')[0],
      chofer: currentExpense.chofer,
      vehiculo: currentExpense.vehiculo,
      gasolina: gas,
      casetas: casetas,
      gasto_total: total
    };

    try {
      // Insertamos el gasto en la base de datos
      const { error } = await supabase.from('gastos_flota').insert([newExpense]);
      if (error) throw error;

      showToast('Gasto de flota registrado en la nube');
      setCurrentExpense(initialExpenseState);

      // Actualizamos la pantalla con los nuevos datos
      fetchAllData();
    } catch (error) {
      console.error("Error al guardar gasto:", error);
      showToast('Error al registrar el gasto', 'error');
    }
  };

  const handleCierreCobroChange = (id, newCobro) => {
    const updated = services.map(s => s.id === id ? { ...s, cobro: newCobro } : s);
    setServices(updated);
    localStorage.setItem('ballard_services', JSON.stringify(updated));
  };

  const handleCierreComisionChange = (id, newComision) => {
    const updated = callCenterServices.map(s => s.id === id ? { ...s, comision: parseFloat(newComision) || 0 } : s);
    setCallCenterServices(updated);
    localStorage.setItem('ballard_cc_services', JSON.stringify(updated));
  };

  const generateSharePNG = async (item) => {
    if (!libsLoaded) return showToast('Librerías cargando...', 'error');
    setRenderData({ type: 'share', data: item });

    setTimeout(async () => {
      try {
        const canvas = await window.html2canvas(shareRef.current, { scale: 2, useCORS: true });
        const link = document.createElement('a');
        link.download = `Servicio_${item.nombre}_${item.apellido}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setRenderData(null);
        showToast('Imagen PNG generada');
      } catch (e) {
        console.error(e);
        showToast('Error generando PNG', 'error');
        setRenderData(null);
      }
    }, 300);
  };

  const generateWelcomeSign = async (item) => {
    if (!libsLoaded || !window.jspdf) return showToast('Librerías cargando...', 'error');
    setRenderData({ type: 'sign', data: item });

    setTimeout(async () => {
      try {
        const canvas = await window.html2canvas(signRef.current, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/jpeg', 1.0);
        const pdf = new window.jspdf.jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'JPEG', 0, (pdf.internal.pageSize.getHeight() - pdfHeight) / 2, pdfWidth, pdfHeight);
        pdf.save(`Letrero_${item.nombre}_${item.apellido}.pdf`);
        setRenderData(null);
        showToast('Letrero PDF generado');
      } catch (e) {
        console.error(e);
        showToast('Error generando Letrero', 'error');
        setRenderData(null);
      }
    }, 300);
  };

  const downloadRolPNG = async () => {
    const element = document.getElementById('rol-diario-container');
    if (!element) {
      showToast('No se encontró el contenedor', 'error');
      return;
    }

    try {
      showToast('Generando imagen en Alta Calidad (HD)...');

      const canvas = await window.html2canvas(element, {
        scale: 3, // <-- AQUÍ ESTÁ EL CAMBIO: Subimos la escala de 2 a 3 para máxima nitidez
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        // Modificamos la foto antes de tomarla para ocultar lo secreto
        onclone: (clonedDoc) => {
          const columnasSecretas = clonedDoc.querySelectorAll('.ocultar-en-foto');
          columnasSecretas.forEach(celda => {
            celda.style.display = 'none';
          });
        }
      });

      const link = document.createElement('a');
      const fecha = new Date().toISOString().split('T')[0];
      link.download = `Rol_Diario_${fecha}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      showToast('Imagen HD descargada correctamente');
    } catch (error) {
      console.error("Error al generar PNG:", error);
      showToast('Error al generar la imagen', 'error');
    }
  };

  const BallardLogo = ({ className }) => (
    <img
      src="/logo-oficial.png"
      alt="Logo Ballard"
      className={className}
    />
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col items-center border-t-4 border-blue-600">
          <img src="/logo-oficial.png" alt="Logo Ballard" className="h-24 w-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-6">Acceso al Sistema</h2>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa la contraseña"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-center text-lg focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (password === 'Ballard2026') setIsLoggedIn(true);
                else alert('Contraseña incorrecta');
              }
            }}
          />

          <button
            onClick={() => {
              if (password === 'Ballard2026') setIsLoggedIn(true);
              else alert('Contraseña incorrecta');
            }}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md"
          >
            Entrar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 font-sans">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg flex items-center gap-2 text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} transition-opacity`}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col sm:flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <BallardLogo className="h-12" />
          </div>
          <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 justify-center">
            <button onClick={() => setActiveTab('form')} className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${activeTab === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Ingresar / Buscar
            </button>
            <button onClick={() => setActiveTab('callcenter')} className={`px-4 py-2 rounded-md font-bold transition-colors text-sm flex items-center gap-1 ${activeTab === 'callcenter' ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}>
              <Headset size={16} /> Ingreso CC
            </button>
            <button onClick={() => setActiveTab('roll')} className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${activeTab === 'roll' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Rol Diario
            </button>
            <button onClick={() => setActiveTab('flota')} className={`px-4 py-2 rounded-md font-bold transition-colors text-sm flex items-center gap-1 ${activeTab === 'flota' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'}`}>
              <Fuel size={16} /> Control Flota
            </button>
            <button onClick={() => setActiveTab('database')} className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${activeTab === 'database' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Base de Datos
            </button>
            <button onClick={() => setActiveTab('cierre')} className={`px-4 py-2 rounded-md font-medium transition-colors text-sm ${activeTab === 'cierre' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>
              Cierre
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        { }
        {activeTab === 'form' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                {isEditing ? <><FileText className="text-blue-600" /> Modificar Servicio</> : <><FileText className="text-blue-600" /> Ingresar Nuevo Servicio</>}
              </h2>

              <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar reserva, nombre..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {searchResults.length > 0 && (
                  <ul className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {searchResults.map(res => (
                      <li key={res.id} onClick={() => selectServiceToEdit(res)} className="px-4 py-2 hover:bg-blue-50 cursor-pointer text-sm border-b">
                        <span className="font-semibold">{res.nombre} {res.apellido}</span> - {res.fecha} <br />
                        <span className="text-xs text-gray-500">Reserva: {res.reserva} | Hotel: {res.hotel}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Datos Generales</h3>
                <div>
                  <div className="mt-1 flex gap-2">
                    <input
                      type="text"
                      name="reserva"
                      value={currentService.reserva}
                      onChange={handleInputChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 uppercase"
                    />
                    <button
                      type="button"
                      onClick={generarNumeroReserva}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 text-xs font-bold px-3 py-2 rounded-md border border-blue-300 transition-colors whitespace-nowrap flex items-center gap-1"
                      title="Generar consecutivo automático"
                    >
                      ✨ Generar N°
                    </button>
                  </div>
                  <input type="text" name="reserva" value={currentService.reserva} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Nombre</label>
                    <input type="text" name="nombre" value={currentService.nombre} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Apellido</label>
                    <input type="text" name="apellido" value={currentService.apellido} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Agencia</label>
                    <input type="text" name="agencia" value={currentService.agencia} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">PAX (Cant.)</label>
                    <input type="number" name="pax" value={currentService.pax} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700">Teléfono</label>
                  <input type="text" name="telefono" value={currentService.telefono} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Logística</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Tipo de Servicio</label>
                    <select name="tipoServicio" value={currentService.tipoServicio} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white">
                      <option>Llegada</option>
                      <option>Salida</option>
                      <option>Traslado</option>
                      <option>Actividad</option>
                    </select>
                  </div>
                  {!isEditing && (
                    <div>
                      <label className="block text-xs font-medium text-gray-700">Tipo de Viaje</label>
                      <select name="tipoViaje" value={currentService.tipoViaje} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white">
                        <option value="One way">One way</option>
                        <option value="RT">Round Trip (RT)</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Fecha del Servicio</label>
                    <input type="date" name="fecha" value={currentService.fecha} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Hora</label>
                    <input type="time" name="hora" value={currentService.hora} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Vuelo</label>
                    <input type="text" name="vuelo" value={currentService.vuelo} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Pick UP</label>
                    <input type="time" name="pickUp" value={currentService.pickUp} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Hotel / Destino</label>
                  <input
                    type="text"
                    name="hotel"
                    list="hoteles-list"
                    value={currentService.hotel}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Escribe o selecciona..."
                  />
                  <datalist id="hoteles-list">
                    {LISTA_HOTELES.map((hotel, index) => (
                      <option key={index} value={hotel.nombre}>
                        Zona {hotel.zona}
                      </option>
                    ))}
                  </datalist>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-gray-700 border-b pb-2">Extras y Comentarios</h3>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Car Seat</label>
                    <input type="number" min="0" name="carSeat" value={currentService.carSeat} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Baby Seat</label>
                    <input type="number" min="0" name="babySeat" value={currentService.babySeat} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Booster</label>
                    <input type="number" min="0" name="booster" value={currentService.booster} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                </div>

                <div className="flex items-center mt-2">
                  <input type="checkbox" name="paradaCompras" checked={currentService.paradaCompras} onChange={handleInputChange} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
                  <label className="ml-2 block text-sm text-gray-900">Parada de compras</label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Cobro ($)</label>
                    <input type="text" name="cobro" value={currentService.cobro} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700">Método de Pago</label>
                    <select name="metodoPago" value={currentService.metodoPago} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white">
                      <option value="">Seleccione...</option>
                      <option value="Efectivo">Efectivo</option>
                      <option value="Tarjeta">Tarjeta</option>
                      <option value="PayPal">PayPal</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-700">Comentarios</label>
                  <textarea name="comentario" rows="2" value={currentService.comentario} onChange={handleInputChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm"></textarea>
                </div>
              </div>
            </div>

            {currentService.tipoViaje === 'RT' && !isEditing && (
              <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-200">
                <h3 className="font-semibold text-blue-800 mb-3 flex items-center gap-2"><MapPin size={18} /> Datos del Viaje de Regreso</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-blue-700">Fecha de Regreso</label>
                    <input type="date" name="fechaRegreso" value={currentService.fechaRegreso} onChange={handleInputChange} className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700">Pick UP (Regreso)</label>
                    <input type="time" name="horaPickUpRegreso" value={currentService.horaPickUpRegreso} onChange={handleInputChange} className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700">Vuelo de Regreso</label>
                    <input type="text" name="vueloRegreso" value={currentService.vueloRegreso} onChange={handleInputChange} className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-blue-700">Hora de Vuelo</label>
                    <input type="time" name="horaRegreso" value={currentService.horaRegreso} onChange={handleInputChange} className="mt-1 block w-full border border-blue-300 rounded-md shadow-sm p-2 text-sm" />
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-end gap-3">
              {isEditing && (
                <button type="button" onClick={cancelEdit} className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                  <X size={18} /> Cancelar
                </button>
              )}
              <button onClick={saveForm} className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 shadow-sm font-medium flex items-center gap-2 transition-colors">
                <Save size={18} /> {isEditing ? 'Actualizar' : 'Guardar'}
              </button>
            </div>
          </div>
        )}

        { }
        {activeTab === 'callcenter' && (
          <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-purple-600">
            <h2 className="text-2xl font-bold text-purple-900 flex items-center gap-2 mb-6">
              <Headset className="text-purple-600" /> Ingreso Rápido - Call Center
            </h2>
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-100 mb-8">
              <p className="text-sm text-purple-800 mb-4 font-medium">Pega el mensaje de WhatsApp aquí usando la plantilla requerida. El sistema calculará la comisión ($10 Venta / $5 Confirmación) automáticamente.</p>
              <textarea
                rows="5"
                value={ccInput}
                onChange={(e) => setCcInput(e.target.value)}
                className="w-full border border-purple-200 rounded-md p-4 shadow-sm focus:ring-purple-500 focus:border-purple-500 text-sm font-mono"
                placeholder="ACCIÓN: Venta&#10;CLIENTE: Juan Pérez&#10;RESERVA: 12345&#10;FECHA DEL SERVICIO: 15/06/2026&#10;NOTAS: Pasajero requiere asiento de bebé"
              ></textarea>
              <div className="mt-4 flex justify-end">
                <button onClick={processCallCenterInput} className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 shadow-sm font-medium transition-colors flex items-center gap-2">
                  <Database size={18} /> Extraer y Guardar
                </button>
              </div>
            </div>

            {/* Nueva sección: Historial de Call Center directo en la pestaña */}
            <div className="flex-1 overflow-x-auto overflow-y-auto p-2 w-full">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-purple-900">Historial Reciente de Call Center (En la Nube)</h3>
                <button onClick={fetchAllData} className="bg-purple-100 text-purple-700 px-3 py-1 rounded text-xs font-bold hover:bg-purple-200 transition-colors">
                  🔄 Actualizar Datos
                </button>
              </div>
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead>
                  <tr className="text-purple-800 bg-purple-50 border-b">
                    <th className="p-2">ID Registro</th><th className="p-2">Fecha Sistema</th><th className="p-2">Fecha Cliente</th>
                    <th className="p-2">Cliente</th><th className="p-2">Reserva</th><th className="p-2">Acción</th>
                    <th className="p-2 text-right">Comisión</th><th className="p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {callCenterServices.length === 0 ? (
                    <tr><td colSpan="8" className="text-center p-8 text-gray-500">No hay registros guardados en el Call Center.</td></tr>
                  ) : (
                    // Ordenamos para ver siempre los últimos ingresados arriba
                    [...callCenterServices].reverse().slice(0, 10).map(row => (
                      <tr key={row.id} className="hover:bg-purple-50 transition-colors">
                        <td className="p-2 font-mono text-xs text-gray-500">{row.id}</td>
                        <td className="p-2">{row.fechaSistema}</td>
                        <td className="p-2 font-medium">{row.fechaCliente}</td>
                        <td className="p-2 font-bold uppercase">{row.cliente}</td>
                        <td className="p-2">{row.reserva}</td>
                        <td className="p-2">
                          <span className={`px-2 py-1 rounded-full text-xs ${row.accion === 'Venta' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                            {row.accion}
                          </span>
                        </td>
                        <td className="p-2 text-right font-bold text-green-700">${parseFloat(row.comision).toFixed(2)}</td>
                        <td className="p-2 text-center">
                          <button
                            onClick={async () => {
                              if (window.confirm(`¿Estás seguro de que deseas eliminar el registro de ${row.cliente} permanentemente de la nube?`)) {
                                try {
                                  showToast('Eliminando...', 'success');

                                  // 1. Lo borramos físicamente de la tabla 'call_center' en Supabase
                                  const { error } = await supabase.from('call_center').delete().eq('id', row.id);
                                  if (error) throw error;

                                  // 2. Lo borramos de la pantalla para actualizar la vista de inmediato
                                  setCallCenterServices(callCenterServices.filter(cc => cc.id !== row.id));

                                  showToast('¡Registro de Call Center eliminado!');
                                } catch (error) {
                                  console.error("Error al eliminar en CC:", error);
                                  showToast('Error al eliminar en la nube', 'error');
                                }
                              }
                            }}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                            title="Eliminar Registro"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        { }
        {activeTab === 'flota' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
              <Fuel className="text-orange-500" /> Control de Flota (Gastos)
            </h2>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-100 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fecha</label>
                  <input type="date" name="fecha" value={currentExpense.fecha} onChange={handleExpenseChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Chofer</label>
                  <input type="text" name="chofer" placeholder="Ej. Juan Pérez" value={currentExpense.chofer} onChange={handleExpenseChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Vehículo</label>
                  <input type="text" name="vehiculo" placeholder="Ej. Sprinter 01" value={currentExpense.vehiculo} onChange={handleExpenseChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Gasolina ($)</label>
                  <input type="number" name="gasolina" placeholder="Dejar vacío = $0" min="0" step="0.01" value={currentExpense.gasolina} onChange={handleExpenseChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Casetas ($)</label>
                  <input type="number" name="casetas" placeholder="Dejar vacío = $0" min="0" step="0.01" value={currentExpense.casetas} onChange={handleExpenseChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-orange-500 focus:border-orange-500" />
                </div>
              </div>
              <div className="mt-4 flex justify-between items-center bg-white p-3 rounded border border-orange-200">
                <div className="text-sm font-semibold text-gray-700">
                  Gasto Total: <span className="text-lg text-red-600 ml-2">${((parseFloat(currentExpense.gasolina) || 0) + (parseFloat(currentExpense.casetas) || 0)).toFixed(2)}</span>
                </div>
                <button onClick={saveExpense} className="bg-orange-500 text-white px-6 py-2 rounded-md hover:bg-orange-600 shadow-sm font-medium transition-colors flex items-center gap-2">
                  <Save size={18} /> Guardar Gasto
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto p-2 w-full">
              <div className="flex justify-between items-center mb-4 border-b pb-2">
                <h3 className="text-lg font-semibold text-gray-700">Historial de Gastos</h3>
                <button onClick={saveFleetUpdates} className="bg-orange-500 text-white px-3 py-1 rounded-md hover:bg-orange-600 flex items-center gap-2 text-sm font-medium transition-colors shadow-sm">
                  <Save size={16} /> Guardar Cambios
                </button>
              </div>
              <table className="min-w-full text-left text-sm whitespace-nowrap">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="text-gray-600 border-b bg-gray-50">
                    <th className="p-2">ID Gasto</th><th className="p-2">Fecha</th><th className="p-2">Chofer</th><th className="p-2">Vehículo</th>
                    <th className="p-2 text-right">Gasolina</th><th className="p-2 text-right">Casetas</th><th className="p-2 text-right font-bold">Gasto Total</th>
                    <th className="p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {fleetExpenses.length === 0 ? <tr><td colSpan="8" className="text-center p-8 text-gray-500">No hay gastos registrados.</td></tr> : [...fleetExpenses].reverse().map(row => (
                    <tr key={row.id} className="hover:bg-orange-50 transition-colors">
                      <td className="p-2 font-medium text-gray-500">{row.id}</td>
                      <td className="p-2">
                        <input type="date" value={row.fecha || ''} onChange={e => handleFleetChange(row.id, 'fecha', e.target.value)} className="bg-transparent border-b border-dashed border-gray-400 focus:outline-none focus:border-orange-500 text-gray-700" />
                      </td>
                      <td className="p-2">{row.chofer}</td><td className="p-2">{row.vehiculo}</td>
                      <td className="p-2 text-right text-gray-600">${parseFloat(row.gasolina || 0).toFixed(2)}</td>
                      <td className="p-2 text-right text-gray-600">${parseFloat(row.casetas || 0).toFixed(2)}</td>
                      <td className="p-2 text-right font-bold text-red-700">${parseFloat(row.gastoTotal || 0).toFixed(2)}</td>
                      <td className="p-2 text-center">
                        <button
                          onClick={async () => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar este gasto de la nube?')) {
                              try {
                                showToast('Eliminando...', 'success');
                                const { error } = await supabase.from('gastos_flota').delete().eq('id', row.id);
                                if (error) throw error;
                                setFleetExpenses(fleetExpenses.filter(g => g.id !== row.id));
                                showToast('¡Gasto eliminado!');
                              } catch (error) {
                                console.error("Error al eliminar gasto:", error);
                                showToast('Error al eliminar', 'error');
                              }
                            }
                          }}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                          title="Eliminar Gasto"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        { }
        {activeTab === 'roll' && (
          <div className="bg-white rounded-lg shadow-md flex flex-col h-[80vh]">
            <div className="p-4 border-b flex flex-wrap justify-between items-center gap-4 bg-gray-50 rounded-t-lg">
              <div className="flex items-center gap-4">
                <input type="date" value={rollDate} onChange={(e) => setRollDate(e.target.value)} className="border border-gray-300 rounded-md p-2 shadow-sm font-semibold text-gray-700" />
                <span className="text-sm text-gray-500">{rollData.length} servicio(s) encontrado(s)</span>
              </div>
              <div className="flex gap-2">
                <button onClick={saveRollUpdates} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 text-sm font-medium transition-colors">
                  <Save size={16} /> Guardar
                </button>
                <button
                  onClick={downloadRolPNG}
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 shadow-sm"
                >
                  <Download size={18} /> Descargar PNG
                </button>
              </div>
            </div>

            <div className="absolute top-[-9999px] left-[-9999px]">
              <div id="rol-diario-container" className="bg-white p-8 w-[1600px]">
                <div className="flex justify-between items-end border-b-2 border-black pb-4 mb-4">
                  <div className="flex flex-col">
                    <BallardLogo className="h-16 mb-2" />
                    <h1 className="text-3xl font-bold tracking-tight">Rol Diario de Servicios</h1>
                  </div>
                  <div className="text-4xl font-bold text-gray-800 tracking-wider">
                    {new Date(rollDate + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).toUpperCase()}
                  </div>
                </div>
                <table className="w-full text-left text-sm border-collapse">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="border p-2">Hora</th><th className="border p-2">Chofer</th><th className="border p-2">Nombre</th>
                      <th className="border p-2">Apellido</th><th className="border p-2">Vuelo</th><th className="border p-2">Hotel</th>
                      <th className="border p-2">Pax</th><th className="border p-2">Teléfono</th><th className="border p-2">Tipo</th>
                      <th className="border p-2">Vehículo</th><th className="border p-2 border-b ocultar-en-foto">Proveedor</th><th className="border p-2 border-b ocultar-en-foto">Cantidad</th>
                      <th className="border p-2">Extras</th><th className="border p-2 w-48">Comentario</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rollData.map(row => (
                      <tr key={row.id} className="border-b">
                        <td className="border p-2 font-bold">{row.hora}</td><td className="border p-2">{row.chofer}</td>
                        <td className="border p-2 uppercase">{row.nombre}</td><td className="border p-2 uppercase">{row.apellido}</td>
                        <td className="border p-2">{row.vuelo}</td><td className="border p-2 text-xs">{row.hotel}</td>
                        <td className="border p-2 text-center">{row.pax}</td><td className="border p-2 text-xs">{row.telefono}</td>
                        <td className="border p-2 text-xs">{row.tipoServicio}</td><td className="border p-2">{row.vehiculo}</td>
                        <td className="border p-2 text-xs border-b ocultar-en-foto">{row.proveedor}</td><td className="border p-2 text-xs font-bold">{row.costoProveedor ? `$${row.costoProveedor}` : ''}</td>
                        <td className="border p-2 text-xs">
                          {row.carSeat > 0 && `Car:${row.carSeat} `}{row.babySeat > 0 && `Baby:${row.babySeat} `}
                          {row.booster > 0 && `Bstr:${row.booster} `}{row.paradaCompras && `Compras`}
                        </td>
                        <td className="border p-2 text-xs break-words">{row.comentario}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 w-full"><datalist id="hoteles-rol-list">
              {LISTA_HOTELES.map((hotel, index) => (
                <option key={`rol-${index}`} value={hotel.nombre}>
                  Zona {hotel.zona}
                </option>
              ))}
            </datalist>
              <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="text-gray-600 border-b">
                    <th className="p-2">Hora</th><th className="p-2">Chofer</th><th className="p-2">Nombre</th><th className="p-2">Apellido</th>
                    <th className="p-2">Vuelo</th><th className="p-2">Hotel</th><th className="p-2">Pax</th><th className="p-2">Teléfono</th>
                    <th className="p-2">Tipo</th><th className="p-2">Vehículo</th><th className="p-2">Proveedor</th><th className="p-2">Cantidad</th>
                    <th className="p-2">Extras</th><th className="p-2">Comentario</th><th className="p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {rollData.length === 0 ? <tr><td colSpan="15" className="text-center p-8 text-gray-500">No hay servicios programados.</td></tr> : rollData.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-2"><input type="time" value={row.hora} onChange={(e) => handleRollChange(row.id, 'hora', e.target.value)} className="w-full bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500" /></td>
                      <td className="p-2"><input type="text" value={row.chofer} onChange={(e) => handleRollChange(row.id, 'chofer', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none" /></td>
                      <td className="p-2 font-medium">{row.nombre}</td><td className="p-2 font-medium">{row.apellido}</td>
                      <td className="p-2"><input type="text" value={row.vuelo} onChange={(e) => handleRollChange(row.id, 'vuelo', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none" /></td>
                      <td className="p-2">
                        <input
                          type="text"
                          list="hoteles-rol-list"
                          value={row.hotel}
                          onChange={(e) => handleRollChange(row.id, 'hotel', e.target.value)}
                          className="w-32 bg-transparent border-b border-dashed focus:outline-none cursor-pointer"
                          placeholder="Elegir..."
                        />
                      </td>
                      <td className="p-2 text-center">{row.pax}</td><td className="p-2 text-xs">{row.telefono}</td>
                      <td className="p-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${row.tipoServicio === 'Llegada' ? 'bg-green-100 text-green-800' :
                          row.tipoServicio === 'Salida' ? 'bg-red-100 text-red-800' :
                            row.tipoServicio === 'Traslado' ? 'bg-yellow-100 text-yellow-800' :
                              row.tipoServicio === 'Actividad' ? 'bg-blue-100 text-blue-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {row.tipoServicio}
                        </span>
                      </td>
                      <td className="p-2">
                        <select
                          value={row.vehiculo || ''}
                          onChange={(e) => handleRollChange(row.id, 'vehiculo', e.target.value)}
                          className="w-24 bg-transparent border-b border-dashed focus:outline-none text-sm cursor-pointer"
                        >
                          <option value=""></option>
                          <option value="Expedition">Expedition</option>
                          <option value="Hiace">Hiace</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" value={row.proveedor || ''} onChange={(e) => handleRollChange(row.id, 'proveedor', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none" /></td>
                      <td className="p-2"><input type="number" value={row.costoProveedor || ''} onChange={(e) => handleRollChange(row.id, 'costoProveedor', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none font-bold text-red-700" /></td>
                      <td className="p-2 text-xs text-gray-600">
                        <div className="flex gap-1 flex-col">
                          {row.carSeat > 0 && <span>Car: {row.carSeat}</span>}{row.babySeat > 0 && <span>Baby: {row.babySeat}</span>}
                          {row.booster > 0 && <span>Bstr: {row.booster}</span>}{row.paradaCompras && <span className="text-blue-600 font-semibold">Compras</span>}
                        </div>
                      </td>
                      <td className="p-2"><input type="text" value={row.comentario} onChange={(e) => handleRollChange(row.id, 'comentario', e.target.value)} className="w-32 bg-transparent border-b border-dashed focus:outline-none text-xs" /></td>
                      <td className="p-2">
                        <div className="flex justify-center items-center gap-2">
                          <button onClick={() => generateSharePNG(row)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Compartir">
                            <Send size={18} />
                          </button>

                          {row.tipoServicio === 'Llegada' && (
                            <button onClick={() => generateWelcomeSign(row)} className="p-1 text-gray-600 hover:bg-gray-200 rounded" title="Imprimir Letrero">
                              <Printer size={18} />
                            </button>
                          )}

                          <button
                            onClick={async () => {
                              if (window.confirm('¿Estás seguro de que deseas eliminar este servicio permanentemente de la nube?')) {
                                try {
                                  showToast('Eliminando...', 'success');

                                  // 1. Le disparamos la orden a Supabase para que lo borre de verdad
                                  const { error } = await supabase.from('servicios').delete().eq('id', row.id);
                                  if (error) throw error;

                                  // 2. Lo borramos de la pantalla para que no tengas que recargar la página
                                  setServices(services.filter(s => s.id !== row.id));
                                  setRollData(rollData.filter(r => r.id !== row.id));

                                  showToast('¡Servicio eliminado de la nube!');
                                } catch (error) {
                                  console.error("Error al eliminar:", error);
                                  showToast('Error al eliminar en la nube', 'error');
                                }
                              }
                            }}
                            className="p-1 text-red-500 hover:bg-red-100 rounded"
                            title="Eliminar Servicio"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        { }
        {activeTab === 'database' && (
          <div className="bg-white rounded-lg shadow-md flex flex-col h-[80vh]">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg flex justify-between items-center flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                  <Database className="text-blue-600" /> Base de Datos General
                </h2>
                <span className="text-sm text-gray-500">{services.length} registros en total</span>
              </div>
              <div className="flex gap-2">
                <button onClick={descargarRespaldoExcel} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 font-medium transition-colors shadow-sm">
                  <Download size={18} /> Respaldo Excel
                </button>
                <button onClick={saveDatabaseUpdates} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm">
                  <Save size={18} /> Guardar Cambios
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto p-4 w-full">

              <datalist id="hoteles-bd-list">
                {LISTA_HOTELES.map((hotel, index) => (
                  <option key={`bd-${index}`} value={hotel.nombre}>
                    Zona {hotel.zona}
                  </option>
                ))}
              </datalist>

              <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className="text-gray-600 border-b bg-gray-50">
                    <th className="p-2">Reserva</th><th className="p-2">Agencia</th><th className="p-2 min-w-[150px]">Nombre y Apellido</th>
                    <th className="p-2">Fecha</th><th className="p-2">Hora</th><th className="p-2">Tipo</th><th className="p-2">Hotel</th>
                    <th className="p-2">Vuelo</th><th className="p-2">PickUp</th><th className="p-2">PAX</th><th className="p-2">Teléfono</th>
                    <th className="p-2">Cobro</th><th className="p-2">Método Pago</th><th className="p-2">Chofer</th><th className="p-2">Vehículo</th>
                    <th className="p-2">Proveedor</th><th className="p-2">Cantidad</th><th className="p-2">Extras</th><th className="p-2">Comentarios</th>
                    <th className="p-2 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {services.length === 0 ? <tr><td colSpan="20" className="text-center p-8 text-gray-500">No hay servicios registrados.</td></tr> : services.map(row => (
                    <tr key={row.id} className="hover:bg-blue-50 transition-colors">
                      <td className="p-2"><input type="text" value={row.reserva || ''} onChange={e => handleDatabaseChange(row.id, 'reserva', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none" /></td>
                      <td className="p-2"><input type="text" value={row.agencia || ''} onChange={e => handleDatabaseChange(row.id, 'agencia', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none" /></td>
                      <td className="p-2 flex gap-1">
                        <input type="text" value={row.nombre || ''} onChange={e => handleDatabaseChange(row.id, 'nombre', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none" placeholder="Nombre" />
                        <input type="text" value={row.apellido || ''} onChange={e => handleDatabaseChange(row.id, 'apellido', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none" placeholder="Apellido" />
                      </td>
                      <td className="p-2"><input type="date" value={row.fecha || ''} onChange={e => handleDatabaseChange(row.id, 'fecha', e.target.value)} className="w-28 bg-transparent border-b border-dashed focus:outline-none text-xs" /></td>
                      <td className="p-2"><input type="time" value={row.hora || ''} onChange={e => handleDatabaseChange(row.id, 'hora', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none font-semibold text-xs" /></td>
                      <td className="p-2">
                        <select value={row.tipoServicio || ''} onChange={e => handleDatabaseChange(row.id, 'tipoServicio', e.target.value)} className={`w-24 bg-transparent border-b border-dashed focus:outline-none text-xs font-bold cursor-pointer ${row.tipoServicio === 'Llegada' ? 'text-green-700' : row.tipoServicio === 'Salida' ? 'text-red-700' : row.tipoServicio === 'Traslado' ? 'text-yellow-700' : 'text-blue-700'}`}>
                          <option value="Llegada">Llegada</option>
                          <option value="Salida">Salida</option>
                          <option value="Traslado">Traslado</option>
                          <option value="Actividad">Actividad</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" list="hoteles-bd-list" value={row.hotel || ''} onChange={e => handleDatabaseChange(row.id, 'hotel', e.target.value)} className="w-28 bg-transparent border-b border-dashed focus:outline-none text-xs cursor-pointer" placeholder="Elegir..." /></td>
                      <td className="p-2"><input type="text" value={row.vuelo || ''} onChange={e => handleDatabaseChange(row.id, 'vuelo', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none text-xs" /></td>
                      <td className="p-2"><input type="time" value={row.pickUp || ''} onChange={e => handleDatabaseChange(row.id, 'pickUp', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none text-blue-600 font-medium text-xs" /></td>
                      <td className="p-2"><input type="number" value={row.pax || ''} onChange={e => handleDatabaseChange(row.id, 'pax', e.target.value)} className="w-12 bg-transparent border-b border-dashed focus:outline-none text-center" /></td>
                      <td className="p-2"><input type="text" value={row.telefono || ''} onChange={e => handleDatabaseChange(row.id, 'telefono', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none text-xs" /></td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <span className="text-green-700 font-bold mr-1">$</span>
                          <input type="text" value={row.cobro || ''} onChange={e => handleDatabaseChange(row.id, 'cobro', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none font-bold text-green-700" />
                        </div>
                      </td>
                      <td className="p-2">
                        <select value={row.metodoPago || ''} onChange={e => handleDatabaseChange(row.id, 'metodoPago', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none text-xs cursor-pointer">
                          <option value=""></option>
                          <option value="Efectivo">Efectivo</option>
                          <option value="Tarjeta">Tarjeta</option>
                          <option value="PayPal">PayPal</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" value={row.chofer || ''} onChange={e => handleDatabaseChange(row.id, 'chofer', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none text-gray-600 text-xs" /></td>
                      <td className="p-2">
                        <select value={row.vehiculo || ''} onChange={e => handleDatabaseChange(row.id, 'vehiculo', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none text-xs text-gray-600 cursor-pointer">
                          <option value=""></option>
                          <option value="Expedition">Expedition</option>
                          <option value="Hiace">Hiace</option>
                        </select>
                      </td>
                      <td className="p-2"><input type="text" value={row.proveedor || ''} onChange={e => handleDatabaseChange(row.id, 'proveedor', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none text-xs font-medium" /></td>
                      <td className="p-2">
                        <div className="flex items-center">
                          <span className="text-red-700 font-bold mr-1">$</span>
                          <input type="text" value={row.costoProveedor || ''} onChange={e => handleDatabaseChange(row.id, 'costoProveedor', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none font-bold text-red-700" />
                        </div>
                      </td>
                      <td className="p-2 text-xs">
                        <div className="flex flex-col gap-1 w-16">
                          <input type="text" placeholder="Car" value={row.carSeat > 0 ? row.carSeat : ''} onChange={e => handleDatabaseChange(row.id, 'carSeat', e.target.value)} className="w-full bg-transparent border-b border-dashed focus:outline-none" title="Car Seat" />
                          <input type="text" placeholder="Baby" value={row.babySeat > 0 ? row.babySeat : ''} onChange={e => handleDatabaseChange(row.id, 'babySeat', e.target.value)} className="w-full bg-transparent border-b border-dashed focus:outline-none" title="Baby Seat" />
                          <input type="text" placeholder="Bstr" value={row.booster > 0 ? row.booster : ''} onChange={e => handleDatabaseChange(row.id, 'booster', e.target.value)} className="w-full bg-transparent border-b border-dashed focus:outline-none" title="Booster" />
                        </div>
                      </td>
                      <td className="p-2"><input type="text" value={row.comentario || ''} onChange={e => handleDatabaseChange(row.id, 'comentario', e.target.value)} className="w-32 bg-transparent border-b border-dashed focus:outline-none text-xs text-gray-500" /></td>
                      <td className="p-2 text-center">
                        <button
                          onClick={async () => {
                            if (window.confirm('¿Estás seguro de que deseas eliminar este servicio de la Base de Datos permanentemente?')) {
                              try {
                                showToast('Eliminando...', 'success');
                                const { error } = await supabase.from('servicios').delete().eq('id', row.id);
                                if (error) throw error;
                                setServices(services.filter(s => s.id !== row.id));
                                showToast('¡Servicio eliminado!');
                              } catch (error) {
                                console.error("Error al eliminar:", error);
                                showToast('Error al eliminar', 'error');
                              }
                            }
                          }}
                          className="p-1 text-red-500 hover:bg-red-100 rounded"
                          title="Eliminar Servicio"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        { }
        {activeTab === 'cierre' && (
          <div className="bg-white rounded-lg shadow-md flex flex-col h-[80vh]">
            <div className="p-4 border-b bg-gray-50 rounded-t-lg">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Calendar className="text-blue-600" /> Módulo de Cierre
              </h2>
              <div className="flex flex-col md:flex-row gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Inicial</label>
                  <input type="date" value={cierreFilters.startDate} onChange={e => setCierreFilters({ ...cierreFilters, startDate: e.target.value })} className="border border-gray-300 rounded-md p-2 shadow-sm text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">Fecha Final</label>
                  <input type="date" value={cierreFilters.endDate} onChange={e => setCierreFilters({ ...cierreFilters, endDate: e.target.value })} className="border border-gray-300 rounded-md p-2 shadow-sm text-sm" />
                </div>
                {!cierreFilters.isCallCenter && (
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Vehículo (Opcional)</label>
                    <select
                      value={cierreFilters.vehiculo}
                      onChange={e => setCierreFilters({ ...cierreFilters, vehiculo: e.target.value })}
                      className="border border-gray-300 rounded-md p-2 shadow-sm text-sm w-full bg-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Todos (Sin filtro)</option>
                      <option value="Expedition">Expedition</option>
                      <option value="Hiace">Hiace</option>
                    </select>
                  </div>
                )}

                <div className="flex-1 text-center md:text-left">
                  {cierreFilters.isCallCenter && (
                    <div className="md:ml-4 bg-purple-100 border border-purple-300 px-4 py-2 rounded-lg inline-block shadow-sm">
                      <span className="text-sm font-medium text-purple-800">Total Acumulado de Comisión: </span>
                      <span className="text-xl font-bold text-purple-900">
                        ${callCenterServices.filter(s => {
                          let match = true;
                          if (cierreFilters.startDate && s.fechaSistema < cierreFilters.startDate) match = false;
                          if (cierreFilters.endDate && s.fechaSistema > cierreFilters.endDate) match = false;
                          return match;
                        }).reduce((sum, item) => sum + (parseFloat(item.comision) || 0), 0).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <button onClick={descargarCierrePDF} className="bg-red-600 text-white px-4 py-2 rounded-md font-bold shadow-sm flex items-center gap-2 hover:bg-red-700 transition-colors">
                    <Download size={18} /> Descargar PDF
                  </button>
                  <button onClick={() => setCierreFilters({ ...cierreFilters, isCallCenter: !cierreFilters.isCallCenter })} className={`px-4 py-2 rounded-md font-bold shadow-sm flex items-center gap-2 transition-colors ${cierreFilters.isCallCenter ? 'bg-purple-600 text-white hover:bg-purple-700' : 'bg-blue-600 text-white hover:bg-blue-700'}`}>
                    {cierreFilters.isCallCenter ? <Headset size={18} /> : <Users size={18} />}
                    {cierreFilters.isCallCenter ? 'Viendo: CALL CENTER' : 'Viendo: NORMALES'}
                  </button>
                </div>
              </div>
            </div>

            <div id="cierre-container" className="flex-1 overflow-x-auto overflow-y-auto p-4 w-full">
              <table className="min-w-max w-full text-left text-sm whitespace-nowrap">
                <thead className="sticky top-0 bg-white shadow-sm z-10">
                  <tr className={`border-b ${cierreFilters.isCallCenter ? 'text-purple-700 bg-purple-50' : 'text-gray-600 bg-gray-50'}`}>
                    {cierreFilters.isCallCenter ? (
                      <>
                        <th className="p-2">ID Registro</th><th className="p-2">Fecha Sistema</th><th className="p-2">Fecha Cliente</th>
                        <th className="p-2">Cliente</th><th className="p-2">Reserva</th><th className="p-2">Acción</th>
                        <th className="p-2">Comisión</th><th className="p-2">Mensaje Crudo</th>
                      </>
                    ) : (
                      <>
                        <th className="p-2">Fecha</th><th className="p-2">Hora</th><th className="p-2">Reserva</th><th className="p-2">Nombre</th>
                        <th className="p-2">Tipo</th><th className="p-2">Hotel</th><th className="p-2">Cobro</th><th className="p-2">Vehículo</th><th className="p-2">Chofer</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {(() => {
                    const dataSource = cierreFilters.isCallCenter ? callCenterServices : services;
                    const filtered = dataSource.filter(s => {
                      let match = true;
                      if (cierreFilters.isCallCenter) {
                        // Filtramos usando la fecha exacta en la que se ingresó al sistema (fechaSistema)
                        if (cierreFilters.startDate && s.fechaSistema < cierreFilters.startDate) match = false;
                        if (cierreFilters.endDate && s.fechaSistema > cierreFilters.endDate) match = false;
                      } else {
                        if (cierreFilters.startDate && s.fecha < cierreFilters.startDate) match = false;
                        if (cierreFilters.endDate && s.fecha > cierreFilters.endDate) match = false;
                        if (cierreFilters.vehiculo && !(s.vehiculo || '').toLowerCase().includes(cierreFilters.vehiculo.toLowerCase())) match = false;
                      }
                      return match;
                    });
                    if (filtered.length === 0) return <tr><td colSpan="9" className="text-center p-8 text-gray-500">No hay registros.</td></tr>;
                    return filtered.map(row => (
                      <tr key={row.id} className="hover:bg-gray-50">
                        {cierreFilters.isCallCenter ? (
                          <>
                            <td className="p-2 font-mono text-xs">{row.id}</td><td className="p-2">{row.fechaSistema}</td><td className="p-2 font-medium">{row.fechaCliente}</td>
                            <td className="p-2 font-bold uppercase">{row.cliente}</td><td className="p-2">{row.reserva}</td>
                            <td className="p-2"><span className={`px-2 py-1 rounded-full text-xs ${row.accion === 'Venta' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>{row.accion}</span></td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <span className="text-green-700 font-bold mr-1">$</span>
                                <input
                                  type="number"
                                  value={row.comision}
                                  onChange={(e) => handleCierreComisionChange(row.id, e.target.value)}
                                  className="w-16 bg-transparent border-b border-dashed border-gray-400 focus:outline-none focus:border-green-600 font-bold text-green-700"
                                />
                              </div>
                            </td>
                            <td className="p-2 text-xs text-gray-500 max-w-xs truncate" title={row.rawMessage}>{row.rawMessage}</td>
                          </>
                        ) : (
                          <>
                            <td className="p-2">{row.fecha}</td><td className="p-2 font-semibold">{row.hora}</td><td className="p-2">{row.reserva}</td>
                            <td className="p-2 font-bold">{row.nombre} {row.apellido}</td><td className="p-2">{row.tipoServicio}</td>
                            <td className="p-2">{row.hotel}</td>
                            <td className="p-2">
                              <div className="flex items-center">
                                <span className="text-green-700 font-bold mr-1">$</span>
                                <input
                                  type="text"
                                  value={calcularPrecioCierre(row.hotel, row.cobro, cierreFilters.vehiculo) || ''}
                                  onChange={(e) => handleCierreCobroChange(row.id, e.target.value)}
                                  placeholder="0.00"
                                  readOnly={cierreFilters.vehiculo === 'Expedition'}
                                  title={cierreFilters.vehiculo === 'Expedition' ? 'Precio automático por zona (No afecta BD)' : 'Precio editable'}
                                  className={`w-20 bg-transparent focus:outline-none font-bold text-green-700 ${cierreFilters.vehiculo === 'Expedition' ? 'border-transparent cursor-default' : 'border-b border-dashed border-gray-400 focus:border-green-600'}`}
                                />
                              </div>
                            </td>
                            <td className="p-2 font-medium">{row.vehiculo}</td><td className="p-2">{row.chofer}</td>
                          </>
                        )}
                      </tr>
                    ));
                  })()}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </main>

      { }
      {renderData?.type === 'share' && (
        <div className="fixed top-0 left-0 -z-50 pointer-events-none opacity-0">
          <div ref={shareRef} className="bg-white p-6 w-[500px] border-4 border-gray-800 rounded-xl font-sans">
            <div className="flex justify-between items-center border-b-2 border-gray-200 pb-4 mb-4">
              <BallardLogo className="h-12" />
              <div className="text-right">
                <div className="text-sm text-gray-500 uppercase tracking-widest">{renderData.data.fecha}</div>
                <div className="text-2xl font-bold">{renderData.data.hora}</div>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <div className="text-xs text-gray-500 uppercase">Pasajero</div>
                <div className="text-xl font-bold uppercase">{renderData.data.nombre} {renderData.data.apellido}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500 uppercase flex items-center gap-1"><MapPin size={12} /> Hotel / Destino</div>
                  <div className="font-semibold">{renderData.data.hotel}</div>
                </div>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="text-xs text-gray-500 uppercase">Vuelo</div>
                  <div className="font-semibold">{renderData.data.vuelo || 'N/A'}</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="border border-gray-200 p-3 rounded flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase flex items-center gap-1"><Users size={12} /> Pasajeros</span>
                  <span className="font-bold text-lg">{renderData.data.pax}</span>
                </div>
                <div className="border border-gray-200 p-3 rounded flex items-center justify-between">
                  <span className="text-xs text-gray-500 uppercase">Servicio</span>
                  <span className="font-bold text-blue-800">{renderData.data.tipoServicio}</span>
                </div>
              </div>
              {(renderData.data.carSeat > 0 || renderData.data.babySeat > 0 || renderData.data.booster > 0 || renderData.data.paradaCompras) && (
                <div className="bg-blue-50 text-blue-900 p-3 rounded border border-blue-100">
                  <div className="text-xs uppercase mb-1 font-semibold flex items-center gap-1"><Car size={12} /> Extras</div>
                  <div className="flex flex-wrap gap-3 font-medium text-sm">
                    {renderData.data.carSeat > 0 && <span>Car Seat: {renderData.data.carSeat}</span>}
                    {renderData.data.babySeat > 0 && <span>Baby Seat: {renderData.data.babySeat}</span>}
                    {renderData.data.booster > 0 && <span>Booster: {renderData.data.booster}</span>}
                    {renderData.data.paradaCompras && <span className="bg-blue-200 px-2 py-0.5 rounded">Parada de Compras</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {renderData?.type === 'sign' && (
        <div className="fixed top-0 left-0 -z-50 pointer-events-none opacity-0">
          <div ref={signRef} className="bg-white w-[1122px] h-[793px] flex flex-col items-center justify-center p-12 relative overflow-hidden font-sans">
            <div className="mb-12 flex justify-center w-full">
              <BallardLogo className="h-48" />
            </div>
            <div className="text-center w-full max-w-4xl mb-16">
              <div className="text-[130px] leading-none font-bold uppercase text-black break-words px-4 text-center w-full">
                {renderData.data.nombre}
              </div>
              <div className="text-[130px] leading-tight font-bold uppercase text-black break-words px-4 text-center w-full mt-6">
                {renderData.data.apellido}
              </div>
            </div>
            <div className="text-4xl font-medium tracking-[0.4em] text-gray-600 mt-4">
              WELCOME!
            </div>
          </div>
        </div>
      )}

    </div>
  );
}