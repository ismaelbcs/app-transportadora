import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Trash2, Download, Printer, Copy, Check, CheckCircle, 
  AlertCircle, Search, Calendar, Clock, DollarSign, Users, Plane, 
  MapPin, Globe, Mail, Phone, ArrowRight, ShieldCheck, FileText, 
  Eye, Edit3, X, Languages, ArrowLeft, Car, Receipt, ShoppingBag, BadgeCheck,
  Cloud, Database, RefreshCw, Send
} from 'lucide-react';
import { Document, Page, Text, View, pdf } from '@react-pdf/renderer';

// Documento PDF Nativo Vectorial para Presupuesto / Ticket de Venta (Diseño Sobrio, Formal y Recto)
const PresupuestoPDFDocument = ({ cotizacion, idioma, formatearMetodoPago }) => {
  const isEN = idioma === 'EN';
  const esVenta = cotizacion.tipoDocumento === 'VENTA' || cotizacion.estado === 'VENTA';
  const numFolio = cotizacion.numeroTicket || cotizacion.folio || 'COT-0000';
  const fechaEmision = cotizacion.fechaEmision || new Date().toISOString().split('T')[0];

  const tituloPrincipal = esVenta
    ? (isEN ? 'OFFICIAL SALES TICKET' : 'TICKET DE VENTA - TRANSPORTE')
    : (isEN ? 'TRANSPORTATION QUOTE' : 'PRESUPUESTO DE TRANSPORTE');
  const subtituloSeguro = esVenta
    ? (isEN
      ? `Confirmed Private Transportation (${cotizacion.tipoVehiculo || 'SUV'}) / Official Ticket`
      : `Transporte Privado Confirmado (${cotizacion.tipoVehiculo || 'SUV'}) / Boleto Oficial`)
    : (isEN
      ? `Private Transportation (${cotizacion.tipoVehiculo || 'SUV'}) / Safe Ticket`
      : `Transporte Privado (${cotizacion.tipoVehiculo || 'SUV'}) / Boleto Seguro`);
  const badgeEstado = esVenta
    ? (isEN ? 'SALE CONFIRMED' : 'VENTA CONFIRMADA')
    : (isEN
      ? (cotizacion.estado === 'CONVERTIDO' ? 'RESERVED' : (cotizacion.estado === 'APROBADO' ? 'CONFIRMED' : 'IN REVIEW'))
      : (cotizacion.estado || 'EN REVISIÓN'));
  const folioLabel = esVenta
    ? (isEN ? 'SALES TICKET #:' : 'N° TICKET:')
    : 'FOLIO:';
  const fechaLabel = isEN ? 'DATE:' : 'FECHA:';

  const isUSD = (cotizacion.moneda || 'USD') === 'USD';
  const totalNum = parseFloat(cotizacion.precioTotal) || 0;
  const tcNum = parseFloat(cotizacion.tipoCambio) || 0;
  const mostrarConversion = cotizacion.mostrarEquivalenteMXN !== false && tcNum > 0;
  const convertedNum = tcNum > 0 ? (isUSD ? totalNum * tcNum : totalNum / tcNum) : 0;
  const primaryCurrency = isUSD ? 'USD' : 'MXN';
  const secondaryCurrency = isUSD ? 'MXN' : 'USD';

  return (
    <Document>
      <Page size="LETTER" style={{ backgroundColor: '#ffffff', padding: 28, fontFamily: 'Helvetica', color: '#0f172a' }}>
        <View style={{ borderWidth: 1, borderColor: '#94a3b8' }}>
          {/* ENCABEZADO SOBRIO */}
          <View style={{ backgroundColor: '#f8fafc', borderBottomWidth: 2, borderBottomColor: '#0f172a', padding: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <View style={{ width: '62%' }}>
              <Text style={{ color: '#0f172a', fontSize: 20, fontFamily: 'Helvetica-Bold', letterSpacing: 0.5 }}>BALLARD TOUR SERVICES</Text>
              <Text style={{ color: '#0f172a', fontSize: 13, fontFamily: 'Helvetica-Bold', marginTop: 8 }}>{tituloPrincipal}</Text>
              <Text style={{ color: '#475569', fontSize: 9, marginTop: 2 }}>{subtituloSeguro}</Text>
            </View>
            <View style={{ width: '38%', alignItems: 'flex-end' }}>
              <View style={{ borderWidth: 1, borderColor: '#0f172a', backgroundColor: '#ffffff', paddingHorizontal: 10, paddingVertical: 4, marginBottom: 6 }}>
                <Text style={{ color: '#0f172a', fontSize: 8.5, fontFamily: 'Helvetica-Bold' }}>{badgeEstado}</Text>
              </View>
              <Text style={{ color: '#0f172a', fontSize: 10, fontFamily: 'Helvetica-Bold' }}>
                {folioLabel} {numFolio}
              </Text>
              <Text style={{ color: '#475569', fontSize: 8.5, marginTop: 2 }}>
                {fechaLabel} {fechaEmision}
              </Text>
            </View>
          </View>

          {/* CUERPO DEL DOCUMENTO */}
          <View style={{ padding: 18 }}>
            {/* TABLA DE DATOS GENERALES DEL CLIENTE */}
            <View style={{ borderWidth: 1, borderColor: '#cbd5e1', marginBottom: 14 }}>
              {/* FILA 1: CLIENTE, PAX, VEHÍCULO, VUELO */}
              <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#cbd5e1' }}>
                <View style={{ width: '36%', padding: 8, borderRightWidth: 1, borderRightColor: '#cbd5e1' }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    {isEN ? 'PASSENGER / CLIENT NAME' : 'NOMBRE DEL PASAJERO / CLIENTE'}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                    {cotizacion.nombreCliente || (isEN ? '[Client Name]' : '[Nombre del Cliente]')}
                  </Text>
                </View>
                <View style={{ width: '14%', padding: 8, borderRightWidth: 1, borderRightColor: '#cbd5e1' }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    PAX
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                    {cotizacion.pax || '1'}
                  </Text>
                </View>
                <View style={{ width: '20%', padding: 8, borderRightWidth: 1, borderRightColor: '#cbd5e1' }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    {isEN ? 'VEHICLE TYPE' : 'VEHÍCULO'}
                  </Text>
                  <Text style={{ fontSize: 11.5, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                    {cotizacion.tipoVehiculo === 'VAN' ? 'VAN' : 'SUV'}
                  </Text>
                </View>
                <View style={{ width: '30%', padding: 8 }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    {isEN ? 'AIRLINE & FLIGHT' : 'AEROLÍNEA Y VUELO'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#0f172a', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase' }}>
                    {cotizacion.aerolineaVuelo || (isEN ? '[Airline & Flight]' : '[Aerolínea y Vuelo]')}
                  </Text>
                </View>
              </View>

              {/* FILA 2: HOTEL, MÉTODO DE PAGO, CHECKOUT */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ width: '36%', padding: 8, borderRightWidth: 1, borderRightColor: '#cbd5e1' }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    {isEN ? 'HOTEL / MAIN LODGING' : 'HOTEL / ALOJAMIENTO PRINCIPAL'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                    {cotizacion.hotelPrincipal || (isEN ? '[Hotel or Villa Name]' : '[Nombre del Hotel o Villa]')}
                  </Text>
                </View>
                <View style={{ width: '34%', padding: 8, borderRightWidth: 1, borderRightColor: '#cbd5e1' }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    {isEN ? 'PAYMENT METHOD' : 'MÉTODO DE PAGO'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                    {formatearMetodoPago ? formatearMetodoPago(cotizacion.metodoPago, idioma) : (cotizacion.metodoPago || '')}
                  </Text>
                </View>
                <View style={{ width: '30%', padding: 8 }}>
                  <Text style={{ fontSize: 7.5, color: '#64748b', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginBottom: 2 }}>
                    {isEN ? 'RETURN TIME (CHECK-OUT)' : 'HORA DE REGRESO (CHECK-OUT)'}
                  </Text>
                  <Text style={{ fontSize: 11, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                    {cotizacion.horaCheckout ? `${cotizacion.horaCheckout} HRS` : '[HH:MM HRS]'}
                  </Text>
                </View>
              </View>
            </View>

            {/* TÍTULO DE ITINERARIO */}
            <View style={{ borderBottomWidth: 1.5, borderBottomColor: '#0f172a', paddingBottom: 3, marginBottom: 8 }}>
              <Text style={{ fontSize: 11, fontFamily: 'Helvetica-Bold', color: '#0f172a', textTransform: 'uppercase' }}>
                {isEN ? 'Requested Itinerary and Destinations' : 'Itinerario y Destinos Solicitados'}
              </Text>
            </View>

            {/* TABLA DE ITINERARIO */}
            <View style={{ marginBottom: 14, borderWidth: 1, borderColor: '#cbd5e1' }}>
              <View style={{ flexDirection: 'row', backgroundColor: '#f1f5f9', borderBottomWidth: 1, borderBottomColor: '#94a3b8', paddingVertical: 6, paddingHorizontal: 8 }}>
                <Text style={{ width: '20%', fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#1e293b', textTransform: 'uppercase' }}>
                  {isEN ? 'STAGE' : 'ETAPA'}
                </Text>
                <Text style={{ width: '42%', fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#1e293b', textTransform: 'uppercase' }}>
                  {isEN ? 'ROUTE / DESTINATION DESCRIPTION' : 'DESCRIPCIÓN DEL TRAYECTO / DESTINO'}
                </Text>
                <Text style={{ width: '10%', fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#1e293b', textTransform: 'uppercase', textAlign: 'center' }}>
                  PAX
                </Text>
                <Text style={{ width: '28%', fontSize: 7.5, fontFamily: 'Helvetica-Bold', color: '#1e293b', textTransform: 'uppercase' }}>
                  {isEN ? 'DATE AND TIME' : 'FECHA Y HORA'}
                </Text>
              </View>

              {(cotizacion.etapas || []).map((etapa, idx) => {
                const traducirLugar = (txt) => {
                  if (!txt) return '';
                  return isEN ? String(txt).replace(/Aeropuerto SJD/gi, 'SJD Airport') : String(txt);
                };
                let descripcionTrayecto = '';
                if (etapa.origen && etapa.destino) {
                  descripcionTrayecto = `${traducirLugar(etapa.origen)} -> ${traducirLugar(etapa.destino)}`;
                } else if (etapa.tipo === 'llegada') {
                  descripcionTrayecto = `${isEN ? 'SJD Airport' : 'Aeropuerto SJD'} -> ${traducirLugar(etapa.destino || cotizacion.hotelPrincipal) || (isEN ? '[Destination Hotel]' : '[Hotel Destino]')}`;
                } else if (etapa.tipo === 'salida') {
                  descripcionTrayecto = `${traducirLugar(etapa.origen || cotizacion.hotelPrincipal) || (isEN ? '[Destination Hotel]' : '[Hotel Destino]')} -> ${isEN ? 'SJD Airport' : 'Aeropuerto SJD'}`;
                } else {
                  descripcionTrayecto = etapa.destino
                    ? (isEN ? `To ${traducirLugar(etapa.destino)}` : `Hacia ${etapa.destino}`)
                    : (isEN ? '[Origin -> Destination]' : '[Lugar Origen -> Lugar Destino]');
                }

                const fechaFormateada = etapa.fecha || (isEN ? '[YYYY-MM-DD]' : '[DD-MMM-AAAA]');
                const paxTramo = etapa.pax || cotizacion.pax || '1';
                const horaPickUp = etapa.horaRecogida || etapa.hora;
                const horaReturn = etapa.horaRegreso;

                return (
                  <View
                    key={etapa.id || idx}
                    wrap={false}
                    style={{
                      flexDirection: 'row',
                      backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc',
                      borderBottomWidth: 0.5,
                      borderBottomColor: '#e2e8f0',
                      paddingVertical: 8,
                      paddingHorizontal: 8
                    }}
                  >
                    <View style={{ width: '20%', paddingRight: 6 }}>
                      <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>
                        {isEN ? (etapa.etiquetaEN || etapa.etiquetaES) : (etapa.etiquetaES || etapa.etiquetaEN)}
                      </Text>
                    </View>
                    <View style={{ width: '42%', paddingRight: 6 }}>
                      <Text style={{ fontSize: 9.5, color: '#1e293b' }}>
                        {descripcionTrayecto}
                      </Text>
                    </View>
                    <View style={{ width: '10%', alignItems: 'center' }}>
                      <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#0f172a' }}>
                        {paxTramo}
                      </Text>
                    </View>
                    <View style={{ width: '28%' }}>
                      <Text style={{ fontSize: 9, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 2 }}>
                        {fechaFormateada}
                      </Text>
                      {horaPickUp ? (
                        <Text style={{ fontSize: 8, color: '#334155' }}>
                          <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                            {isEN ? 'Pick-up: ' : 'Recogida: '}
                          </Text>
                          {horaPickUp}
                        </Text>
                      ) : null}
                      {horaReturn ? (
                        <Text style={{ fontSize: 8, color: '#334155', marginTop: 1 }}>
                          <Text style={{ fontFamily: 'Helvetica-Bold' }}>
                            {isEN ? 'Return: ' : 'Regreso: '}
                          </Text>
                          {horaReturn}
                        </Text>
                      ) : null}
                      {!horaPickUp && !horaReturn ? (
                        <Text style={{ fontSize: 8, color: '#64748b' }}>[HH:MM]</Text>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </View>

            {/* CUADRO DE PRECIO TOTAL SOBRIO */}
            <View wrap={false} style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', padding: 12, alignItems: 'flex-end', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 8.5, color: '#475569', fontFamily: 'Helvetica-Bold', textTransform: 'uppercase', marginRight: 8 }}>
                  {isEN ? 'TOTAL QUOTE:' : 'TOTAL DEL PRESUPUESTO:'}
                </Text>
                <Text style={{ fontSize: 16, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>
                  $ {totalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {primaryCurrency}
                </Text>
              </View>
              {mostrarConversion ? (
                <View style={{ marginTop: 4 }}>
                  <Text style={{ fontSize: 8.5, color: '#334155', fontFamily: 'Helvetica-Bold' }}>
                    {isEN ? 'Approx. ' : 'Equivalente: '}
                    $ {convertedNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {secondaryCurrency}
                    {'  '}
                    ({isEN ? 'Exchange Rate:' : 'Tipo de Cambio:'} ${tcNum.toFixed(2)} MXN/USD)
                  </Text>
                </View>
              ) : null}
            </View>

            {/* INSTRUCCIONES DE LLEGADA */}
            <View wrap={false} style={{ backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', padding: 12 }}>
              <Text style={{ fontSize: 9.5, fontFamily: 'Helvetica-Bold', color: '#0f172a', marginBottom: 4, textTransform: 'uppercase' }}>
                {isEN ? 'HOW TO FIND YOUR DRIVER UPON ARRIVAL' : 'INSTRUCCIONES PARA UBICAR A SU CHOFER'}
              </Text>
              <Text style={{ fontSize: 8.5, color: '#334155', lineHeight: 1.4, textAlign: 'justify' }}>
                {isEN
                  ? 'All transport companies are waiting outside the departure gate. You just have to walk to the parking lot and look for your name on a sign. We are usually located in the "GROUP EXIT" (Shadow 3 / Terminal 1). When you get there, walk into the parking lot and you will see our staff holding up your name signs.'
                  : 'Todas las compañías de transporte esperan afuera de la puerta de salidas. Solo tiene que caminar hacia el estacionamiento y buscar su nombre en un letrero. Usualmente nos encontramos en la "SALIDA DE GRUPOS" (Shadow 3 / Terminal 1). Cuando llegue ahí, camine al estacionamiento y verá a nuestro personal sosteniendo sus letreros.'}
              </Text>
            </View>
          </View>

          {/* PIE DE PÁGINA SOBRIO */}
          <View wrap={false} style={{ borderTopWidth: 1, borderTopColor: '#cbd5e1', backgroundColor: '#f1f5f9', paddingVertical: 10, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ fontSize: 8.5, color: '#334155', fontFamily: 'Helvetica-Bold' }}>Tel: +52 612 194 3286   |   reservationballard@gmail.com</Text>
            <Text style={{ fontSize: 8.5, color: '#0f172a', fontFamily: 'Helvetica-Bold' }}>www.caboprivateairporttransfers.com</Text>
          </View>
        </View>
      </Page>
    </Document>
  );
};

export default function Presupuestos({ 
  services = [], 
  LISTA_HOTELES = [], 
  supabase, 
  fetchAllData, 
  showToast,
  tipoCambioDolar = '',
  setTipoCambioDolar
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

  // Tipo de cambio por defecto (localStorage > prop de cierre financiero > fallback '20.00')
  const getInitialTipoCambio = () => {
    try {
      const guardado = localStorage.getItem('ballard_tipo_cambio');
      if (guardado && parseFloat(guardado) > 0) return guardado;
    } catch (e) {}
    if (tipoCambioDolar && parseFloat(tipoCambioDolar) > 0) return tipoCambioDolar;
    return '20.00';
  };

  // Estado del presupuesto actual
  const [cotizacion, setCotizacion] = useState({
    id: `COT-${Date.now()}`,
    folio: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
    fechaEmision: new Date().toISOString().split('T')[0],
    estado: 'EN REVISIÓN', // 'EN REVISIÓN' | 'COTIZADO' | 'APROBADO' | 'CONVERTIDO' | 'VENTA'
    tipoDocumento: 'PRESUPUESTO', // 'PRESUPUESTO' | 'VENTA'
    numeroTicket: null, // ej. 'TCK-0001'
    
    // Datos del cliente
    nombreCliente: '',
    pax: '2',
    tipoVehiculo: 'SUV', // 'SUV' | 'VAN'
    aerolineaVuelo: '',
    hotelPrincipal: '',
    metodoPago: 'Pendiente / Efectivo',
    horaCheckout: '',
    precioTotal: '0.00',
    moneda: 'USD', // 'USD' | 'MXN'
    tipoCambio: getInitialTipoCambio(),
    mostrarEquivalenteMXN: true,
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
        horaRecogida: '',
        horaRegreso: '',
        hora: '',
        pax: '2',
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
        horaRecogida: '',
        horaRegreso: '',
        hora: '',
        pax: '2',
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
        horaRecogida: '',
        horaRegreso: '',
        hora: '',
        pax: '2',
        precio: ''
      }
    ]
  });

  // Historial de cotizaciones (localStorage con fallback persistente)
  const [historialCotizaciones, setHistorialCotizaciones] = useState([]);
  const [filtroHistorial, setFiltroHistorial] = useState('');
  const [filtroTipoHistorial, setFiltroTipoHistorial] = useState('TODOS'); // 'TODOS' | 'VENTAS' | 'COTIZACIONES'

  // Próximo número de ticket de venta consecutivo (Prefijo TCK-)
  const [proximoTicket, setProximoTicket] = useState('TCK-0001');

  // Función para calcular el siguiente número consecutivo de ticket de venta
  const obtenerSiguienteNumeroTicket = async () => {
    let maxNum = 0;

    // 1. Revisar en historial de presupuestos/ventas de localStorage
    try {
      const guardado = localStorage.getItem('ballard_presupuestos_v1');
      if (guardado) {
        const items = JSON.parse(guardado);
        if (Array.isArray(items)) {
          items.forEach(item => {
            const candidates = [item.numeroTicket, item.folio, item.id];
            candidates.forEach(str => {
              if (str && typeof str === 'string') {
                const match = str.match(/TCK-(\d+)/i);
                if (match) {
                  const n = parseInt(match[1], 10);
                  if (!isNaN(n) && n > maxNum) maxNum = n;
                }
              }
            });
          });
        }
      }
    } catch (e) {
      console.error('Error calculando consecutivo en localStorage:', e);
    }

    // 2. Revisar en contador persistente de localStorage
    try {
      const guardadoContador = localStorage.getItem('ballard_ultimo_ticket_venta');
      if (guardadoContador) {
        const n = parseInt(guardadoContador, 10);
        if (!isNaN(n) && n > maxNum) maxNum = n;
      }
    } catch (e) {}

    // 3. Revisar en Supabase en servicios si existe algún ticket TCK-
    if (supabase) {
      try {
        const { data } = await supabase
          .from('servicios')
          .select('reserva, comentario')
          .or('reserva.ilike.TCK-%,comentario.ilike.%TCK-%');

        if (data && data.length > 0) {
          data.forEach(item => {
            const matchRes = item.reserva?.match(/TCK-(\d+)/i);
            if (matchRes) {
              const n = parseInt(matchRes[1], 10);
              if (!isNaN(n) && n > maxNum) maxNum = n;
            }
            const matchCom = item.comentario?.match(/TCK-(\d+)/i);
            if (matchCom) {
              const n = parseInt(matchCom[1], 10);
              if (!isNaN(n) && n > maxNum) maxNum = n;
            }
          });
        }
      } catch (e) {
        // Fallback transparente sin romper flujo
      }
    }

    const siguiente = maxNum + 1;
    return `TCK-${siguiente.toString().padStart(4, '0')}`;
  };

  // Recalcular el próximo ticket consecutivo
  useEffect(() => {
    let cancelado = false;
    const actualizarProximo = async () => {
      const sig = await obtenerSiguienteNumeroTicket();
      if (!cancelado) setProximoTicket(sig);
    };
    actualizarProximo();
    return () => { cancelado = true; };
  }, [historialCotizaciones, activeSubTab]);

  // Manejar creación de Venta directa con número de ticket consecutivo
  const handleRealizarVenta = async () => {
    let ticketNum = cotizacion.numeroTicket;
    if (!ticketNum || !ticketNum.startsWith('TCK-')) {
      ticketNum = await obtenerSiguienteNumeroTicket();
    }

    const ventaActualizada = {
      ...cotizacion,
      tipoDocumento: 'VENTA',
      numeroTicket: ticketNum,
      folio: ticketNum,
      estado: 'VENTA'
    };

    setCotizacion(ventaActualizada);

    // Guardar último consecutivo numérico
    const n = parseInt(ticketNum.replace('TCK-', ''), 10);
    if (!isNaN(n)) {
      try {
        localStorage.setItem('ballard_ultimo_ticket_venta', n.toString());
      } catch (e) {}
    }

    // Guardar de inmediato en el historial de cotizaciones/ventas
    const index = historialCotizaciones.findIndex(c => c.id === ventaActualizada.id);
    let nuevoHistorial = [...historialCotizaciones];
    if (index >= 0) {
      nuevoHistorial[index] = ventaActualizada;
    } else {
      nuevoHistorial = [ventaActualizada, ...historialCotizaciones];
    }
    guardarEnStorage(nuevoHistorial);

    if (showToast) {
      showToast(`¡Venta realizada con éxito! Ticket Oficial: ${ticketNum}`, 'success');
    }
  };

  // Revertir de Venta a Cotización preliminar
  const handleRevertirACotizacion = () => {
    const nuevoFolio = `COT-${Math.floor(1000 + Math.random() * 9000)}`;
    setCotizacion(prev => ({
      ...prev,
      tipoDocumento: 'PRESUPUESTO',
      numeroTicket: null,
      folio: nuevoFolio,
      estado: 'EN REVISIÓN'
    }));
    if (showToast) showToast('Cambiado a Cotización preliminar', 'info');
  };

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
  const [readyShareModal, setReadyShareModal] = useState(null);

  // Estado de sincronización con Supabase (Base de Datos)
  const [cargandoHistorialBD, setCargandoHistorialBD] = useState(false);
  const [sincronizandoBD, setSincronizandoBD] = useState(false);
  const [tablaSupabaseExiste, setTablaSupabaseExiste] = useState(null); // null (desconocido) | true | false
  const [mostrarModalSQL, setMostrarModalSQL] = useState(false);
  const [sqlCopiado, setSqlCopiado] = useState(false);

  // Script SQL para crear la tabla 'presupuestos' en Supabase si no existe
  const SQL_CREAR_TABLA_PRESUPUESTOS = `-- 1. Crear tabla de presupuestos y cotizaciones en Supabase
CREATE TABLE IF NOT EXISTS public.presupuestos (
  id TEXT PRIMARY KEY,
  folio TEXT,
  numero_ticket TEXT,
  tipo_documento TEXT DEFAULT 'PRESUPUESTO',
  fecha_emision DATE,
  estado TEXT,
  nombre_cliente TEXT,
  pax TEXT,
  tipo_vehiculo TEXT,
  aerolinea_vuelo TEXT,
  hotel_principal TEXT,
  metodo_pago TEXT,
  hora_checkout TEXT,
  precio_total NUMERIC,
  moneda TEXT DEFAULT 'USD',
  tipo_cambio NUMERIC,
  mostrar_equivalente_mxn BOOLEAN DEFAULT true,
  notas_personalizadas TEXT,
  etapas JSONB,
  data_completa JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Habilitar seguridad de nivel de fila y permisos de lectura/escritura
ALTER TABLE public.presupuestos ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Permitir todo en presupuestos" ON public.presupuestos;
CREATE POLICY "Permitir todo en presupuestos" ON public.presupuestos FOR ALL USING (true) WITH CHECK (true);`;

  // Mapear registro de Supabase al objeto cotizacion de React
  const mapSupabaseToCotizacion = (row) => {
    if (row.data_completa && typeof row.data_completa === 'object') {
      return {
        ...row.data_completa,
        id: row.id || row.data_completa.id,
        folio: row.folio || row.data_completa.folio,
        numeroTicket: row.numero_ticket || row.data_completa.numeroTicket,
        tipoDocumento: row.tipo_documento || row.data_completa.tipoDocumento || 'PRESUPUESTO',
        estado: row.estado || row.data_completa.estado,
        fechaEmision: row.fecha_emision || row.data_completa.fechaEmision
      };
    }
    return {
      id: row.id,
      folio: row.folio,
      numeroTicket: row.numero_ticket,
      tipoDocumento: row.tipo_documento || 'PRESUPUESTO',
      fechaEmision: row.fecha_emision,
      estado: row.estado,
      nombreCliente: row.nombre_cliente || '',
      pax: row.pax?.toString() || '2',
      tipoVehiculo: row.tipo_vehiculo || 'SUV',
      aerolineaVuelo: row.aerolinea_vuelo || '',
      hotelPrincipal: row.hotel_principal || '',
      metodoPago: row.metodo_pago || 'Pendiente / Efectivo',
      horaCheckout: row.hora_checkout || '',
      precioTotal: row.precio_total?.toString() || '0.00',
      moneda: row.moneda || 'USD',
      tipoCambio: row.tipo_cambio?.toString() || '20.00',
      mostrarEquivalenteMXN: row.mostrar_equivalente_mxn !== false,
      notasPersonalizadas: row.notas_personalizadas || '',
      etapas: Array.isArray(row.etapas) ? row.etapas : []
    };
  };

  // Mapear cotizacion de React al formato de Supabase
  const mapCotizacionToSupabase = (cotiz) => ({
    id: cotiz.id,
    folio: cotiz.folio,
    numero_ticket: cotiz.numeroTicket || null,
    tipo_documento: cotiz.tipoDocumento || 'PRESUPUESTO',
    fecha_emision: cotiz.fechaEmision || new Date().toISOString().split('T')[0],
    estado: cotiz.estado || 'EN REVISIÓN',
    nombre_cliente: cotiz.nombreCliente || '',
    pax: cotiz.pax?.toString() || '2',
    tipo_vehiculo: cotiz.tipoVehiculo || 'SUV',
    aerolinea_vuelo: cotiz.aerolineaVuelo || '',
    hotel_principal: cotiz.hotelPrincipal || '',
    metodo_pago: cotiz.metodoPago || 'Pendiente / Efectivo',
    hora_checkout: cotiz.horaCheckout || '',
    precio_total: parseFloat(cotiz.precioTotal) || 0,
    moneda: cotiz.moneda || 'USD',
    tipo_cambio: parseFloat(cotiz.tipoCambio) || 20,
    mostrar_equivalente_mxn: cotiz.mostrarEquivalenteMXN !== false,
    notas_personalizadas: cotiz.notasPersonalizadas || '',
    etapas: cotiz.etapas || [],
    data_completa: cotiz,
    updated_at: new Date().toISOString()
  });

  // Cargar historial desde Supabase
  const cargarHistorialDeSupabase = async () => {
    if (!supabase) return;
    setCargandoHistorialBD(true);
    try {
      const { data, error } = await supabase
        .from('presupuestos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        if (error.code === '42P01' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
          setTablaSupabaseExiste(false);
        } else {
          console.warn('Error al consultar presupuestos en Supabase:', error.message);
        }
      } else if (data) {
        setTablaSupabaseExiste(true);
        const mapeados = data
          .filter(row => row.id !== 'CFG_PAGOS_PROVEEDORES_V1')
          .map(mapSupabaseToCotizacion);
        setHistorialCotizaciones(mapeados);
        try {
          localStorage.setItem('ballard_presupuestos_v1', JSON.stringify(mapeados));
        } catch (e) {}
      }
    } catch (err) {
      console.warn('Error al conectar con Supabase:', err);
    } finally {
      setCargandoHistorialBD(false);
    }
  };

  // Cargar historial al iniciar (localStorage primero, luego Supabase)
  useEffect(() => {
    try {
      const guardado = localStorage.getItem('ballard_presupuestos_v1');
      if (guardado) {
        setHistorialCotizaciones(JSON.parse(guardado));
      }
    } catch (e) {
      console.error('Error al cargar historial de presupuestos local:', e);
    }

    cargarHistorialDeSupabase();
  }, []);

  // Guardar historial en localStorage y en Supabase (Base de Datos)
  const guardarEnStorage = async (nuevoHistorial, itemModificado = null) => {
    setHistorialCotizaciones(nuevoHistorial);
    try {
      localStorage.setItem('ballard_presupuestos_v1', JSON.stringify(nuevoHistorial));
    } catch (e) {
      console.error('Error al guardar en storage:', e);
    }

    // Persistir automáticamente en la base de datos Supabase
    if (supabase && itemModificado) {
      try {
        const dbRecord = mapCotizacionToSupabase(itemModificado);
        const { error } = await supabase.from('presupuestos').upsert(dbRecord);
        if (error) {
          if (error.code === '42P01' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
            setTablaSupabaseExiste(false);
          } else {
            console.warn('Advertencia al guardar en Supabase:', error.message);
          }
        } else {
          setTablaSupabaseExiste(true);
        }
      } catch (e) {
        console.warn('Error de red al guardar en Supabase:', e);
      }
    }
  };

  // Sincronizar todo el historial local hacia Supabase
  const handleSincronizarTodoASupabase = async () => {
    if (!supabase) return;
    setSincronizandoBD(true);
    try {
      const records = historialCotizaciones.map(mapCotizacionToSupabase);
      const { error } = await supabase.from('presupuestos').upsert(records);
      if (error) {
        if (error.code === '42P01' || error.message?.includes('schema cache') || error.message?.includes('does not exist')) {
          setTablaSupabaseExiste(false);
          setMostrarModalSQL(true);
        } else {
          if (showToast) showToast(`Error al sincronizar: ${error.message}`, 'error');
        }
      } else {
        setTablaSupabaseExiste(true);
        if (showToast) showToast(`¡${records.length} presupuestos sincronizados con éxito en Supabase!`, 'success');
      }
    } catch (err) {
      if (showToast) showToast('Error de conexión con Supabase', 'error');
    } finally {
      setSincronizandoBD(false);
    }
  };

  // Copiar código SQL al portapapeles
  const copiarSQLAlPortapapeles = async () => {
    try {
      await navigator.clipboard.writeText(SQL_CREAR_TABLA_PRESUPUESTOS);
      setSqlCopiado(true);
      if (showToast) showToast('¡SQL copiado al portapapeles!', 'success');
      setTimeout(() => setSqlCopiado(false), 2500);
    } catch (e) {
      if (showToast) showToast('No se pudo copiar el texto', 'error');
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
        tipoVehiculo: (reserva.vehiculo?.toLowerCase().includes('hiace') || reserva.vehiculo?.toUpperCase() === 'VAN' || parseInt(reserva.pax, 10) > 6) ? 'VAN' : (prev.tipoVehiculo || 'SUV'),
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
        horaRecogida: '',
        horaRegreso: '',
        hora: '',
        pax: prev.pax || '2',
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
  const handleEtapaChange = (id, field, rawValue) => {
    const value = typeof rawValue === 'string' && !['fecha', 'hora', 'horaRecogida', 'horaRegreso', 'tipo', 'id'].includes(field)
      ? rawValue.toUpperCase()
      : rawValue;
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
  const handleCotizacionChange = (field, rawValue) => {
    const value = typeof rawValue === 'string' && !['fechaEmision', 'horaCheckout', 'id'].includes(field)
      ? rawValue.toUpperCase()
      : rawValue;
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

      // Si cambió el PAX general, sincronizarlo en las etapas que no tengan un valor personalizado
      if (field === 'pax' && value) {
        updated.etapas = prev.etapas.map(e => {
          if (!e.pax || e.pax === prev.pax) {
            return { ...e, pax: value };
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

    const esVentaDoc = cotizacion.tipoDocumento === 'VENTA' || cotizacion.estado === 'VENTA';
    const tagDoc = esVentaDoc ? `Ticket de Venta ${cotizacion.numeroTicket || cotizacion.folio}` : `Presupuesto ${cotizacion.folio}`;
    
    const indexExistente = historialCotizaciones.findIndex(c => c.id === cotizacion.id);
    let nuevoHistorial;
    if (indexExistente >= 0) {
      nuevoHistorial = [...historialCotizaciones];
      nuevoHistorial[indexExistente] = nuevaCotizacion;
      if (showToast) showToast(`${tagDoc} actualizado`, 'success');
    } else {
      nuevoHistorial = [nuevaCotizacion, ...historialCotizaciones];
      if (showToast) showToast(`${tagDoc} guardado en el historial`, 'success');
    }

    guardarEnStorage(nuevoHistorial, nuevaCotizacion);
  };

  // Manejador para actualizar el tipo de cambio y persistirlo
  const handleTipoCambioChange = (val) => {
    handleCotizacionChange('tipoCambio', val);
    try {
      localStorage.setItem('ballard_tipo_cambio', val);
    } catch (e) {}
    if (setTipoCambioDolar && val) {
      setTipoCambioDolar(val);
    }
  };

  // Crear una nueva cotización limpia
  const handleNuevoPresupuesto = () => {
    limpiarVinculacion();
    setCotizacion({
      id: `COT-${Date.now()}`,
      folio: `COT-${Math.floor(1000 + Math.random() * 9000)}`,
      fechaEmision: new Date().toISOString().split('T')[0],
      estado: 'EN REVISIÓN',
      tipoDocumento: 'PRESUPUESTO',
      numeroTicket: null,
      nombreCliente: '',
      pax: '2',
      tipoVehiculo: 'SUV',
      aerolineaVuelo: '',
      hotelPrincipal: '',
      metodoPago: 'Pendiente / Efectivo',
      horaCheckout: '',
      precioTotal: '0.00',
      moneda: 'USD',
      tipoCambio: getInitialTipoCambio(),
      mostrarEquivalenteMXN: true,
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
          horaRecogida: '',
          horaRegreso: '',
          hora: '',
          pax: '2',
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
          horaRecogida: '',
          horaRegreso: '',
          hora: '',
          pax: '2',
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
          horaRecogida: '',
          horaRegreso: '',
          hora: '',
          pax: '2',
          precio: ''
        }
      ]
    });
    setActiveSubTab('editor');
    if (showToast) showToast('Formulario de presupuesto listo', 'success');
  };

  // Cargar una cotización del historial al editor
  const handleCargarCotizacion = (cotiz) => {
    setCotizacion({
      ...cotiz,
      tipoDocumento: cotiz.tipoDocumento || (cotiz.estado === 'VENTA' || cotiz.folio?.startsWith('TCK-') ? 'VENTA' : 'PRESUPUESTO'),
      numeroTicket: cotiz.numeroTicket || (cotiz.folio?.startsWith('TCK-') ? cotiz.folio : null),
      tipoVehiculo: cotiz.tipoVehiculo || 'SUV',
      moneda: cotiz.moneda || 'USD',
      tipoCambio: cotiz.tipoCambio || getInitialTipoCambio(),
      mostrarEquivalenteMXN: cotiz.mostrarEquivalenteMXN !== false
    });
    if (cotiz.idiomaGuardado) {
      setIdioma(cotiz.idiomaGuardado);
    }
    setActiveSubTab('editor');
    if (showToast) showToast(`Cotización ${cotiz.folio} cargada en el editor`, 'success');
  };

  // Eliminar cotización del historial
  const handleEliminarCotizacion = async (id, folio) => {
    if (!window.confirm(`¿Estás seguro de eliminar el presupuesto ${folio}?`)) return;
    const filtrado = historialCotizaciones.filter(c => c.id !== id);
    setHistorialCotizaciones(filtrado);
    try {
      localStorage.setItem('ballard_presupuestos_v1', JSON.stringify(filtrado));
    } catch (e) {}

    if (supabase) {
      try {
        await supabase.from('presupuestos').delete().eq('id', id);
      } catch (e) {
        console.warn('Error al eliminar en Supabase:', e);
      }
    }

    if (showToast) showToast(`Presupuesto ${folio} eliminado`, 'success');
  };

  // Detectar si es dispositivo móvil o tablet
  const detectarEsMovil = () => {
    return /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent || '') ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  };

  // Descargar archivo en PC o móvil
  const guardarArchivoLocal = (blob, filename) => {
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      if (document.body.contains(link)) {
        document.body.removeChild(link);
      }
      URL.revokeObjectURL(blobUrl);
    }, 1000);
  };

  // Ejecutar compartir nativo desde un toque directo en el modal
  const ejecutarCompartirDirecto = async (modalData) => {
    const target = modalData || readyShareModal;
    if (!target) return;

    if (navigator.share) {
      try {
        if (!navigator.canShare || navigator.canShare({ files: [target.file] })) {
          await navigator.share({
            files: [target.file],
            title: target.title,
            text: target.text
          });
          setReadyShareModal(null);
          if (showToast) showToast('¡Compartido con éxito!', 'success');
          return;
        }
      } catch (error) {
        if (error.name === 'AbortError') return;
        console.error('Error al compartir presupuesto:', error);
      }
    }

    guardarArchivoLocal(target.blob, target.filename);
    setReadyShareModal(null);
    if (showToast) showToast('Archivo descargado en tu dispositivo', 'success');
  };

  // Enviar o compartir presupuesto por WhatsApp (PDF Natural Vectorial o Imagen PNG)
  const handleCompartirPresupuestoWhatsApp = async (formato = 'PDF', cotizParam = null) => {
    const cotizActual = cotizParam || cotizacion;
    const idiomaActual = cotizActual.idiomaGuardado || idioma;

    if (showToast) showToast('Generando PDF Natural completo para WhatsApp...', 'info');

    try {
      const esVentaDoc = cotizActual.tipoDocumento === 'VENTA' || cotizActual.estado === 'VENTA';
      const nombreLimpio = (cotizActual.nombreCliente || 'Cliente').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const prefijoDoc = esVentaDoc ? 'Ticket_Venta' : 'Presupuesto';
      const numFolio = cotizActual.numeroTicket || cotizActual.folio;
      const baseFilename = `${prefijoDoc}_${numFolio}_${nombreLimpio}`;
      const textoCompartir = `${esVentaDoc ? 'Ticket de Venta' : 'Presupuesto de Transporte'} ${numFolio} - ${cotizActual.nombreCliente || 'Ballard Tour Services'}`;

      if (formato === 'PDF') {
        // PDF 100% Nativo Vectorial completo sin recortes
        const pdfBlob = await pdf(
          <PresupuestoPDFDocument
            cotizacion={cotizActual}
            idioma={idiomaActual}
            formatearMetodoPago={formatearMetodoPago}
          />
        ).toBlob();
        const filename = `${baseFilename}.pdf`;
        const file = new File([pdfBlob], filename, { type: 'application/pdf' });

        if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
          try {
            await navigator.share({
              files: [file],
              title: `${prefijoDoc} ${numFolio}`,
              text: textoCompartir
            });
            if (showToast) showToast('¡PDF compartido con éxito!', 'success');
            return;
          } catch (error) {
            if (error.name === 'AbortError') return;
          }
        }

        if (detectarEsMovil()) {
          setReadyShareModal({
            file,
            blob: pdfBlob,
            filename,
            title: `${prefijoDoc} ${numFolio}`,
            text: textoCompartir,
            previewUrl: null,
            tipo: `${esVentaDoc ? 'Ticket' : 'Presupuesto'} Completo (PDF Natural)`
          });
        } else {
          guardarArchivoLocal(pdfBlob, filename);
          if (showToast) showToast('¡PDF Natural descargado con éxito!', 'success');
        }
      } else {
        const elemento = ticketRef.current;
        if (!elemento || !window.html2canvas) {
          if (showToast) showToast('Preparando imagen, intenta en un segundo...', 'error');
          return;
        }
        const canvas = await window.html2canvas(elemento, {
          scale: 2,
          useCORS: true,
          backgroundColor: '#ffffff',
          windowWidth: 900,
          scrollY: 0
        });
        const previewUrl = canvas.toDataURL('image/png');

        canvas.toBlob(async (blob) => {
          if (!blob) {
            if (showToast) showToast('Error al generar imagen del presupuesto', 'error');
            return;
          }
          const filename = `${baseFilename}.png`;
          const file = new File([blob], filename, { type: 'image/png' });

          if (navigator.share && (!navigator.canShare || navigator.canShare({ files: [file] }))) {
            try {
              await navigator.share({
                files: [file],
                title: `${prefijoDoc} ${numFolio}`,
                text: textoCompartir
              });
              if (showToast) showToast('¡Presupuesto compartido con éxito!', 'success');
              return;
            } catch (error) {
              if (error.name === 'AbortError') return;
            }
          }

          setReadyShareModal({
            file,
            blob,
            filename,
            title: `${prefijoDoc} ${numFolio}`,
            text: textoCompartir,
            previewUrl,
            tipo: `${esVentaDoc ? 'Ticket' : 'Presupuesto'} (Imagen)`
          });
        }, 'image/png');
      }
    } catch (err) {
      console.error('Error al preparar presupuesto para WhatsApp:', err);
      if (showToast) showToast('Error al preparar el presupuesto', 'error');
    }
  };

  // Exportar a PDF Nativo Vectorial (100% texto seleccionable, sin cortes y con toda la información completa)
  const handleExportarPDFNativo = async (cotizParam = null) => {
    const cotizActual = cotizParam || cotizacion;
    const idiomaActual = cotizActual.idiomaGuardado || idioma;

    // Si está desde el teléfono, compartimos el PDF Natural directamente por WhatsApp
    if (detectarEsMovil()) {
      handleCompartirPresupuestoWhatsApp('PDF', cotizActual);
      return;
    }

    try {
      if (showToast) showToast('Generando PDF Natural completo...', 'info');
      const esVentaDoc = cotizActual.tipoDocumento === 'VENTA' || cotizActual.estado === 'VENTA';
      const nombreLimpio = (cotizActual.nombreCliente || 'Cliente').trim().replace(/[^a-zA-Z0-9]/g, '_');
      const prefijoDoc = esVentaDoc ? 'Ticket_Venta' : 'Presupuesto';
      const numFolio = cotizActual.numeroTicket || cotizActual.folio;
      const filename = `${prefijoDoc}_${numFolio}_${nombreLimpio}.pdf`;

      const pdfBlob = await pdf(
        <PresupuestoPDFDocument
          cotizacion={cotizActual}
          idioma={idiomaActual}
          formatearMetodoPago={formatearMetodoPago}
        />
      ).toBlob();

      guardarArchivoLocal(pdfBlob, filename);
      if (showToast) showToast('¡PDF Natural descargado con éxito!', 'success');
    } catch (err) {
      console.error('Error al generar PDF Nativo:', err);
      if (showToast) showToast('Error al generar el PDF', 'error');
    }
  };

  const handleDescargarPDF = () => {
    handleExportarPDFNativo();
  };

  const handleImprimirNativo = () => {
    handleExportarPDFNativo();
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

      const horaPickUpCalculada = etapa.horaRecogida || (etapa.tipo === 'salida' ? (c.horaCheckout || etapa.hora || '') : (etapa.hora || ''));
      const horaServicioCalculada = etapa.hora || etapa.horaRecogida || '';
      const comentarioRegreso = etapa.horaRegreso ? `Regreso: ${etapa.horaRegreso}` : '';

      return {
        idLocal: `conv-${idx}-${Date.now()}`,
        etapaId: etapa.id,
        nombreEtapa: etapa.etiquetaES || `Tramo ${idx + 1}`,
        reserva: c.numeroTicket || c.folio,
        nombre: nombre,
        apellido: apellido,
        agencia: 'Directo',
        tipoServicio: tipoServicio,
        pax: etapa.pax?.toString() || c.pax?.toString() || '2',
        vehiculo: c.tipoVehiculo === 'VAN' ? 'VAN' : 'SUV',
        telefono: '',
        fecha: etapa.fecha || (idx === 0 ? c.fechaEmision : ''),
        hora: horaServicioCalculada,
        vuelo: etapa.tipo === 'llegada' ? (c.aerolineaVuelo || '') : '',
        pickUp: horaPickUpCalculada,
        hotel: hotelTramo,
        cobro: etapa.precio || (idx === 0 && c.precioTotal ? c.precioTotal : ''),
        metodoPago: c.metodoPago || 'Efectivo',
        tipoViaje: 'One way',
        comentario: comentarioRegreso
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
  const handleCambioServicioConversion = (idx, field, rawValue) => {
    const camposNoMayusculas = ['fecha', 'hora', 'pickUp'];
    const value = typeof rawValue === 'string' && !camposNoMayusculas.includes(field) ? rawValue.toUpperCase() : rawValue;
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
        comentario: s.comentario || '',
        chofer: '',
        vehiculo: s.vehiculo || (cotizacionAConvertir.tipoVehiculo === 'VAN' ? 'VAN' : 'SUV'),
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
    const esItemVenta = c.tipoDocumento === 'VENTA' || c.estado === 'VENTA' || c.folio?.startsWith('TCK-');
    if (filtroTipoHistorial === 'VENTAS' && !esItemVenta) return false;
    if (filtroTipoHistorial === 'COTIZACIONES' && esItemVenta) return false;

    if (!filtroHistorial.trim()) return true;
    const q = filtroHistorial.toLowerCase();
    return (
      (c.nombreCliente || '').toLowerCase().includes(q) ||
      (c.folio || '').toLowerCase().includes(q) ||
      (c.numeroTicket || '').toLowerCase().includes(q) ||
      (c.hotelPrincipal || '').toLowerCase().includes(q)
    );
  });

  // Traducción y formateo del método de pago según el idioma
  const formatearMetodoPago = (metodo, lang) => {
    if (!metodo) return lang === 'EN' ? '[Pending / Cash]' : '[Pendiente / Efectivo]';
    if (lang === 'EN') {
      const lower = metodo.toString().trim().toLowerCase();
      if ((lower.includes('transferencia') || lower.includes('wire')) && lower.includes('paypal')) {
        return 'Wire Transfer / PayPal';
      }
      if (lower.includes('transferencia') || lower.includes('wire transfer')) {
        return 'Wire Transfer';
      }
      if (lower.includes('pendiente') || lower === 'pending / cash') {
        return 'Pending / Cash';
      }
      if (lower.includes('chófer') || lower.includes('chofer') || lower.includes('chauffeur') || lower.includes('driver')) {
        return 'Cash to Chauffeur';
      }
      if (lower.includes('tarjeta') || lower.includes('stripe') || lower.includes('card')) {
        return 'Credit Card / Stripe';
      }
      if (lower.includes('prepago') || lower.includes('prepaid')) {
        return 'Prepaid';
      }
      if (lower === 'efectivo' || lower === 'cash') {
        return 'Cash';
      }
      if (lower === 'paypal') {
        return 'PayPal';
      }
      return metodo;
    }
    // Si idioma es ES:
    const lower = metodo.toString().trim().toLowerCase();
    if (lower === 'wire transfer') return 'Transferencia';
    if (lower === 'wire transfer / paypal') return 'Transferencia / PayPal';
    if (lower === 'pending / cash') return 'Pendiente / Efectivo';
    if (lower.includes('cash to')) return 'Efectivo Chófer';
    if (lower.includes('credit card')) return 'Tarjeta / Stripe';
    if (lower === 'prepaid') return 'Prepago';
    return metodo;
  };

  const esVenta = cotizacion.tipoDocumento === 'VENTA' || cotizacion.estado === 'VENTA';

  // Textos y etiquetas según el idioma seleccionado
  const t = {
    tituloPrincipal: esVenta
      ? (idioma === 'EN' ? 'OFFICIAL SALES TICKET' : 'TICKET DE VENTA - TRANSPORTE')
      : (idioma === 'EN' ? 'TRANSPORTATION QUOTE' : 'PRESUPUESTO DE TRANSPORTE'),
    subtituloSeguro: esVenta
      ? (idioma === 'EN' 
          ? `✔ Confirmed Private Transportation (${cotizacion.tipoVehiculo || 'SUV'}) / Official Ticket` 
          : `✔ Transporte Privado Confirmado (${cotizacion.tipoVehiculo || 'SUV'}) / Boleto Oficial`)
      : (idioma === 'EN' 
          ? `✔ Private Transportation (${cotizacion.tipoVehiculo || 'SUV'}) / Safe Ticket` 
          : `✔ Transporte Privado (${cotizacion.tipoVehiculo || 'SUV'}) / Boleto Seguro`),
    badgeEstado: esVenta
      ? (idioma === 'EN' ? 'SALE CONFIRMED' : 'VENTA CONFIRMADA')
      : (idioma === 'EN' 
          ? (cotizacion.estado === 'CONVERTIDO' ? 'RESERVED' : (cotizacion.estado === 'APROBADO' ? 'CONFIRMED' : 'IN REVIEW'))
          : cotizacion.estado),
    folioLabel: esVenta
      ? (idioma === 'EN' ? 'SALES TICKET #:' : 'N° TICKET:')
      : (idioma === 'EN' ? 'FOLIO:' : 'FOLIO:'),
    fechaLabel: idioma === 'EN' ? 'DATE:' : 'FECHA:',
    nombreClienteLabel: idioma === 'EN' ? 'PASSENGER / CLIENT NAME' : 'NOMBRE DEL PASAJERO / CLIENTE',
    paxLabel: idioma === 'EN' ? 'PASSENGERS (PAX)' : 'PASAJEROS (PAX)',
    vehiculoLabel: idioma === 'EN' ? 'VEHICLE TYPE' : 'TIPO DE VEHÍCULO',
    vueloLabel: idioma === 'EN' ? 'AIRLINE & FLIGHT' : 'AEROLÍNEA Y VUELO',
    hotelLabel: idioma === 'EN' ? 'HOTEL / MAIN LODGING' : 'HOTEL / ALOJAMIENTO PRINCIPAL',
    metodoPagoLabel: idioma === 'EN' ? 'PAYMENT METHOD' : 'MÉTODO DE PAGO',
    horaCheckoutLabel: idioma === 'EN' ? 'RETURN TIME (CHECK-OUT)' : 'HORA DE REGRESO (CHECK-OUT)',
    itinerarioTitulo: idioma === 'EN' ? 'Requested Itinerary and Destinations' : 'Itinerario y Destinos Solicitados',
    colEtapa: idioma === 'EN' ? 'STAGE' : 'ETAPA',
    colDescripcion: idioma === 'EN' ? 'ROUTE / DESTINATION DESCRIPTION' : 'DESCRIPCIÓN DEL TRAYECTO / DESTINO',
    colPax: idioma === 'EN' ? 'PAX' : 'PAX',
    colFechaHora: idioma === 'EN' ? 'DATE AND TIME' : 'FECHA Y HORA',
    recogidaLabel: idioma === 'EN' ? 'Pick-up:' : 'Recogida:',
    regresoLabel: idioma === 'EN' ? 'Return:' : 'Regreso:',
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
                      onChange={(e) => setSearchReservaQuery(e.target.value.toUpperCase())}
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
                <span>{esVenta ? 'Datos del Cliente y Venta' : 'Datos del Cliente y Cotización'}</span>
                <div className="flex items-center gap-1.5">
                  {esVenta ? (
                    <span className="text-xs font-mono font-black text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Receipt size={12} className="text-emerald-600" />
                      Ticket: {cotizacion.numeroTicket || cotizacion.folio}
                    </span>
                  ) : (
                    <span className="text-xs font-mono text-slate-500 font-normal">Folio: {cotizacion.folio}</span>
                  )}
                </div>
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

                {/* TIPO DE CARRO / VEHÍCULO (SUV o VAN) */}
                <div className="col-span-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-700 uppercase flex items-center gap-1.5">
                      <Car size={15} className="text-amber-500" />
                      {idioma === 'EN' ? 'Vehicle Type (Car) *' : 'Tipo de Carro / Vehículo *'}
                    </label>
                    <span className="text-[10px] font-semibold text-slate-500">
                      {cotizacion.tipoVehiculo === 'VAN' ? '🚐 VAN (Hiace / hasta 10-14 pax)' : '🚙 SUV (Expedition / hasta 5-6 pax)'}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => handleCotizacionChange('tipoVehiculo', 'SUV')}
                      className={`py-2 px-3 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                        (cotizacion.tipoVehiculo || 'SUV') === 'SUV'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-base">🚙</span>
                      <div className="text-left">
                        <div className="leading-tight font-black">SUV</div>
                        <div className="text-[10px] font-normal opacity-75">Expedition / Suburban</div>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleCotizacionChange('tipoVehiculo', 'VAN')}
                      className={`py-2 px-3 rounded-lg font-black text-xs sm:text-sm flex items-center justify-center gap-2 border-2 transition-all ${
                        cotizacion.tipoVehiculo === 'VAN'
                          ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm'
                          : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      <span className="text-base">🚐</span>
                      <div className="text-left">
                        <div className="leading-tight font-black">VAN</div>
                        <div className="text-[10px] font-normal opacity-75">Toyota Hiace / Van</div>
                      </div>
                    </button>
                  </div>
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
                  <label className="text-xs font-bold text-slate-600 uppercase mb-1 block">
                    {idioma === 'EN' ? 'Payment Method' : 'Método de Pago'}
                  </label>
                  <select
                    value={cotizacion.metodoPago}
                    onChange={(e) => handleCotizacionChange('metodoPago', e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white font-medium text-slate-800"
                  >
                    <option value="Pendiente / Efectivo">{idioma === 'EN' ? 'Pending / Cash' : 'Pendiente / Efectivo'}</option>
                    <option value="Pago en Efectivo Pendiente (Pasar a Oficina)">{idioma === 'EN' ? 'Pending Cash (Pay at Office)' : 'Pago en Efectivo Pendiente (Pasar a Oficina)'}</option>
                    <option value="Efectivo Chófer">{idioma === 'EN' ? 'Cash to Chauffeur' : 'Efectivo Chófer'}</option>
                    <option value="Tarjeta / Stripe">{idioma === 'EN' ? 'Credit Card / Stripe' : 'Tarjeta / Stripe'}</option>
                    <option value="Transferencia">{idioma === 'EN' ? 'Wire Transfer' : 'Transferencia'}</option>
                    <option value="Transferencia / PayPal">{idioma === 'EN' ? 'Wire Transfer / PayPal' : 'Transferencia / PayPal'}</option>
                    <option value="Prepago">{idioma === 'EN' ? 'Prepaid' : 'Prepago'}</option>
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

                {/* SECCIÓN TOTAL DEL PRESUPUESTO Y TIPO DE CAMBIO */}
                <div className="col-span-2 bg-gradient-to-br from-amber-50/80 via-white to-amber-100/40 border border-amber-300/80 rounded-xl p-3.5 shadow-xs space-y-3">
                  {/* Fila superior: Título y Selector de Moneda */}
                  <div className="flex items-center justify-between gap-2">
                    <label className="text-xs font-black text-slate-800 uppercase flex items-center gap-1.5 tracking-wide">
                      <DollarSign size={15} className="text-amber-600" />
                      {idioma === 'EN' ? 'Total Quote & Currency' : 'Total del Presupuesto y Moneda'}
                    </label>

                    <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-300">
                      <button
                        type="button"
                        onClick={() => handleCotizacionChange('moneda', 'USD')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          (cotizacion.moneda || 'USD') === 'USD'
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Cotizar en Dólares Americanos"
                      >
                        USD ($)
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCotizacionChange('moneda', 'MXN')}
                        className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all ${
                          cotizacion.moneda === 'MXN'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-500 hover:text-slate-800'
                        }`}
                        title="Cotizar en Pesos Mexicanos"
                      >
                        MXN ($)
                      </button>
                    </div>
                  </div>

                  {/* Inputs: Monto y Tipo de Cambio */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Campo de Monto */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 uppercase mb-1 block">
                        {cotizacion.moneda === 'MXN' 
                          ? (idioma === 'EN' ? 'Total Quote (MXN) *' : 'Total en Pesos (MXN) *')
                          : (idioma === 'EN' ? 'Total Quote (USD) *' : 'Total en Dólares (USD) *')
                        }
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-slate-500 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={cotizacion.precioTotal}
                          onChange={(e) => handleCotizacionChange('precioTotal', e.target.value)}
                          placeholder="0.00"
                          className="w-full pl-8 pr-14 py-2 text-base font-black border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none bg-white text-slate-900 shadow-inner"
                        />
                        <span className={`absolute right-2.5 top-2.5 text-[11px] font-black px-1.5 py-0.5 rounded ${
                          cotizacion.moneda === 'MXN' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {cotizacion.moneda || 'USD'}
                        </span>
                      </div>
                    </div>

                    {/* Campo de Tipo de Cambio */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-[11px] font-bold text-slate-700 uppercase block">
                          {idioma === 'EN' ? 'Exchange Rate (USD ➔ MXN)' : 'Tipo de Cambio (USD ➔ MXN)'}
                        </label>
                      </div>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-emerald-600 font-bold">$</span>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={cotizacion.tipoCambio || ''}
                          onChange={(e) => handleTipoCambioChange(e.target.value)}
                          placeholder="Ej. 20.00"
                          className="w-full pl-8 pr-16 py-2 text-base font-black border border-emerald-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white text-emerald-800 shadow-inner"
                          title="Ingresa o modifica el tipo de cambio del Dólar a Pesos MXN"
                        />
                        <span className="absolute right-2.5 top-2.5 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded">
                          MXN/USD
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tarjeta de Conversión en Tiempo Real y Opciones */}
                  {(() => {
                    const isUSD = (cotizacion.moneda || 'USD') === 'USD';
                    const total = parseFloat(cotizacion.precioTotal) || 0;
                    const tc = parseFloat(cotizacion.tipoCambio) || 0;
                    const converted = tc > 0 ? (isUSD ? total * tc : total / tc) : 0;

                    return (
                      <div className="bg-white/95 border border-amber-200/90 rounded-lg p-2.5 space-y-2">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div>
                            <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              {isUSD 
                                ? (idioma === 'EN' ? 'Equivalent in Mexican Pesos (MXN):' : 'Equivalente en Pesos Mexicanos (MXN):')
                                : (idioma === 'EN' ? 'Equivalent in US Dollars (USD):' : 'Equivalente en Dólares (USD):')
                              }
                            </div>
                            <div className="text-base font-black text-slate-900 mt-0.5 flex items-baseline gap-2">
                              {tc > 0 ? (
                                <>
                                  <span className={isUSD ? 'text-emerald-700' : 'text-blue-700'}>
                                    ${converted.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {isUSD ? 'MXN' : 'USD'}
                                  </span>
                                  <span className="text-[11px] font-semibold text-slate-500">
                                    ({isUSD ? `x $${tc.toFixed(2)} MXN` : `÷ $${tc.toFixed(2)} MXN`})
                                  </span>
                                </>
                              ) : (
                                <span className="text-xs text-amber-600 italic font-semibold">
                                  {idioma === 'EN' ? 'Enter exchange rate to calculate' : 'Ingresa el tipo de cambio para calcular'}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Botón rápido para convertir/intercambiar */}
                          {tc > 0 && total > 0 && (
                            <button
                              type="button"
                              onClick={() => {
                                if (isUSD) {
                                  // Cambiar a MXN con el valor convertido
                                  handleCotizacionChange('moneda', 'MXN');
                                  handleCotizacionChange('precioTotal', (total * tc).toFixed(2));
                                  if (showToast) showToast('Cambiado a Pesos (MXN)', 'info');
                                } else {
                                  // Cambiar a USD con el valor convertido
                                  handleCotizacionChange('moneda', 'USD');
                                  handleCotizacionChange('precioTotal', (total / tc).toFixed(2));
                                  if (showToast) showToast('Cambiado a Dólares (USD)', 'info');
                                }
                              }}
                              className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md text-[11px] font-bold flex items-center gap-1 border border-slate-200 transition-colors shrink-0"
                              title="Cambiar la moneda principal con este valor calculado"
                            >
                              ⇄ {isUSD ? 'Fijar en MXN' : 'Fijar en USD'}
                            </button>
                          )}
                        </div>

                        {/* Checkbox para mostrar/ocultar en el boleto */}
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                          <label className="flex items-center gap-2 text-[11px] font-semibold text-slate-600 cursor-pointer select-none hover:text-slate-900">
                            <input
                              type="checkbox"
                              checked={cotizacion.mostrarEquivalenteMXN !== false}
                              onChange={(e) => handleCotizacionChange('mostrarEquivalenteMXN', e.target.checked)}
                              className="w-3.5 h-3.5 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                            />
                            <span>
                              {idioma === 'EN' 
                                ? 'Show currency conversion & exchange rate on ticket/PDF' 
                                : 'Mostrar desglose con Tipo de Cambio en el boleto / PDF'
                              }
                            </span>
                          </label>
                        </div>
                      </div>
                    );
                  })()}
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

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                      {/* ORIGEN */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          {idioma === 'EN' ? 'Origin' : 'Origen'}
                        </label>
                        <input
                          type="text"
                          list="lista-hoteles-cotizacion"
                          value={etapa.origen}
                          onChange={(e) => handleEtapaChange(etapa.id, 'origen', e.target.value)}
                          placeholder={idioma === 'EN' ? 'Origin place' : 'Lugar origen'}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>

                      {/* DESTINO */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">
                          {idioma === 'EN' ? 'Destination' : 'Destino'}
                        </label>
                        <input
                          type="text"
                          list="lista-hoteles-cotizacion"
                          value={etapa.destino}
                          onChange={(e) => handleEtapaChange(etapa.id, 'destino', e.target.value)}
                          placeholder={idioma === 'EN' ? 'Destination place' : 'Lugar destino'}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>

                      {/* FECHA Y PASAJEROS (PAX) */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Calendar size={11} className="text-amber-500" /> {idioma === 'EN' ? 'Date' : 'Fecha'}
                        </label>
                        <input
                          type="date"
                          value={etapa.fecha}
                          onChange={(e) => handleEtapaChange(etapa.id, 'fecha', e.target.value)}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 text-xs"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Users size={11} className="text-amber-500" /> {idioma === 'EN' ? 'Passengers (PAX)' : 'Pasajeros (PAX)'}
                        </label>
                        <input
                          type="number"
                          min="1"
                          value={etapa.pax ?? cotizacion.pax ?? '2'}
                          onChange={(e) => handleEtapaChange(etapa.id, 'pax', e.target.value)}
                          placeholder="PAX"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 text-xs font-bold text-slate-800"
                        />
                      </div>

                      {/* HORA DE RECOGIDA Y HORA DE REGRESO */}
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Clock size={11} className="text-blue-500" /> {idioma === 'EN' ? 'Pick-up Time' : 'Hora de Recogida'}
                        </label>
                        <input
                          type="time"
                          value={etapa.horaRecogida || etapa.hora || ''}
                          onChange={(e) => {
                            handleEtapaChange(etapa.id, 'horaRecogida', e.target.value);
                            handleEtapaChange(etapa.id, 'hora', e.target.value);
                          }}
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 text-xs font-semibold"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                          <Clock size={11} className="text-amber-600" /> {idioma === 'EN' ? 'Return Time' : 'Hora de Regreso'}
                        </label>
                        <input
                          type="time"
                          value={etapa.horaRegreso || ''}
                          onChange={(e) => handleEtapaChange(etapa.id, 'horaRegreso', e.target.value)}
                          placeholder="HH:MM"
                          className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-amber-500 text-xs font-semibold"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* BOTONES DE ACCIÓN PRINCIPALES */}
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-2.5">
              {/* BOTÓN PRINCIPAL PARA REALIZAR VENTA CON TICKET CONSECUTIVO */}
              {!esVenta ? (
                <button
                  type="button"
                  onClick={handleRealizarVenta}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-black py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all text-sm group"
                  title="Convierte esta cotización en una venta oficial asignándole el siguiente número de ticket consecutivo"
                >
                  <Receipt size={18} className="text-amber-300 group-hover:scale-110 transition-transform" />
                  <span>💳 Realizar Venta / Generar Ticket ({proximoTicket})</span>
                </button>
              ) : (
                <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle size={18} className="text-emerald-600 shrink-0" />
                    <div>
                      <div className="text-xs font-black text-emerald-950">
                        VENTA REALIZADA • TICKET #{cotizacion.numeroTicket || cotizacion.folio}
                      </div>
                      <div className="text-[11px] text-emerald-700 font-medium">
                        Boleto Oficial de Venta consecutivo activo.
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRevertirACotizacion}
                    className="text-[11px] font-bold text-slate-500 hover:text-slate-800 underline px-2 py-1"
                    title="Volver al modo de cotización preliminar"
                  >
                    Revertir a Cotización
                  </button>
                </div>
              )}

              <button
                onClick={handleGuardarCotizacion}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors text-sm"
              >
                <CheckCircle size={18} className="text-amber-400" />
                {esVenta ? 'Guardar Ticket de Venta en Historial' : 'Guardar Presupuesto en Historial'}
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

              <div className="flex flex-wrap items-center gap-2">

                {/* BOTÓN ENVIAR POR WHATSAPP (PDF NATURAL COMPLETO) */}
                <button
                  onClick={() => handleCompartirPresupuestoWhatsApp('PDF')}
                  className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  title="Enviar presupuesto como PDF Natural completo por WhatsApp"
                >
                  <Send size={14} />
                  Enviar PDF por WhatsApp
                </button>

                {/* BOTÓN ENVIAR IMAGEN */}
                <button
                  onClick={() => handleCompartirPresupuestoWhatsApp('PNG')}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 shadow-sm transition-colors"
                  title="Enviar presupuesto como imagen por WhatsApp"
                >
                  <FileText size={14} />
                  Enviar Imagen
                </button>

                {/* BOTÓN COPIAR AL PORTAPAPELES */}
                <button
                  onClick={handleCopiarPortapapeles}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-3 rounded-xl text-xs flex items-center gap-1.5 border border-slate-300 transition-colors"
                  title="Copiar para pegar en Word, Excel o Correo"
                >
                  {copiado ? <Check size={14} className="text-emerald-600" /> : <Copy size={14} />}
                  {copiado ? '¡Copiado!' : 'Copiar (Word)'}
                </button>

                {/* BOTÓN GUARDAR PDF NATIVO */}
                <button
                  onClick={() => handleExportarPDFNativo()}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-2 shadow-sm transition-colors"
                  title="Guardar como PDF Nativo vectorial, texto seleccionable y completo sin cortes"
                >
                  <Download size={15} />
                  Guardar en PDF Nativo
                </button>
              </div>
            </div>

            {/* CONTENEDOR DEL TICKET (Diseño Sobrio, Formal y Recto) */}
            <div className="w-full flex justify-center overflow-x-auto pb-6">
              <div
                id="area-impresion-presupuesto"
                ref={ticketRef}
                style={{
                  fontFamily: "'Segoe UI', Arial, sans-serif",
                  width: '100%',
                  maxWidth: '800px',
                  backgroundColor: '#ffffff',
                  border: '1px solid #94a3b8',
                  borderRadius: '0px',
                  overflow: 'hidden'
                }}
              >
                {/* ENCABEZADO SOBRIO */}
                <table style={{ backgroundColor: '#f8fafc', color: '#0f172a', width: '100%', borderCollapse: 'collapse', borderBottom: '2px solid #0f172a' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '20px 24px', width: '60%', verticalAlign: 'top', border: 'none' }}>
                        <h1 style={{ margin: 0, color: '#0f172a', fontSize: '24px', fontWeight: 900, letterSpacing: '0.5px' }}>BALLARD TOUR SERVICES</h1>
                        <h2 style={{ margin: '8px 0 2px 0', fontSize: '16px', color: '#0f172a', fontWeight: 700 }}>{t.tituloPrincipal}</h2>
                        <p style={{ margin: 0, fontSize: '11.5px', color: '#475569' }}>{t.subtituloSeguro}</p>
                      </td>
                      <td style={{ padding: '20px 24px', textAlign: 'right', width: '40%', verticalAlign: 'top', border: 'none' }}>
                        <div style={{ 
                          backgroundColor: '#ffffff', 
                          color: '#0f172a', 
                          border: '1px solid #0f172a',
                          fontWeight: 'bold', 
                          padding: '4px 12px', 
                          borderRadius: '0px', 
                          display: 'inline-block', 
                          fontSize: '11.5px', 
                          marginBottom: '8px',
                          letterSpacing: '0.5px'
                        }}>
                          {t.badgeEstado}
                        </div>
                        <p style={{ margin: 0, fontSize: '13px', color: '#0f172a', fontFamily: 'monospace', fontWeight: 'bold' }}>
                          {t.folioLabel} {cotizacion.numeroTicket || cotizacion.folio}
                        </p>
                        <p style={{ margin: '3px 0 0 0', fontSize: '11.5px', color: '#475569' }}>
                          {t.fechaLabel} {cotizacion.fechaEmision || new Date().toISOString().split('T')[0]}
                        </p>
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* CUERPO DEL TICKET */}
                <div style={{ padding: '20px 24px' }}>
                  {/* DATOS DEL CLIENTE, VEHÍCULO Y VUELO EN TABLA CON BORDES */}
                  <table style={{ width: '100%', marginBottom: '18px', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                    <tbody>
                      <tr>
                        <td style={{ width: '36%', padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.nombreClienteLabel}
                          </div>
                          <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                            {cotizacion.nombreCliente || (idioma === 'EN' ? '[Client Name]' : '[Nombre del Cliente]')}
                          </div>
                        </td>
                        <td style={{ width: '14%', padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.paxLabel}
                          </div>
                          <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                            {cotizacion.pax || '1'}
                          </div>
                        </td>
                        <td style={{ width: '20%', padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.vehiculoLabel}
                          </div>
                          <div style={{ fontSize: '15px', color: '#0f172a', fontWeight: 'bold' }}>
                            {cotizacion.tipoVehiculo === 'VAN' ? 'VAN' : 'SUV'}
                          </div>
                        </td>
                        <td style={{ width: '30%', padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.vueloLabel}
                          </div>
                          <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 'bold', textTransform: 'uppercase' }}>
                            {cotizacion.aerolineaVuelo || (idioma === 'EN' ? '[Airline & Flight]' : '[Aerolínea y Vuelo]')}
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td style={{ padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.hotelLabel}
                          </div>
                          <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>
                            {cotizacion.hotelPrincipal || (idioma === 'EN' ? '[Hotel or Villa Name]' : '[Nombre del Hotel o Villa]')}
                          </div>
                        </td>
                        <td colSpan="2" style={{ padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.metodoPagoLabel}
                          </div>
                          <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>
                            {formatearMetodoPago(cotizacion.metodoPago, idioma)}
                          </div>
                        </td>
                        <td style={{ padding: '8px 12px', verticalAlign: 'top', border: '1px solid #cbd5e1' }}>
                          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 'bold', textTransform: 'uppercase', marginBottom: '2px' }}>
                            {t.horaCheckoutLabel}
                          </div>
                          <div style={{ fontSize: '14px', color: '#0f172a', fontWeight: 'bold' }}>
                            {cotizacion.horaCheckout ? `${cotizacion.horaCheckout} HRS` : '[HH:MM HRS]'}
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>

                  {/* ITINERARIO / OPCIONES DE DESTINO */}
                  <h3 style={{ color: '#0f172a', marginTop: 0, marginBottom: '10px', fontSize: '14px', borderBottom: '1.5px solid #0f172a', paddingBottom: '4px', textTransform: 'uppercase', fontWeight: 700 }}>
                    {t.itinerarioTitulo}
                  </h3>

                  <table style={{ width: '100%', marginBottom: '18px', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f1f5f9' }}>
                        <th style={{ width: '20%', padding: '8px 10px', borderBottom: '1px solid #94a3b8', textAlign: 'left', fontSize: '10.5px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colEtapa}
                        </th>
                        <th style={{ width: '40%', padding: '8px 10px', borderBottom: '1px solid #94a3b8', textAlign: 'left', fontSize: '10.5px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colDescripcion}
                        </th>
                        <th style={{ width: '10%', padding: '8px 10px', borderBottom: '1px solid #94a3b8', textAlign: 'center', fontSize: '10.5px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colPax}
                        </th>
                        <th style={{ width: '30%', padding: '8px 10px', borderBottom: '1px solid #94a3b8', textAlign: 'left', fontSize: '10.5px', color: '#1e293b', fontWeight: 'bold', textTransform: 'uppercase' }}>
                          {t.colFechaHora}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {cotizacion.etapas.map((etapa, idx) => {
                        const traducirLugar = (txt) => {
                          if (!txt) return '';
                          return idioma === 'EN' ? String(txt).replace(/Aeropuerto SJD/gi, 'SJD Airport') : String(txt);
                        };
                        let descripcionTrayecto = '';
                        if (etapa.origen && etapa.destino) {
                          descripcionTrayecto = `${traducirLugar(etapa.origen)} → ${traducirLugar(etapa.destino)}`;
                        } else if (etapa.tipo === 'llegada') {
                          descripcionTrayecto = `${idioma === 'EN' ? 'SJD Airport' : 'Aeropuerto SJD'} → ${traducirLugar(etapa.destino || cotizacion.hotelPrincipal) || (idioma === 'EN' ? '[Destination Hotel]' : '[Hotel Destino]')}`;
                        } else if (etapa.tipo === 'salida') {
                          descripcionTrayecto = `${traducirLugar(etapa.origen || cotizacion.hotelPrincipal) || (idioma === 'EN' ? '[Destination Hotel]' : '[Hotel Destino]')} → ${idioma === 'EN' ? 'SJD Airport' : 'Aeropuerto SJD'}`;
                        } else {
                          descripcionTrayecto = etapa.destino
                            ? (idioma === 'EN' ? `To ${traducirLugar(etapa.destino)}` : `Hacia ${etapa.destino}`)
                            : (idioma === 'EN' ? '[Origin → Destination]' : '[Lugar Origen → Lugar Destino]');
                        }

                        const fechaFormateada = etapa.fecha || (idioma === 'EN' ? '[YYYY-MM-DD]' : '[DD-MMM-AAAA]');
                        const paxTramo = etapa.pax || cotizacion.pax || '1';
                        const horaPickUp = etapa.horaRecogida || etapa.hora;
                        const horaReturn = etapa.horaRegreso;

                        return (
                          <tr key={etapa.id} style={{ backgroundColor: idx % 2 === 0 ? '#ffffff' : '#f8fafc' }}>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top' }}>
                              <strong style={{ color: '#0f172a', fontSize: '13px' }}>
                                {idioma === 'EN' ? etapa.etiquetaEN : etapa.etiquetaES}
                              </strong>
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', fontSize: '13px', verticalAlign: 'top', color: '#1e293b' }}>
                              {descripcionTrayecto}
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', textAlign: 'center', verticalAlign: 'top', fontWeight: 'bold', fontSize: '13px', color: '#0f172a' }}>
                              {paxTramo}
                            </td>
                            <td style={{ padding: '10px', borderBottom: '1px solid #e2e8f0', verticalAlign: 'top', color: '#0f172a' }}>
                              <div style={{ fontWeight: 'bold', fontSize: '12.5px', marginBottom: '2px' }}>
                                {fechaFormateada}
                              </div>
                              {horaPickUp && (
                                <div style={{ fontSize: '11.5px', color: '#334155' }}>
                                  <strong>{t.recogidaLabel} </strong>{horaPickUp}
                                </div>
                              )}
                              {horaReturn && (
                                <div style={{ fontSize: '11.5px', color: '#334155' }}>
                                  <strong>{t.regresoLabel} </strong>{horaReturn}
                                </div>
                              )}
                              {!horaPickUp && !horaReturn && (
                                <div style={{ fontSize: '11.5px', color: '#64748b' }}>
                                  [HH:MM]
                                </div>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>

                  {/* PRECIO TOTAL CON SOPORTE DE TIPO DE CAMBIO Y PESOS MXN */}
                  {(() => {
                    const isUSD = (cotizacion.moneda || 'USD') === 'USD';
                    const totalNum = parseFloat(cotizacion.precioTotal) || 0;
                    const tcNum = parseFloat(cotizacion.tipoCambio) || 0;
                    const mostrarConversion = cotizacion.mostrarEquivalenteMXN !== false && tcNum > 0;
                    const convertedNum = tcNum > 0 ? (isUSD ? totalNum * tcNum : totalNum / tcNum) : 0;
                    const primaryCurrency = isUSD ? 'USD' : 'MXN';
                    const secondaryCurrency = isUSD ? 'MXN' : 'USD';

                    return (
                      <table style={{ width: '100%', marginBottom: '16px', borderCollapse: 'collapse', border: '1px solid #cbd5e1' }}>
                        <tbody>
                          <tr>
                            <td style={{ textAlign: 'right', padding: '14px 18px', backgroundColor: '#f8fafc', border: 'none' }}>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', flexWrap: 'wrap', gap: '10px' }}>
                                  <span style={{ fontSize: '11px', color: '#475569', fontWeight: 'bold', textTransform: 'uppercase' }}>
                                    {t.totalPresupuesto}
                                  </span>
                                  <span style={{ fontSize: '22px', color: '#0f172a', fontWeight: 900 }}>
                                    $ {totalNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {primaryCurrency}
                                  </span>
                                </div>

                                {mostrarConversion && (
                                  <div style={{ 
                                    fontSize: '11.5px', 
                                    color: '#334155', 
                                    fontWeight: 700, 
                                    marginTop: '2px'
                                  }}>
                                    <span>
                                      {idioma === 'EN' ? 'Approx.' : 'Equivalente:'}{' '}
                                      <strong style={{ color: '#0f172a' }}>
                                        $ {convertedNum.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {secondaryCurrency}
                                      </strong>
                                    </span>{' '}
                                    <span style={{ color: '#64748b', fontSize: '11px' }}>
                                      ({idioma === 'EN' ? 'Exchange Rate:' : 'Tipo de Cambio:'} ${tcNum.toFixed(2)} MXN/USD)
                                    </span>
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  })()}

                  {/* INSTRUCCIONES DE LLEGADA */}
                  <div style={{ backgroundColor: '#f8fafc', border: '1px solid #cbd5e1', padding: '14px 18px', borderRadius: '0px', marginBottom: '6px' }}>
                    <h4 style={{ color: '#0f172a', marginTop: 0, marginBottom: '6px', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase' }}>
                      {t.tituloInstrucciones}
                    </h4>
                    <p style={{ margin: 0, fontSize: '12px', color: '#334155', lineHeight: '1.5', textAlign: 'justify' }}>
                      {t.textoInstrucciones}
                    </p>
                  </div>
                </div>

                {/* PIE DE PÁGINA SOBRIO */}
                <table style={{ backgroundColor: '#f1f5f9', color: '#0f172a', width: '100%', borderCollapse: 'collapse', borderTop: '1px solid #cbd5e1' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '12px 20px', textAlign: 'center', fontSize: '11.5px', fontWeight: 'bold', border: 'none' }}>
                        <span style={{ marginRight: '18px' }}>Tel: +52 612 194 3286</span>
                        <span style={{ marginRight: '18px' }}>reservationballard@gmail.com</span>
                        <span>www.caboprivateairporttransfers.com</span>
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

            {/* PESTAÑAS DE FILTRO Y BUSCADOR */}
            <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
              {/* TABS DE TIPO: TODOS / VENTAS / COTIZACIONES */}
              <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => setFiltroTipoHistorial('TODOS')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filtroTipoHistorial === 'TODOS' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Todos ({historialCotizaciones.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipoHistorial('VENTAS')}
                  className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ${
                    filtroTipoHistorial === 'VENTAS' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Receipt size={13} />
                  Ventas ({historialCotizaciones.filter(c => c.tipoDocumento === 'VENTA' || c.estado === 'VENTA' || c.folio?.startsWith('TCK-')).length})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroTipoHistorial('COTIZACIONES')}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    filtroTipoHistorial === 'COTIZACIONES' ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  Cotizaciones ({historialCotizaciones.filter(c => !(c.tipoDocumento === 'VENTA' || c.estado === 'VENTA' || c.folio?.startsWith('TCK-'))).length})
                </button>
              </div>

              {/* BUSCADOR DENTRO DEL HISTORIAL */}
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                <input
                  type="text"
                  value={filtroHistorial}
                  onChange={(e) => setFiltroHistorial(e.target.value.toUpperCase())}
                  placeholder="Buscar cliente, ticket o folio..."
                  className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* BARRA DE ESTADO DE LA BASE DE DATOS SUPABASE */}
          {tablaSupabaseExiste === false ? (
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-300 rounded-xl p-3.5 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs shadow-xs">
              <div className="flex items-start gap-2.5">
                <Database size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-amber-950 flex items-center gap-1.5">
                    <span>Guardado en la Nube (Base de Datos Supabase)</span>
                    <span className="bg-amber-200 text-amber-900 text-[10px] px-1.5 py-0.5 rounded font-black">Activar 1 Clic</span>
                  </p>
                  <p className="text-amber-800 text-[11px] mt-0.5 leading-relaxed">
                    Tus presupuestos están seguros en este navegador. Para sincronizarlos automáticamente en Supabase y verlos en todos tus dispositivos, crea la tabla <code>presupuestos</code> en tu panel de Supabase.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 w-full md:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setMostrarModalSQL(true)}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg shadow-sm transition-colors text-xs flex items-center gap-1.5"
                >
                  <Copy size={13} /> Ver / Copiar SQL
                </button>
                <button
                  type="button"
                  onClick={cargarHistorialDeSupabase}
                  disabled={cargandoHistorialBD}
                  className="bg-white hover:bg-slate-100 text-slate-700 font-bold px-3 py-1.5 rounded-lg border border-slate-300 transition-colors text-xs flex items-center gap-1"
                  title="Reintentar conexión con Supabase"
                >
                  <RefreshCw size={13} className={cargandoHistorialBD ? 'animate-spin' : ''} />
                  {cargandoHistorialBD ? 'Verificando...' : 'Verificar'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
              <div className="flex items-center gap-2">
                <Cloud size={16} className="text-emerald-600 shrink-0" />
                <span className="font-medium">
                  Base de Datos: <strong className="text-emerald-700">Conectada con Supabase</strong> (los presupuestos y ventas se guardan en la nube)
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleSincronizarTodoASupabase}
                  disabled={sincronizandoBD}
                  className="bg-white hover:bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-300 font-bold text-[11px] flex items-center gap-1 transition-colors"
                  title="Subir todos los presupuestos locales a la nube"
                >
                  <Cloud size={12} className={sincronizandoBD ? 'animate-pulse' : ''} />
                  {sincronizandoBD ? 'Sincronizando...' : 'Subir a Nube'}
                </button>
                <button
                  type="button"
                  onClick={cargarHistorialDeSupabase}
                  disabled={cargandoHistorialBD}
                  className="p-1 text-slate-500 hover:text-slate-800 rounded transition-colors"
                  title="Refrescar historial desde la nube"
                >
                  <RefreshCw size={14} className={cargandoHistorialBD ? 'animate-spin' : ''} />
                </button>
              </div>
            </div>
          )}

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
                    <th className="p-3 text-center">PAX / Vehículo</th>
                    <th className="p-3 text-center">Tramos</th>
                    <th className="p-3 text-right">Total Presupuesto</th>
                    <th className="p-3 text-center">Estado</th>
                    <th className="p-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {cotizacionesFiltradas.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-3 font-mono font-bold text-slate-800">
                        {c.tipoDocumento === 'VENTA' || c.estado === 'VENTA' || c.folio?.startsWith('TCK-') ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 font-black">
                              {c.numeroTicket || c.folio}
                            </span>
                          </div>
                        ) : (
                          <span>{c.folio}</span>
                        )}
                      </td>
                      <td className="p-3 text-slate-600">{c.fechaEmision}</td>
                      <td className="p-3 font-bold text-slate-800">{c.nombreCliente}</td>
                      <td className="p-3 text-slate-600">{c.hotelPrincipal || 'N/A'}</td>
                      <td className="p-3 text-center font-bold text-slate-700">
                        <div>{c.pax} PAX</div>
                        <span className={`inline-block mt-0.5 text-[10px] px-2 py-0.5 rounded-full font-black ${
                          c.tipoVehiculo === 'VAN' ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-900'
                        }`}>
                          {c.tipoVehiculo === 'VAN' ? '🚐 VAN' : '🚙 SUV'}
                        </span>
                      </td>
                      <td className="p-3 text-center">
                        <span className="bg-slate-200 text-slate-800 px-2 py-0.5 rounded-full text-[11px] font-bold">
                          {c.etapas?.length || 0}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <div className="font-black text-slate-900 text-sm">
                          ${parseFloat(c.precioTotal || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {c.moneda || 'USD'}
                        </div>
                        {c.tipoCambio && parseFloat(c.tipoCambio) > 0 && (
                          <div className="text-[10px] text-emerald-700 font-bold">
                            ≈ ${(
                              (c.moneda || 'USD') === 'USD'
                                ? (parseFloat(c.precioTotal || 0) * parseFloat(c.tipoCambio))
                                : (parseFloat(c.precioTotal || 0) / parseFloat(c.tipoCambio))
                            ).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {(c.moneda || 'USD') === 'USD' ? 'MXN' : 'USD'}
                          </div>
                        )}
                      </td>
                      <td className="p-3 text-center">
                        {c.tipoDocumento === 'VENTA' || c.estado === 'VENTA' ? (
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                            <CheckCircle size={10} /> VENTA
                          </span>
                        ) : (
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wide ${
                            c.estado === 'CONVERTIDO'
                              ? 'bg-emerald-100 text-emerald-800'
                              : c.estado === 'APROBADO'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {c.estado}
                          </span>
                        )}
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

                          {/* BOTÓN ENVIAR POR WHATSAPP DESDE EL HISTORIAL */}
                          <button
                            onClick={() => handleCompartirPresupuestoWhatsApp('PDF', c)}
                            className="p-1.5 text-green-600 hover:bg-green-100 rounded transition-colors"
                            title="Enviar PDF Natural por WhatsApp"
                          >
                            <Send size={16} />
                          </button>

                          {/* BOTÓN DESCARGAR PDF NATIVO DIRECTO */}
                          <button
                            onClick={() => handleExportarPDFNativo(c)}
                            className="p-1.5 text-amber-600 hover:bg-amber-100 rounded transition-colors"
                            title="Descargar / Compartir PDF Natural"
                          >
                            <Download size={16} />
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
                          {srv.comentario && <span className="text-xs text-slate-500 font-normal bg-slate-100 px-2 py-0.5 rounded">({srv.comentario})</span>}
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

                        {/* VEHÍCULO */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Vehículo</label>
                          <select
                            value={srv.vehiculo || (cotizacionAConvertir.tipoVehiculo === 'VAN' ? 'VAN' : 'SUV')}
                            onChange={(e) => handleCambioServicioConversion(idx, 'vehiculo', e.target.value)}
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold bg-white text-slate-800"
                          >
                            <option value="SUV">SUV</option>
                            <option value="VAN">VAN</option>
                          </select>
                        </div>

                        {/* COBRO */}
                        <div>
                          <label className="block font-bold text-slate-600 uppercase mb-1">Cobro ({cotizacionAConvertir.moneda || 'USD'})</label>
                          <input
                            type="number"
                            step="0.01"
                            value={srv.cobro}
                            onChange={(e) => handleCambioServicioConversion(idx, 'cobro', e.target.value)}
                            placeholder="0.00"
                            className="w-full px-2 py-1.5 border border-slate-300 rounded text-xs font-bold text-slate-800"
                          />
                        </div>

                        {/* COMENTARIO */}
                        <div className="col-span-1 sm:col-span-2 md:col-span-4">
                          <label className="block font-bold text-slate-600 uppercase mb-1">Comentario (opcional)</label>
                          <input
                            type="text"
                            value={srv.comentario || ''}
                            onChange={(e) => handleCambioServicioConversion(idx, 'comentario', e.target.value)}
                            placeholder="Ej. Regreso: 18:00 (o déjalo vacío si no requieres comentario)"
                            className="w-full px-2.5 py-1.5 border border-slate-300 rounded text-xs text-slate-800 focus:ring-1 focus:ring-amber-500"
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

      {/* MODAL PARA VER Y COPIAR SCRIPT SQL DE SUPABASE */}
      {mostrarModalSQL && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Database className="text-amber-400" size={18} />
                <h3 className="font-bold text-sm">Crear tabla "presupuestos" en Supabase</h3>
              </div>
              <button
                onClick={() => setMostrarModalSQL(false)}
                className="text-slate-400 hover:text-white p-1 rounded transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-slate-600 leading-relaxed">
                Para que todos tus presupuestos y tickets se guarden en la base de datos Supabase y estén sincronizados en cualquier computadora o celular, copia este código SQL y pégalo en el <strong>SQL Editor</strong> de tu proyecto Supabase:
              </p>

              <div className="relative">
                <pre className="bg-slate-950 text-slate-200 p-3.5 rounded-xl text-[11px] font-mono overflow-x-auto max-h-60 border border-slate-800">
                  {SQL_CREAR_TABLA_PRESUPUESTOS}
                </pre>
                <button
                  type="button"
                  onClick={copiarSQLAlPortapapeles}
                  className="absolute top-2 right-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 shadow-sm transition-all"
                >
                  {sqlCopiado ? <Check size={14} /> : <Copy size={14} />}
                  {sqlCopiado ? '¡Copiado!' : 'Copiar SQL'}
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 p-3 rounded-xl text-[11px] text-blue-900 space-y-1">
                <p className="font-bold">Pasos rápidos en Supabase:</p>
                <ol className="list-decimal list-inside space-y-0.5 text-blue-800">
                  <li>Entra a tu panel de Supabase y ve a <strong>SQL Editor</strong> en el menú lateral.</li>
                  <li>Haz clic en <strong>+ New Query</strong>, pega el código copiado y presiona <strong>Run</strong>.</li>
                  <li>Regresa aquí y presiona <strong>Verificar Conexión</strong>. ¡Listo!</li>
                </ol>
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setMostrarModalSQL(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800 rounded-lg"
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  setMostrarModalSQL(false);
                  cargarHistorialDeSupabase();
                }}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2 rounded-lg text-xs shadow-sm transition-colors flex items-center gap-1.5"
              >
                <RefreshCw size={13} /> Verificar Conexión
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DE CONFIRMACIÓN PARA ENVIAR PRESUPUESTO POR WHATSAPP */}
      {readyShareModal && (
        <div className="fixed inset-0 z-[10000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 font-sans print:hidden">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-200 flex flex-col">
            <div className="bg-slate-900 text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Send size={18} className="text-green-400" />
                <span className="font-bold text-sm uppercase tracking-wider">Listo para Enviar: {readyShareModal.tipo}</span>
              </div>
              <button
                onClick={() => setReadyShareModal(null)}
                className="text-slate-400 hover:text-white p-1 rounded"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 flex flex-col items-center gap-4">
              {readyShareModal.previewUrl ? (
                <div className="w-full max-h-60 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-center p-2">
                  <img
                    src={readyShareModal.previewUrl}
                    alt="Vista previa del presupuesto"
                    className="max-h-56 w-auto object-contain rounded shadow-sm"
                  />
                </div>
              ) : (
                <div className="w-full py-6 px-4 rounded-xl border border-emerald-200 bg-emerald-50 flex flex-col items-center justify-center gap-2 text-center">
                  <FileText size={38} className="text-emerald-600" />
                  <span className="font-bold text-sm text-emerald-950">{readyShareModal.filename}</span>
                  <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    PDF Natural 100% Completo (Sin recortes)
                  </span>
                </div>
              )}

              <p className="text-xs text-slate-500 text-center">
                Presiona el botón verde para abrir WhatsApp y elegir a quién enviarle la cotización.
              </p>

              <div className="w-full flex flex-col gap-2.5">
                <button
                  onClick={() => ejecutarCompartirDirecto(readyShareModal)}
                  className="w-full bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center gap-2 text-base transition-colors"
                >
                  <Send size={20} /> Enviar por WhatsApp / Compartir
                </button>

                <button
                  onClick={() => {
                    guardarArchivoLocal(readyShareModal.blob, readyShareModal.filename);
                    setReadyShareModal(null);
                    if (showToast) showToast('Archivo descargado correctamente', 'success');
                  }}
                  className="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-2.5 px-4 rounded-xl border border-slate-300 flex items-center justify-center gap-2 text-sm transition-colors"
                >
                  <Download size={16} /> Descargar Archivo ({readyShareModal.filename})
                </button>

                <button
                  onClick={() => setReadyShareModal(null)}
                  className="w-full text-slate-500 hover:text-slate-700 font-medium py-1.5 text-xs"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
