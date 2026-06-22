import React, { useState, useEffect, useRef } from 'react';
import { Search, Save, Download, Send, Printer, Calendar, Clock, Wallet, DollarSign, CalendarCheck, MapPin, Users, Car, FileText, CheckCircle, AlertCircle, X, Database, Headset, Fuel, Plane, User, Info, Phone, Mail, Globe, Map, ShieldCheck, Ticket, Play, Flag } from 'lucide-react';
import { supabase } from './supabaseClient';

const SuvIcon = ({ size = 24, className = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M2 10.5C2 9.1 3.1 8 4.5 8h10c1.2 0 2.3.7 2.8 1.8l1.7 3.7H21c1.1 0 2 .9 2 2v2.5c0 .8-.7 1.5-1.5 1.5h-.5" />
    <path d="M2 10.5V18c0 .8.7 1.5 1.5 1.5h.5" />
    <circle cx="7" cy="18" r="2.5" />
    <circle cx="17" cy="18" r="2.5" />
    <path d="M9.5 18h5" />
    <path d="M2 12.5h17" />
    <path d="M7 8v4.5" />
    <path d="M12.5 8v4.5" />
  </svg>
);

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
  { nombre: "Villa La Valencia", zona: 2 },
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
  { nombre: "Grand Solmar", zona: 3 },
  { nombre: "Solmar", zona: 3 },
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

import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// 1. Definimos los estilos vectoriales puros (No CSS web clásico, sino subset de Flexbox)
const pdfStyles = StyleSheet.create({
  page: {
    padding: 40,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#334155'
  },
  header: {
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1e3a8a',
    paddingBottom: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1e3a8a',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  meta: {
    fontSize: 9,
    color: '#64748b',
    marginTop: 4
  },
  table: {
    width: '100%',
    marginTop: 10
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    padding: 8
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    padding: 8,
    alignItems: 'center'
  },
  // Columnas con anchos exactos en porcentaje para alineación perfecta
  colFecha: { width: '15%' },
  colVehiculo: { width: '15%' },
  colChofer: { width: '15%' },
  colDetalle: { width: '40%' },
  colTotal: { width: '15%', textAlign: 'right' },

  headerText: {
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase'
  },
  subRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 3,
    paddingBottom: 2,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f1f5f9'
  },
  conceptName: {
    color: '#475569',
    textTransform: 'uppercase',
    fontSize: 8
  },
  conceptPrice: {
    color: '#0f172a',
    fontSize: 8,
    fontWeight: 'bold'
  },
  totalRow: {
    flexDirection: 'row',
    backgroundColor: '#f8fafc',
    borderTopWidth: 2,
    borderTopColor: '#cbd5e1',
    padding: 10,
    marginTop: 15
  },
  totalLabel: {
    width: '85%',
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#334155',
    textTransform: 'uppercase'
  },
  totalValue: {
    width: '15%',
    textAlign: 'right',
    fontWeight: 'bold',
    color: '#b91c1c',
    fontSize: 11
  }
});

// 2. Componente del Documento PDF Dinámico
const CierrePDFDocument = ({ data, tipo }) => {
  const isGeneral = tipo === 'general';
  const isCC = tipo === 'callcenter';
  const isGastos = tipo === 'gastos';

  // Calculamos el total dependiendo del tipo de reporte
  let totalAcumulado = 0;
  if (isGeneral) totalAcumulado = data.reduce((sum, g) => sum + (parseFloat(g.cobro) || 0), 0);
  if (isCC) totalAcumulado = data.reduce((sum, g) => sum + (parseFloat(g.comision) || 0), 0);
  if (isGastos) totalAcumulado = data.reduce((sum, g) => sum + (parseFloat(g.gasto_total) || 0), 0);

  return (
    <Document>
      <Page size="LETTER" style={pdfStyles.page}>
        {/* Cabecera del Documento */}
        <View style={pdfStyles.header}>
          <Text style={pdfStyles.title}>
            Reporte Financiero: {isGeneral ? 'Ingresos Base General' : isCC ? 'Ingresos Call Center' : 'Egresos Gastos de Flota'}
          </Text>
          <Text style={pdfStyles.meta}>
            Fecha de exportación: {new Date().toLocaleDateString()} | Registros encontrados: {data.length}
          </Text>
        </View>

        {/* Estructura de la Tabla */}
        <View style={pdfStyles.table}>

          {/* ---- MODO GENERAL ---- */}
          {isGeneral && (
            <>
              <View style={pdfStyles.tableHeader}>
                <Text style={[pdfStyles.colFecha, pdfStyles.headerText]}>Fecha</Text>
                <Text style={[{ width: '20%' }, pdfStyles.headerText]}>Reserva</Text>
                <Text style={[{ width: '30%' }, pdfStyles.headerText]}>Cliente</Text>
                <Text style={[{ width: '20%' }, pdfStyles.headerText]}>Chofer</Text>
                <Text style={[pdfStyles.colTotal, pdfStyles.headerText, { textAlign: 'right' }]}>Ingreso</Text>
              </View>
              {data.map((row, idx) => (
                <View key={row.id || idx} style={pdfStyles.tableRow} wrap={false}>
                  <Text style={pdfStyles.colFecha}>{row.fecha}</Text>
                  <Text style={{ width: '20%' }}>{row.reserva || 'N/A'}</Text>
                  <Text style={{ width: '30%', textTransform: 'uppercase' }}>{row.nombre} {row.apellido}</Text>
                  <Text style={{ width: '20%', textTransform: 'uppercase' }}>{row.chofer || 'N/A'}</Text>
                  <Text style={[pdfStyles.colTotal, { fontWeight: 'bold', color: '#166534' }]}>${parseFloat(row.cobro || 0).toFixed(2)}</Text>
                </View>
              ))}
            </>
          )}

          {/* ---- MODO CALL CENTER ---- */}
          {isCC && (
            <>
              <View style={pdfStyles.tableHeader}>
                <Text style={[pdfStyles.colFecha, pdfStyles.headerText]}>Fecha</Text>
                <Text style={[{ width: '20%' }, pdfStyles.headerText]}>Reserva</Text>
                <Text style={[{ width: '35%' }, pdfStyles.headerText]}>Cliente</Text>
                <Text style={[{ width: '15%' }, pdfStyles.headerText]}>Acción</Text>
                <Text style={[pdfStyles.colTotal, pdfStyles.headerText, { textAlign: 'right' }]}>Comisión</Text>
              </View>
              {data.map((row, idx) => (
                <View key={row.id || idx} style={pdfStyles.tableRow} wrap={false}>
                  <Text style={pdfStyles.colFecha}>{row.fecha_sistema}</Text>
                  <Text style={{ width: '20%' }}>{row.reserva}</Text>
                  <Text style={{ width: '35%', textTransform: 'uppercase' }}>{row.cliente}</Text>
                  <Text style={{ width: '15%' }}>{row.accion}</Text>
                  <Text style={[pdfStyles.colTotal, { fontWeight: 'bold', color: '#6b21a8' }]}>${parseFloat(row.comision || 0).toFixed(2)}</Text>
                </View>
              ))}
            </>
          )}

          {/* ---- MODO GASTOS FLOTA (Original) ---- */}
          {isGastos && (
            <>
              <View style={pdfStyles.tableHeader}>
                <Text style={[pdfStyles.colFecha, pdfStyles.headerText]}>Fecha</Text>
                <Text style={[pdfStyles.colVehiculo, pdfStyles.headerText]}>Vehículo</Text>
                <Text style={[pdfStyles.colChofer, pdfStyles.headerText]}>Chofer</Text>
                <Text style={[pdfStyles.colDetalle, pdfStyles.headerText]}>Detalle (Sub-total)</Text>
                <Text style={[pdfStyles.colTotal, pdfStyles.headerText, { textAlign: 'right' }]}>Total</Text>
              </View>
              {data.map((row, idx) => (
                <View key={row.id || idx} style={pdfStyles.tableRow} wrap={false}>
                  <Text style={pdfStyles.colFecha}>{row.fecha}</Text>
                  <Text style={pdfStyles.colVehiculo}>{row.vehiculo || 'N/A'}</Text>
                  <Text style={[pdfStyles.colChofer, { textTransform: 'uppercase' }]}>{row.chofer || 'N/A'}</Text>
                  <View style={pdfStyles.colDetalle}>
                    {row.concepto && row.concepto.includes('|') ? (
                      row.concepto.split(',').map((item, subIdx) => {
                        const partes = item.split('|');
                        return (
                          <View key={subIdx} style={pdfStyles.subRow}>
                            <Text style={pdfStyles.conceptName}>{partes[0]}</Text>
                            <Text style={pdfStyles.conceptPrice}>${parseFloat(partes[1]).toFixed(2)}</Text>
                          </View>
                        );
                      })
                    ) : (
                      <View style={pdfStyles.subRow}>
                        <Text style={pdfStyles.conceptName}>{row.concepto || 'VARIOS'}</Text>
                        <Text style={pdfStyles.conceptPrice}>${parseFloat(row.gasto_total).toFixed(2)}</Text>
                      </View>
                    )}
                  </View>
                  <Text style={[pdfStyles.colTotal, { fontWeight: 'bold' }]}>${parseFloat(row.gasto_total || 0).toFixed(2)}</Text>
                </View>
              ))}
            </>
          )}
        </View>

        {/* Fila del Gran Total */}
        <View style={pdfStyles.totalRow} wrap={false}>
          <Text style={pdfStyles.totalLabel}>
            {isGeneral ? 'Total Ingresos:' : isCC ? 'Total Comisiones:' : 'Total Egresos Acumulados:'}
          </Text>
          <Text style={[pdfStyles.totalValue, { color: isGeneral ? '#166534' : isCC ? '#6b21a8' : '#b91c1c' }]}>
            ${totalAcumulado.toFixed(2)}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState(null); // Aquí vivirán los permisos
  const [listaUsuarios, setListaUsuarios] = useState([]);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [services, setServices] = useState([]);
  const [currentService, setCurrentService] = useState(initialServiceState);
  const [activeTab, setActiveTab] = useState('form');
  const [ticketDataToPrint, setTicketDataToPrint] = useState(null);
  const [ticketLang, setTicketLang] = useState('EN');

  const [searchTerm, setSearchTerm] = useState('');
  const [dbSearchTerm, setDbSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  // --- FILTROS BASE DE DATOS GENERAL ---
  const [filtroAgenciaGeneral, setFiltroAgenciaGeneral] = useState('');
  const [filtroFechaInicioGeneral, setFiltroFechaInicioGeneral] = useState('');
  const [filtroFechaFinGeneral, setFiltroFechaFinGeneral] = useState('');

  const [rollDate, setRollDate] = useState(new Date().toISOString().split('T')[0]);
  const [rollData, setRollData] = useState([]);

  const [callCenterServices, setCallCenterServices] = useState([]);
  const [cierreFilters, setCierreFilters] = useState({ startDate: '', endDate: '', vehiculo: '', isCallCenter: false });

  const [deudasChoferes, setDeudasChoferes] = useState([]);
  const [currentDeuda, setCurrentDeuda] = useState({ chofer: '', concepto: 'Préstamo', montoTotal: '', quincenasTotales: 1 });

  // --- VARIABLES DEL CIERRE AVANZADO ---
  const [cierreFiltroTipo, setCierreFiltroTipo] = useState('general'); // 'general', 'callcenter', 'gastos'
  const [tipoCambioDolar, setTipoCambioDolar] = useState('');
  const [cierreFiltroInicio, setCierreFiltroInicio] = useState('');
  const [cierreFiltroFin, setCierreFiltroFin] = useState('');
  const [cierreFiltroVehiculo, setCierreFiltroVehiculo] = useState('');
  // --- VARIABLES PARA ALIMENTAR EL CIERRE ---
  const [gastosFlota, setGastosFlota] = useState([]);
  const [callCenterData, setCallCenterData] = useState([]);

  // Nuevo Formulario de ingreso para el Call Center
  const [ccInput, setCcInput] = useState('');

  const initialExpenseState = { fecha: new Date().toISOString().split('T')[0], chofer: '', vehiculo: '', gasolina: '', casetas: '' };
  const [fleetExpenses, setFleetExpenses] = useState([]);
  const [currentExpense, setCurrentExpense] = useState(initialExpenseState);

  // --- VARIABLES PARA EL CARRITO DE GASTOS ---
  const [conceptoTemp, setConceptoTemp] = useState('Gasolina');
  const [montoTemp, setMontoTemp] = useState('');
  const [carritoGastos, setCarritoGastos] = useState([]);

  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
  const [libsLoaded, setLibsLoaded] = useState(false);
  const [renderData, setRenderData] = useState(null);

  // --- ESTADOS Y LÓGICA PARA LA ALERTA DE DEUDAS ---
  const [mostrarAlertaDeudas, setMostrarAlertaDeudas] = useState(false);
  const [deudasParaHoy, setDeudasParaHoy] = useState([]);

  // NUEVO: Estado para abrir/cerrar el menú lateral y hacerlo adaptable a móvil
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // 1. Obtenemos la fecha exacta de hoy (Ej. 2026-06-09)
    const hoy = new Date().toISOString().split('T')[0];

    // 2. Buscamos todas las deudas activas cuya fecha de cobro sea HOY
    const deudasHoy = deudasChoferes.filter(d => d.activa && d.fechaRegistro === hoy);

    // 3. Si hay deudas para hoy, revisamos si ya le diste "Enterado"
    if (deudasHoy.length > 0) {
      const yaEnteradoFecha = localStorage.getItem('deudasEnteradoFecha');

      // Si la fecha guardada no es la de hoy, mostramos el banner
      if (yaEnteradoFecha !== hoy) {
        setDeudasParaHoy(deudasHoy);
        setMostrarAlertaDeudas(true);
      }
    }
  }, [deudasChoferes]); // Se ejecuta cada vez que las deudas se actualizan

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
        comentario: s.comentario, chofer: s.chofer, vehiculo: s.vehiculo, proveedor: s.proveedor, costoProveedor: s.costo_proveedor,
        latInicio: s.lat_inicio, lonInicio: s.lon_inicio, latFin: s.lat_fin, lonFin: s.lon_fin
      }));
      setServices(formattedServices);

      // 2. Traer Call Center
      // --- ASEGÚRATE DE QUE TU BLOQUE ORIGINAL QUEDE ASÍ ---
      const { data: ccData, error: ccError } = await supabase.from("call_center").select("*");
      if (ccError) throw ccError;
      setCallCenterData(ccData || []); // <-- Lo más importante es que tenga este setCallCenterData

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

      // 4. Traer Deudas de Choferes
      const { data: deudasData, error: deudasError } = await supabase.from('deudas_choferes').select('*');
      if (deudasError) throw deudasError;

      const formattedDeudas = (deudasData || []).map(d => ({
        id: d.id, fechaRegistro: d.fecha_registro, chofer: d.chofer, concepto: d.concepto,
        montoTotal: parseFloat(d.monto_total), quincenasTotales: parseInt(d.quincenas_totales),
        montoQuincenal: parseFloat(d.monto_quincenal), quincenasPagadas: parseInt(d.quincenas_pagadas), activa: d.activa
      }));
      setDeudasChoferes(formattedDeudas);

      // --- DESCARGAR GASTOS DE FLOTA ---
      const { data: gastosData, error: gastosError } = await supabase
        .from('gastos_flota')
        .select('*');
      if (gastosError) console.error("Error flota:", gastosError);
      else setGastosFlota(gastosData || []);

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

  // --- SISTEMA DE AUTENTICACIÓN Y PERMISOS ---
  const cargarPerfilUsuario = async (userId) => {
    try {
      const { data, error } = await supabase
        .from('perfiles_usuarios')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      setUserProfile(data); // Guardamos los permisos en la memoria

      // --- SEMÁFORO DE REDIRECCIÓN ---
      // Si es admin o tiene permiso de ingresar reservas, lo mandamos al Formulario
      if (data.rol === 'admin' || data.permisos?.vistas?.ingresar_reserva) {
        setActiveTab('form');
      } else {
        // Si es chofer sin ese permiso, aterriza directo en su Rol Diario
        setActiveTab('roll');
      }
      // -------------------------------

      setIsLoggedIn(true);  // Abrimos la puerta
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      showToast('Error al descargar permisos', 'error');
    }
  };

  const descargarListaUsuarios = async () => {
    try {
      showToast('Cargando usuarios...');
      const { data, error } = await supabase
        .from('perfiles_usuarios')
        .select('*')
        .order('rol', { ascending: true }); // Los admins saldrán arriba

      if (error) throw error;
      setListaUsuarios(data || []);
    } catch (error) {
      console.error("Error al descargar usuarios:", error);
      showToast('Error al cargar la lista de usuarios', 'error');
    }
  };

  // Cambia el valor de un permiso, creando la categoría si es nueva
  const handlePermisoChange = (categoria, llave) => {
    setUsuarioSeleccionado(prev => {
      // Extraemos la categoría actual o creamos una vacía si no existe
      const categoriaActual = prev.permisos[categoria] || {};

      return {
        ...prev,
        permisos: {
          ...prev.permisos,
          [categoria]: {
            ...categoriaActual,
            [llave]: !categoriaActual[llave] // Invertimos el valor
          }
        }
      };
    });
  };

  // Permite subir a alguien a Administrador o bajarlo a Chofer
  const handleRolChange = (nuevoRol) => {
    setUsuarioSeleccionado(prev => ({ ...prev, rol: nuevoRol }));
  };

  // Envía los cambios a la base de datos
  const guardarPermisosUsuario = async () => {
    try {
      showToast('Guardando configuración...');
      const { error } = await supabase
        .from('perfiles_usuarios')
        .update({
          permisos: usuarioSeleccionado.permisos,
          rol: usuarioSeleccionado.rol
        })
        .eq('id', usuarioSeleccionado.id);

      if (error) throw error;

      showToast('¡Permisos actualizados con éxito!');

      // Actualizamos la lista local izquierda para que refleje los cambios sin recargar
      setListaUsuarios(prev => prev.map(u => u.id === usuarioSeleccionado.id ? usuarioSeleccionado : u));

    } catch (error) {
      console.error("Error al guardar permisos:", error);
      showToast('Error al guardar en la nube', 'error');
    }
  };

  const handleLogin = async () => {
    if (!email || !password) {
      showToast('Ingresa tu correo y contraseña', 'error');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Validar credenciales en Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      showToast('¡Acceso concedido!', 'success');

      // 2. Descargar los permisos de este usuario
      await cargarPerfilUsuario(data.user.id);

    } catch (error) {
      console.error("Error de login:", error);
      showToast('Correo o contraseña incorrectos', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setIsLoggedIn(false);
      setUserProfile(null);
      setActiveTab('form'); // <-- Regresamos la pestaña al inicio para el siguiente que entre
      showToast('Sesión cerrada correctamente', 'success');
    } catch (error) {
      console.error("Error al salir:", error);
    }
  };

  // 3. Revisar si el usuario ya había iniciado sesión antes (para no pedir clave cada vez que recargue la página)
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        await cargarPerfilUsuario(session.user.id);
      }
    };
    checkSession();
  }, []);
  // ---------------------------------------------

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

  const registrarUbicacionGPS = async (idServicio, tipoEvento) => {
    if (!navigator.geolocation) {
      showToast('Tu dispositivo no soporta GPS', 'error');
      return;
    }

    showToast(`📍 Obteniendo GPS para ${tipoEvento}...`);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          showToast('📡 Guardando en la nube...');

          // Preparamos qué columnas vamos a llenar dependiendo del botón que se presionó
          const datosActualizar = tipoEvento === 'inicio'
            ? { lat_inicio: latitude, lon_inicio: longitude }
            : { lat_fin: latitude, lon_fin: longitude };

          const { error } = await supabase
            .from('servicios')
            .update(datosActualizar)
            .eq('id', idServicio);

          if (error) throw error;

          showToast(`¡Viaje ${tipoEvento === 'inicio' ? 'iniciado' : 'finalizado'} con éxito!`, 'success');

          // NUEVA LÍNEA: Recargar los datos inmediatamente para actualizar la vista
          fetchAllData();

        } catch (error) {
          console.error("Error GPS:", error);
          showToast('Error al conectar con la base de datos', 'error');
        }
      },
      (error) => {
        console.warn("Error de GPS:", error.message);
        showToast('Error de GPS. Asegúrate de tener la ubicación encendida y permitir el acceso.', 'error');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const abrirMapaGPS = (row) => {
    const { latInicio, lonInicio, latFin, lonFin } = row;

    if (!latInicio || !lonInicio) {
      showToast('El chofer aún no ha iniciado el viaje (Sin GPS)', 'error');
      return;
    }

    let urlMapa = '';

    // Si tenemos las 4 coordenadas (Inicio y Fin), trazamos la ruta de A hacia B
    if (latInicio && lonInicio && latFin && lonFin) {
      urlMapa = `https://www.google.com/maps/dir/?api=1&origin=${latInicio},${lonInicio}&destination=${latFin},${lonFin}`;
    }
    // Si solo tenemos el inicio, mostramos un marcador en esa ubicación
    else {
      urlMapa = `https://www.google.com/maps/search/?api=1&query=${latInicio},${lonInicio}`;
    }

    // Abrimos Google Maps
    window.open(urlMapa, '_blank');
  };

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

  // --- MÓDULO DE DEUDAS ---
  const handleDeudaChange = (e) => {
    const { name, value } = e.target;
    setCurrentDeuda(prev => ({ ...prev, [name]: value }));
  };

  const saveDeuda = async () => {
    const total = parseFloat(currentDeuda.montoTotal) || 0;
    const quincenas = parseInt(currentDeuda.quincenasTotales) || 1;

    if (!currentDeuda.chofer || total <= 0) return showToast('Llena el chofer y un monto válido', 'error');

    const montoQuincenal = total / quincenas;

    const newDeuda = {
      id: `DEUDA-${Date.now().toString().slice(-5)}`,
      fecha_registro: new Date().toISOString().split('T')[0],
      chofer: currentDeuda.chofer,
      concepto: currentDeuda.concepto,
      monto_total: total,
      quincenas_totales: quincenas,
      monto_quincenal: montoQuincenal,
      quincenas_pagadas: 0,
      activa: true
    };

    try {
      showToast('Guardando deuda...');
      const { error } = await supabase.from('deudas_choferes').insert([newDeuda]);
      if (error) throw error;

      setCurrentDeuda({ chofer: '', concepto: 'Préstamo', montoTotal: '', quincenasTotales: 1 });
      fetchAllData(); // Recargamos
      showToast('¡Deuda registrada con éxito!');
    } catch (error) {
      showToast('Error al registrar deuda', 'error');
    }
  };

  const registrarAbonoQuincena = async (deuda) => {
    const nuevasPagadas = deuda.quincenasPagadas + 1;
    const sigueActiva = nuevasPagadas < deuda.quincenasTotales;

    try {
      showToast('Registrando pago...');
      const { error } = await supabase.from('deudas_choferes')
        .update({ quincenas_pagadas: nuevasPagadas, activa: sigueActiva })
        .eq('id', deuda.id);

      if (error) throw error;
      fetchAllData();
      showToast(`Abono registrado. ${!sigueActiva ? '¡Deuda saldada!' : ''}`);
    } catch (error) {
      showToast('Error al procesar pago', 'error');
    }
  };

  const eliminarDeuda = async (id) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de deuda permanentemente? Esta acción no se puede deshacer.')) {
      try {
        showToast('Eliminando registro...', 'success');
        const { error } = await supabase
          .from('deudas_choferes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        fetchAllData(); // Recargamos las tablas
        showToast('¡Registro eliminado correctamente!');
      } catch (error) {
        console.error("Error al eliminar deuda:", error);
        showToast('Error al eliminar en la nube', 'error');
      }
    }
  };

  // Función matemática para calcular quincenas exactas (Días 15 y Fin de mes)
  const calcularFechaQuincena = (fechaInicio, quincenasSumar) => {
    let fecha = new Date(fechaInicio + 'T12:00:00'); // Evitar desfase de zona horaria
    for (let i = 0; i < quincenasSumar; i++) {
      let dia = fecha.getDate();
      if (dia <= 15) {
        // Si estamos antes del 15, la próxima es fin de mes
        fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 0);
      } else {
        // Si estamos a fin de mes, la próxima es el 15 del mes siguiente
        fecha = new Date(fecha.getFullYear(), fecha.getMonth() + 1, 15);
      }
    }
    return fecha.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  };
  // -------------------------

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

  const guardarCarritoGastos = async () => {
    if (!currentExpense.chofer || !currentExpense.vehiculo) {
      return showToast('Selecciona el chofer y el vehículo primero', 'error');
    }
    if (carritoGastos.length === 0) {
      return showToast('Agrega al menos un gasto a la lista con el botón +', 'error');
    }

    showToast('Guardando lista de gastos...');

    // Sumamos los totales y juntamos los nombres de todos los conceptos de la lista
    let sumGasolina = 0;
    let sumCasetas = 0;
    let sumTotal = 0;
    let nombresConceptos = [];

    carritoGastos.forEach(item => {
      if (item.concepto === 'Gasolina') sumGasolina += item.monto;
      if (item.concepto === 'Casetas') sumCasetas += item.monto;
      sumTotal += item.monto;

      // LA MAGIA: Guardamos el concepto junto con su precio, separados por un "|"
      // Ejemplo: "Gasolina|800"
      nombresConceptos.push(`${item.concepto}|${item.monto}`);
    });

    // Creamos UN SOLO registro maestro para la tabla
    const nuevoRegistro = {
      id: `GASTO-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`,
      fecha: currentExpense.fecha || new Date().toISOString().split('T')[0],
      chofer: currentExpense.chofer,
      vehiculo: currentExpense.vehiculo,
      concepto: nombresConceptos.join(','), // Se guarda en la nube como: "Gasolina|800,Llantas|4000"
      gasolina: sumGasolina,
      casetas: sumCasetas,
      gasto_total: sumTotal
    };

    // ... aquí arriba está el inicio de tu función de guardado (supabase)
    try {
      const { error } = await supabase.from('gastos_flota').insert([nuevoRegistro]);
      if (error) throw error;

      // Limpiamos la pantalla para el siguiente registro
      setCarritoGastos([]);
      setMontoTemp('');
      setConceptoTemp('Gasolina');
      fetchAllData(); // Recargamos la tabla
      showToast('¡Gastos guardados con éxito!', 'success');
    } catch (error) {
      console.error(error);
      showToast('Error al guardar en la nube', 'error');
    }
  }; // <--- AQUÍ TERMINA TU FUNCIÓN DE GUARDAR GASTOS

  // --- FUNCIONES DE EXPORTACIÓN DEL CIERRE ---

  // --- FUNCION PARA EXPORTAR EXCEL REAL ---
  const exportarCierreExcel = () => {
    const tabla = document.getElementById('tabla-cierre-financiero');
    if (!tabla) return showToast('No hay datos para exportar', 'error');

    try {
      if (window.XLSX) {
        showToast('Generando Excel Nativo...');
        const wb = window.XLSX.utils.table_to_book(tabla, { sheet: "Reporte" });
        const fecha = new Date().toISOString().split('T')[0];
        window.XLSX.writeFile(wb, `Cierre_${cierreFiltroTipo}_${fecha}.xlsx`);
        showToast('¡Excel descargado con éxito!');
      } else {
        // Fallback en caso de que el internet falle y no cargue la librería
        const html = tabla.outerHTML;
        const blob = new Blob([html], { type: 'application/vnd.ms-excel' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Cierre_${cierreFiltroTipo}_${new Date().toISOString().split('T')[0]}.xls`;
        a.click();
        showToast('¡Excel descargado en modo compatibilidad!');
      }
    } catch (error) {
      console.error("Error XLSX:", error);
      showToast('Error al generar Excel', 'error');
    }
  };

  // --- FUNCION NATIVA PARA EXPORTAR PDF ---
  const exportarCierrePDF = async () => {
    let dataFiltrada = [];

    // 1. Extraemos y filtramos dependiendo del tab seleccionado en "Origen de Datos"
    if (cierreFiltroTipo === 'general') {
      dataFiltrada = services.filter(s => {
        const passInicio = !cierreFiltroInicio || s.fecha >= cierreFiltroInicio;
        const passFin = !cierreFiltroFin || s.fecha <= cierreFiltroFin;
        const passVehiculo = !cierreFiltroVehiculo || (s.vehiculo && s.vehiculo.toLowerCase() === cierreFiltroVehiculo.toLowerCase());
        return passInicio && passFin && passVehiculo;
      });
    } else if (cierreFiltroTipo === 'callcenter') {
      const dataCC = typeof callCenterData !== 'undefined' ? callCenterData : [];
      dataFiltrada = dataCC.filter(c => {
        const passInicio = !cierreFiltroInicio || c.fecha_sistema >= cierreFiltroInicio;
        const passFin = !cierreFiltroFin || c.fecha_sistema <= cierreFiltroFin;
        return passInicio && passFin;
      });
    } else if (cierreFiltroTipo === 'gastos') {
      const dataGastos = typeof gastosFlota !== 'undefined' ? gastosFlota : [];
      dataFiltrada = dataGastos.filter(g => {
        const passInicio = !cierreFiltroInicio || g.fecha >= cierreFiltroInicio;
        const passFin = !cierreFiltroFin || g.fecha <= cierreFiltroFin;
        const passVehiculo = !cierreFiltroVehiculo || (g.vehiculo && g.vehiculo.toLowerCase() === cierreFiltroVehiculo.toLowerCase());
        return passInicio && passFin && passVehiculo;
      });
    }

    if (dataFiltrada.length === 0) {
      return showToast('No hay datos en el rango seleccionado para exportar PDF.', 'error');
    }

    showToast('Generando documento PDF digital...', 'info');

    try {
      // 2. Compilamos el componente PDF en un archivo nativo
      const docInstancia = <CierrePDFDocument data={dataFiltrada} tipo={cierreFiltroTipo} />;
      const blobPDF = await pdf(docInstancia).toBlob();

      // 3. Generamos la descarga automática
      const urlDescarga = URL.createObjectURL(blobPDF);
      const disparadorLink = document.createElement('a');
      disparadorLink.href = urlDescarga;

      // Bautizamos el archivo
      disparadorLink.download = `Cierre_${cierreFiltroTipo.toUpperCase()}_${new Date().toISOString().split('T')[0]}.pdf`;
      disparadorLink.click();

      URL.revokeObjectURL(urlDescarga);
      showToast('¡PDF nativo descargado con éxito!', 'success');
    } catch (error) {
      console.error("Error crítico en la generación del PDF nativo:", error);
      showToast('Error de compilación del documento digital.', 'error');
    }
  };

  // --- OTROS COMPONENTES Y LÓGICA ---

  const BallardLogo = ({ className }) => (
    <img
      src="/logo-oficial.png"
      alt="Logo Ballard"
      className={className}
    />
  );

  // --- LÓGICA DE FILTRADO MAESTRO (BASE DE DATOS GENERAL) ---
  const serviciosFiltrados = services.filter(service => {
    // 1. Filtro de búsqueda de texto (el que ya tenías)
    // Nota: Cambia "searchTerm" por el nombre de tu variable de búsqueda si se llama diferente
    const pasaBusqueda = !searchTerm ||
      Object.values(service).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );

    // 2. Filtro de Agencia (Ignora mayúsculas/minúsculas para no fallar)
    const pasaAgencia = !filtroAgenciaGeneral ||
      (service.agencia && service.agencia.toLowerCase() === filtroAgenciaGeneral.toLowerCase());

    // 3. Filtros de Rango de Fechas
    const pasaFechaInicio = !filtroFechaInicioGeneral || service.fecha >= filtroFechaInicioGeneral;
    const pasaFechaFin = !filtroFechaFinGeneral || service.fecha <= filtroFechaFinGeneral;

    return pasaBusqueda && pasaAgencia && pasaFechaInicio && pasaFechaFin;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-200 flex items-center justify-center p-4 font-sans">
        {/* ========================================================= */}
        {/* MODAL EMERGENTE: AVISO DE DESCUENTOS PARA HOY               */}
        {/* ========================================================= */}
        {mostrarAlertaDeudas && deudasParaHoy.length > 0 && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden border-t-8 border-emerald-500 animate-in fade-in zoom-in duration-300">

              <div className="bg-emerald-600 p-5 flex items-center gap-3 text-white">
                {/* Ícono de Campana Nativo */}
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
                <h2 className="text-xl font-black uppercase tracking-wider">Aviso de Descuentos</h2>
              </div>

              <div className="p-6">
                <p className="text-gray-700 mb-5 font-medium text-lg">
                  Hoy tienes los siguientes descuentos programados:
                </p>

                {/* Lista de Choferes a descontar */}
                <div className="max-h-60 overflow-y-auto pr-2 flex flex-col gap-3 mb-6">
                  {deudasParaHoy.map(deuda => (
                    <div key={deuda.id} className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
                      <div>
                        <div className="font-black text-gray-800 uppercase text-lg">{deuda.chofer}</div>
                        <div className="text-sm font-semibold text-emerald-700 bg-emerald-100 inline-block px-2 py-0.5 rounded mt-1">{deuda.concepto}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-black text-red-600 text-2xl">${deuda.montoQuincenal?.toFixed(2)}</div>
                        <div className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Monto a descontar</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Botones de Acción */}
                <div className="flex gap-4 justify-end pt-5 border-t border-gray-100">
                  <button
                    onClick={() => setMostrarAlertaDeudas(false)}
                    className="px-5 py-2.5 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors flex items-center gap-2"
                  >
                    ⏳ Recordarme luego
                  </button>

                  <button
                    onClick={() => {
                      const hoy = new Date().toISOString().split('T')[0];
                      // Guardamos la fecha de hoy en la memoria para que ya no vuelva a salir hoy
                      localStorage.setItem('deudasEnteradoFecha', hoy);
                      setMostrarAlertaDeudas(false);
                    }}
                    className="px-6 py-2.5 rounded-lg font-black bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg transition-transform hover:scale-105 flex items-center gap-2"
                  >
                    ✔️ Enterado
                  </button>
                </div>

              </div>
            </div>
          </div>
        )}
        {/* ========================================================= */}
        <div className="bg-white p-8 rounded-xl shadow-xl w-full max-w-md flex flex-col items-center border-t-4 border-blue-600">
          <BallardLogo className="h-24 w-auto mb-6" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Acceso al Sistema</h2>
          <p className="text-sm text-gray-500 mb-6">Ingresa tus credenciales para continuar</p>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="w-full border border-gray-300 rounded-lg p-3 mb-4 text-center focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            disabled={isLoading}
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            className="w-full border border-gray-300 rounded-lg p-3 mb-6 text-center focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 shadow-sm"
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleLogin();
            }}
            disabled={isLoading}
          />

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md flex justify-center items-center gap-2 ${isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {isLoading ? 'Verificando...' : 'Entrar al Sistema'}
          </button>
        </div>

        {/* Mantenemos el sistema de Toasts visible en la pantalla de Login */}
        {toast.show && (
          <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg flex items-center gap-2 text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} transition-opacity`}>
            {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
            <span>{toast.message}</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full bg-gray-100 text-gray-800 font-sans overflow-hidden print:overflow-visible print:h-auto print:block">
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded shadow-lg flex items-center gap-2 text-white ${toast.type === 'error' ? 'bg-red-600' : 'bg-green-600'} transition-opacity`}>
          {toast.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* ========================================================= */}
      {/* BOTÓN FLOTANTE (HAMBURGUESA/FLECHA) PARA ABRIR/CERRAR MENÚ*/}
      {/* ========================================================= */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className={`fixed top-4 z-[60] bg-slate-900 hover:bg-slate-700 text-white p-2.5 rounded-lg shadow-xl transition-all duration-300 border border-slate-700 ${isSidebarOpen ? 'left-[200px] md:left-[200px]' : 'left-4'}`}
        title={isSidebarOpen ? "Ocultar menú" : "Mostrar menú"}
      >
        {isSidebarOpen ? (
          // Flecha para ocultar
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        ) : (
          // Menú hamburguesa para mostrar
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12h18M3 6h18M3 18h18" /></svg>
        )}
      </button>

      {/* FONDO OSCURO EN MÓVIL PARA CERRAR EL MENÚ AL TOCAR AFUERA */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ========================================================= */}
      {/* NUEVO SIDEBAR (MENÚ LATERAL MODERNO Y ADAPTABLE)          */}
      {/* ========================================================= */}
      <aside className={`fixed md:relative top-0 left-0 h-full flex-shrink-0 bg-slate-900 flex flex-col shadow-2xl z-50 print:hidden transition-all duration-300 ${isSidebarOpen ? 'w-64 translate-x-0' : 'w-0 -translate-x-full'}`}>

        {/* Cabecera / Logo en Blanco */}
        <div className="h-20 bg-white flex items-center justify-start pl-4 border-b border-gray-200 shadow-sm relative z-10 overflow-hidden">
          <div className="min-w-max">
            <BallardLogo className="h-10 w-auto" />
          </div>
        </div>

        {/* Menú de Navegación Vertical */}
        <div className={`flex-col h-full ${isSidebarOpen ? 'flex' : 'hidden'}`}>
          <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-2 custom-scrollbar">
            <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Menú Principal</div>

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.vistas?.ingresar_reserva) && (
              <button
                onClick={() => { setActiveTab('form'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'form' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <FileText size={20} /> Ingresar / Buscar
              </button>
            )}

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.vistas?.ingreso_cc) && (
              <button
                onClick={() => { setActiveTab('callcenter'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'callcenter' ? 'bg-purple-600 text-white shadow-lg shadow-purple-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Headset size={20} /> Ingreso CC
              </button>
            )}

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.rol_diario?.ver_modulo) && (
              <button
                onClick={() => { setActiveTab('roll'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'roll' ? 'bg-amber-500 text-white shadow-lg shadow-amber-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <CalendarCheck size={20} /> Rol Diario
              </button>
            )}

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.vistas?.control_flota) && (
              <button
                onClick={() => { setActiveTab('flota'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'flota' ? 'bg-orange-600 text-white shadow-lg shadow-orange-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Fuel size={20} /> Control Flota
              </button>
            )}

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.vistas?.deudas) && (
              <button
                onClick={() => { setActiveTab('deudas'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'deudas' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <DollarSign size={20} /> Deudas y Préstamos
              </button>
            )}

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.vistas?.base_de_datos) && (
              <button
                onClick={() => { setActiveTab('database'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'database' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Database size={20} /> Base de Datos
              </button>
            )}

            {(userProfile?.rol === 'admin' || userProfile?.permisos?.vistas?.cierre) && (
              <button
                onClick={() => { setActiveTab('cierre'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'cierre' ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
              >
                <Wallet size={20} /> Cierre Financiero
              </button>
            )}

            {userProfile?.rol === 'admin' && (
              <>
                <div className="mt-8 mb-4 border-t border-slate-700/50"></div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 px-3">Administración</div>

                <button
                  onClick={() => { setActiveTab('usuarios'); if (window.innerWidth <= 768) setIsSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl font-medium transition-all ${activeTab === 'usuarios' ? 'bg-red-600 text-white shadow-lg shadow-red-900/50' : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
                >
                  <ShieldCheck size={20} /> Permisos
                </button>
              </>
            )}
          </nav>

          <div className="p-4 bg-slate-950 border-t border-slate-800">
            <div className="flex items-center gap-3 mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-300">
                <User size={16} />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs text-slate-400">Usuario Activo</span>
                <span className="text-sm font-bold truncate text-slate-200">{userProfile?.email || email}</span>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 py-2.5 rounded-lg text-sm font-bold transition-colors"
            >
              Cerrar Sesión
            </button>
          </div>
        </div>
      </aside>

      {/* CONTENEDOR PRINCIPAL DERECHO */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative print:overflow-visible print:h-auto print:block">

        {/* Cabecera Móvil (Solo visible cuando el menú está cerrado en pantallas pequeñas) */}
        <div className="md:hidden h-16 bg-white flex items-center justify-center shadow-sm relative z-10 shrink-0">
          <BallardLogo className="h-8 w-auto ml-8" />
        </div>

        {/* Le bajamos un poco el padding en celular (p-2) para que las tablas tengan más espacio */}
        <main className="flex-1 overflow-y-auto p-2 sm:p-6 lg:p-8 w-full bg-gray-100 print:p-0 print:overflow-visible print:h-auto print:block max-w-7xl mx-auto">

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
                    <label className="block text-xs font-bold text-orange-800 mb-1 uppercase">Chofer</label>
                    <select
                      name="chofer"
                      value={currentExpense.chofer || ''}
                      onChange={handleExpenseChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer uppercase"
                    >
                      <option value="">Selecciona...</option>
                      <option value="IGNACIO">Ignacio</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-orange-800 mb-1 uppercase">Vehículo</label>
                    <select
                      name="vehiculo"
                      value={currentExpense.vehiculo || ''}
                      onChange={handleExpenseChange}
                      className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 cursor-pointer"
                    >
                      <option value="">Selecciona...</option>
                      <option value="Expedition">Expedition</option>
                      <option value="Hiace">Hiace</option>
                    </select>
                  </div>
                  {/* --- NUEVO MÓDULO DE CARRITO DE GASTOS --- */}
                  <div className="col-span-1 md:col-span-2 bg-orange-50 p-4 rounded-lg border border-orange-200 shadow-inner">
                    <div className="flex flex-wrap gap-2 items-end">

                      <div className="flex-1 min-w-[120px]">
                        <label className="block text-xs font-bold text-orange-800 mb-1">CONCEPTO</label>
                        <select
                          value={conceptoTemp}
                          onChange={(e) => setConceptoTemp(e.target.value)}
                          className="w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm focus:ring-orange-500 focus:border-orange-500 bg-white"
                        >
                          <option value="Gasolina">Gasolina</option>
                          <option value="Casetas">Casetas</option>
                          <option value="Llantas">Llantas</option>
                          <option value="Dua">Dua</option>
                          <option value="Aceite">Aceite</option>
                          <option value="Otros">Otros</option>
                        </select>
                      </div>

                      <div className="flex-1 min-w-[100px]">
                        <label className="block text-xs font-bold text-orange-800 mb-1">MONTO ($)</label>
                        <input
                          type="number" min="0" step="0.5"
                          value={montoTemp}
                          onChange={(e) => setMontoTemp(e.target.value)}
                          placeholder="Ej. 500"
                          className="w-full border border-gray-300 rounded-md p-2 text-sm shadow-sm focus:ring-orange-500 focus:border-orange-500"
                        />
                      </div>

                      <button
                        onClick={() => {
                          if (!montoTemp || montoTemp <= 0) return;
                          setCarritoGastos([...carritoGastos, { concepto: conceptoTemp, monto: parseFloat(montoTemp) }]);
                          setMontoTemp(''); // Limpiamos el monto tras agregar
                        }}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-black py-2 px-4 rounded-md transition-colors shadow-sm text-sm h-[38px]"
                        title="Agregar a la lista"
                      >
                        + AGREGAR
                      </button>
                    </div>

                    {/* Lista visual de lo que se va agregando */}
                    {carritoGastos.length > 0 && (
                      <div className="mt-4 bg-white p-3 rounded border border-gray-200">
                        <h4 className="text-xs font-bold text-gray-500 border-b pb-1 mb-2 uppercase">Gastos a registrar hoy:</h4>
                        <ul className="text-sm divide-y divide-gray-100 mb-3">
                          {carritoGastos.map((item, index) => (
                            <li key={index} className="py-1 flex justify-between text-gray-700">
                              <span>✔️ {item.concepto}</span>
                              <span className="font-bold">${item.monto.toFixed(2)}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex justify-between items-center border-t pt-2">
                          <span className="font-black text-orange-800">Total del día: ${carritoGastos.reduce((sum, item) => sum + item.monto, 0).toFixed(2)}</span>

                          {/* Botón Final para Guardar Todo en Supabase */}
                          <button
                            onClick={guardarCarritoGastos}
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-1 px-4 rounded transition-colors text-sm shadow"
                          >
                            Guardar Gastos
                          </button>
                        </div>
                      </div>
                    )}
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
                <table className="min-w-full text-left text-sm whitespace-nowrap mt-4">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-600 border-b">
                      <th className="p-3">ID Gasto</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3">Chofer</th>
                      <th className="p-3">Vehículo</th>
                      <th className="p-3">Concepto</th>
                      <th className="p-3 text-right">Monto Total</th>
                      <th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {typeof gastosFlota !== 'undefined' && gastosFlota.length === 0 ? (
                      <tr><td colSpan="7" className="p-8 text-center text-gray-500 font-medium">No hay historial de gastos.</td></tr>
                    ) : (
                      (typeof gastosFlota !== 'undefined' ? gastosFlota : []).map(row => (
                        <tr key={row.id} className="hover:bg-orange-50 transition-colors">

                          {/* ID Gasto */}
                          <td className="p-3 text-gray-400 text-xs font-mono">
                            {row.id?.substring(0, 8)}...
                          </td>

                          {/* Fecha */}
                          <td className="p-3 font-medium text-gray-700">
                            {row.fecha}
                          </td>

                          {/* Chofer */}
                          <td className="p-3 font-bold text-gray-800 uppercase">
                            {row.chofer}
                          </td>

                          {/* Vehículo */}
                          <td className="p-3 text-gray-700">
                            {row.vehiculo}
                          </td>

                          {/* Concepto Dinámico (Llantas, Gasolina, etc.) */}
                          <td className="p-3">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${row.concepto === 'Gasolina' ? 'bg-orange-100 text-orange-800' :
                              row.concepto === 'Casetas' ? 'bg-blue-100 text-blue-800' :
                                row.concepto === 'Llantas' ? 'bg-gray-200 text-gray-800' :
                                  'bg-purple-100 text-purple-800'
                              }`}>
                              {row.concepto || (row.gasolina > 0 ? 'Gasolina' : row.casetas > 0 ? 'Casetas' : 'Varios')}
                            </span>
                          </td>

                          {/* Monto Total */}
                          <td className="p-3 text-right font-black text-red-600">
                            ${parseFloat(row.gasto_total || 0).toFixed(2)}
                          </td>

                          {/* Acciones (Basurero) */}
                          <td className="p-3 text-center">
                            {userProfile?.rol === 'admin' && (
                              <button
                                onClick={async () => {
                                  if (window.confirm('¿Eliminar este gasto permanentemente?')) {
                                    try {
                                      // Usamos supabase directamente para borrar
                                      await supabase.from('gastos_flota').delete().eq('id', row.id);
                                      fetchAllData(); // Recarga la tabla
                                    } catch (error) {
                                      console.error("Error al borrar", error);
                                    }
                                  }
                                }}
                                className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                title="Eliminar Gasto"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                              </button>
                            )}
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* --- PESTAÑA: DEUDAS Y PRÉSTAMOS --- */}
          {activeTab === 'deudas' && (
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-emerald-600">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
                <Database className="text-emerald-600" /> Control de Deudas, Descuentos y Préstamos
              </h2>

              {/* Formulario de Ingreso */}
              <div className="bg-emerald-50 p-6 rounded-lg border border-emerald-100 mb-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">Chofer</label>
                    <input type="text" name="chofer" value={currentDeuda.chofer} onChange={handleDeudaChange} placeholder="Nombre del chofer" className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">Concepto / Razón</label>
                    <select name="concepto" value={currentDeuda.concepto} onChange={handleDeudaChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500 bg-white">
                      <option value="Préstamo Personal">Préstamo Personal</option>
                      <option value="Día Descontado">Día Descontado</option>
                      <option value="Caseta no reportada">Caseta no reportada</option>
                      <option value="Daño a vehículo">Daño a vehículo</option>
                      <option value="Otro">Otro descuento</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">Monto Total a Pagar ($)</label>
                    <input type="number" name="montoTotal" min="0" step="0.5" value={currentDeuda.montoTotal} onChange={handleDeudaChange} placeholder="Ej. 1500" className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm font-bold text-red-600 focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-emerald-800 mb-1">¿A cuántas quincenas?</label>
                    <input type="number" name="quincenasTotales" min="1" value={currentDeuda.quincenasTotales} onChange={handleDeudaChange} className="block w-full border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-emerald-500 focus:border-emerald-500" />
                  </div>
                </div>
                <div className="mt-4 flex flex-col md:flex-row justify-between items-center bg-white p-3 rounded border border-emerald-200">
                  <div className="text-sm font-semibold text-gray-700">
                    Descuento por quincena:
                    <span className="text-lg text-emerald-600 ml-2 font-black">
                      ${currentDeuda.montoTotal ? (parseFloat(currentDeuda.montoTotal) / parseInt(currentDeuda.quincenasTotales || 1)).toFixed(2) : '0.00'}
                    </span>
                  </div>
                  <button onClick={saveDeuda} className="mt-3 md:mt-0 bg-emerald-600 text-white px-6 py-2 rounded-md hover:bg-emerald-700 shadow-sm font-bold transition-colors flex items-center gap-2">
                    <Save size={18} /> Registrar Deuda
                  </button>
                </div>
              </div>

              {/* Tabla de Control de Deudas */}
              <div className="flex-1 overflow-x-auto w-full">
                <h3 className="text-lg font-bold text-gray-700 mb-4 border-b pb-2">Deudas Activas (Por Cobrar)</h3>
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-600 border-b">
                      <th className="p-3">Chofer</th><th className="p-3">Concepto</th><th className="p-3 text-right">Monto Total</th>
                      <th className="p-3 text-center">Quincenas</th><th className="p-3 text-right bg-red-50 text-red-800 font-bold">Descuento Próxima Quincena</th>
                      <th className="p-3">¿Cuándo se descontará? (Editable)</th><th className="p-3 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {deudasChoferes.filter(d => d.activa).length === 0 ? (
                      <tr><td colSpan="7" className="text-center p-8 text-gray-500 font-medium">No hay deudas activas. ¡Todos al corriente! 🎉</td></tr>
                    ) : deudasChoferes.filter(d => d.activa).map(row => {
                      const quincenasRestantes = row.quincenasTotales - row.quincenasPagadas;
                      // Se calcula la fecha final partiendo de la fecha de cobro asignada
                      const fechaFin = calcularFechaQuincena(row.fechaRegistro, row.quincenasTotales);

                      return (
                        <tr key={row.id} className="hover:bg-emerald-50 transition-colors">
                          <td className="p-3 font-bold text-gray-800 uppercase">{row.chofer}</td>
                          {/* Concepto Dinámico Apilado */}
                          <td className="p-3">
                            <div className="flex flex-col gap-1 items-start">
                              {(() => {
                                let lista = [];
                                if (row.concepto === 'Varios' || !row.concepto) {
                                  if (row.gasolina > 0) lista.push('Gasolina');
                                  if (row.casetas > 0) lista.push('Casetas');
                                  if (lista.length === 0) lista.push('Varios');
                                } else {
                                  lista = row.concepto.split(',');
                                }

                                return lista.map((c, idx) => {
                                  const nombreReal = c.includes('|') ? c.split('|')[0] : c;
                                  const precioReal = c.includes('|') ? `$${parseFloat(c.split('|')[1]).toFixed(2)}` : '';

                                  return (
                                    <span key={idx} className={`px-2 py-1 rounded text-xs font-bold shadow-sm flex gap-3 justify-between min-w-[130px] ${nombreReal === 'Gasolina' ? 'bg-orange-100 text-orange-800 border border-orange-200' :
                                      nombreReal === 'Casetas' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                                        nombreReal === 'Llantas' ? 'bg-gray-700 text-white border border-gray-800' :
                                          nombreReal === 'Aceite' ? 'bg-yellow-100 text-yellow-800 border border-yellow-300' :
                                            nombreReal === 'Dua' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                                              'bg-purple-100 text-purple-800 border border-purple-200'
                                      }`}>
                                      <span>{nombreReal}</span> <span>{precioReal}</span>
                                    </span>
                                  );
                                });
                              })()}
                            </div>
                          </td>
                          <td className="p-3 text-right font-medium text-gray-600">${row.montoTotal.toFixed(2)}</td>
                          <td className="p-3 text-center">
                            <div className="text-xs font-bold text-emerald-600">{row.quincenasPagadas} pagadas</div>
                            <div className="text-xs text-red-500">faltan {quincenasRestantes}</div>
                          </td>
                          <td className="p-3 text-right bg-red-50 text-red-700 font-black text-base">
                            ${row.montoQuincenal.toFixed(2)}
                          </td>

                          {/* EDICIÓN DE LA FECHA DE COBRO / DESCUENTO */}
                          <td className="p-3 font-medium text-gray-600 text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar size={14} className="text-emerald-500" />
                              <input
                                type="date"
                                defaultValue={row.fechaRegistro}
                                className="bg-transparent border border-transparent hover:border-emerald-300 hover:bg-emerald-50 focus:bg-white focus:border-emerald-500 rounded p-1 text-xs font-bold text-gray-700 transition-all cursor-pointer outline-none"
                                title="Haz clic para cambiar la fecha en que se aplicará el descuento"
                                onBlur={async (e) => {
                                  const nuevaFecha = e.target.value;
                                  if (nuevaFecha && nuevaFecha !== row.fechaRegistro) {
                                    try {
                                      showToast('Programando nueva fecha de cobro...', 'info');

                                      const { error } = await supabase
                                        .from('deudas_choferes')
                                        .update({ fechaRegistro: nuevaFecha })
                                        .eq('id', row.id);

                                      if (error) throw error;

                                      fetchAllData();
                                      showToast('¡Fecha de descuento actualizada!', 'success');
                                    } catch (error) {
                                      console.error(error);
                                      showToast('Error al reprogramar el cobro', 'error');
                                      e.target.value = row.fechaRegistro;
                                    }
                                  }
                                }}
                              />
                            </div>
                            <div className="text-[10px] text-gray-400 mt-1 italic">
                              Termina de pagar: {fechaFin}
                            </div>
                          </td>

                          <td className="p-3 text-center flex justify-center items-center gap-2">
                            <button
                              onClick={() => {
                                if (window.confirm(`¿Confirmas el descuento de $${row.montoQuincenal.toFixed(2)} a ${row.chofer} en esta quincena?`)) {
                                  registrarAbonoQuincena(row);
                                }
                              }}
                              className="bg-emerald-100 text-emerald-700 hover:bg-emerald-200 px-3 py-1 rounded font-bold text-xs shadow-sm transition-colors"
                            >
                              ✔️ Registrar Pago Quincena
                            </button>

                            {/* BOTÓN ELIMINAR (Solo Admin) */}
                            {userProfile?.rol === 'admin' && (
                              <button
                                onClick={() => eliminarDeuda(row.id)}
                                className="p-1 bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 rounded transition-colors"
                                title="Eliminar Deuda"
                              >
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Historial de Pagadas */}
              <div className="mt-12 flex-1 overflow-x-auto w-full opacity-60 hover:opacity-100 transition-opacity">
                <h3 className="text-md font-bold text-gray-500 mb-4 border-b pb-2">Historial de Deudas Liquidadas</h3>
                <table className="min-w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-gray-50">
                    <tr className="text-gray-400 border-b">
                      <th className="p-2">Chofer</th><th className="p-2">Concepto</th><th className="p-2">Monto Total</th><th className="p-2">Estado</th><th className="p-2 text-center">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {deudasChoferes.filter(d => !d.activa).length === 0 ? (
                      <tr><td colSpan="5" className="text-center p-4 text-gray-400">No hay historial.</td></tr>
                    ) : deudasChoferes.filter(d => !d.activa).map(row => (
                      <tr key={row.id}>
                        <td className="p-2 font-medium">{row.chofer}</td><td className="p-2">{row.concepto}</td>
                        <td className="p-2">${row.montoTotal.toFixed(2)}</td>
                        <td className="p-2"><span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded font-bold">Pagada</span></td>
                        <td className="p-2 text-center">
                          {userProfile?.rol === 'admin' && (
                            <button
                              onClick={() => eliminarDeuda(row.id)}
                              className="p-1 text-red-400 hover:bg-red-50 hover:text-red-600 rounded transition-colors"
                              title="Eliminar del historial"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
                            </button>
                          )}
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
              {/* AVISO MÓVIL: GIRA TU TELÉFONO */}
              <div className="md:hidden bg-blue-100 text-blue-800 p-2 text-center text-xs font-bold animate-pulse rounded-t-lg">
                📱 Gira tu celular horizontalmente para ver la tabla completa.
              </div>

              <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50 md:rounded-t-lg">
                <div className="flex w-full sm:w-auto items-center justify-between sm:justify-start gap-4">
                  <input type="date" value={rollDate} onChange={(e) => setRollDate(e.target.value)} className="border border-gray-300 rounded-md p-2 shadow-sm font-semibold text-gray-700 w-full sm:w-auto" />
                  <span className="text-sm text-gray-500 whitespace-nowrap font-medium bg-white px-2 py-1 rounded border shadow-sm">{rollData.length} servicio(s)</span>
                </div>

                <div className="flex w-full sm:w-auto gap-2 justify-end">
                  {userProfile?.rol === 'admin' && (
                    <button onClick={saveRollUpdates} className="flex-1 sm:flex-none bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex justify-center items-center gap-2 text-sm font-bold transition-colors shadow-sm">
                      <Save size={16} /> Guardar
                    </button>
                  )}
                  <button
                    onClick={downloadRolPNG}
                    className="flex-1 sm:flex-none bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex justify-center items-center gap-2 text-sm font-bold transition-colors shadow-sm"
                  >
                    <Download size={18} /> Bajar PNG
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
                        <th className="border p-2">Hora</th>
                        <th className="border p-2">Chofer</th>
                        <th className="border p-2">Nombre</th>
                        <th className="border p-2">Apellido</th>
                        <th className="border p-2">Vuelo</th>
                        <th className="border p-2">Hotel</th>
                        <th className="border p-2">Pax</th>
                        <th className="border p-2">Teléfono</th>
                        <th className="border p-2">Tipo</th>
                        <th className="border p-2">Vehículo</th>
                        {userProfile?.rol === 'admin' && (
                          <>
                            <th className="border p-2 border-b ocultar-en-foto">Proveedor</th>
                            <th className="border p-2 border-b ocultar-en-foto">Cantidad</th>
                          </>
                        )}

                        {/* NUEVO ENCABEZADO: Necesario para mantener la estructura HTML válida */}
                        <th className="border p-2 ocultar-en-foto">GPS</th>

                        <th className="border p-2">Extras</th>
                        <th className="border p-2 w-48">Comentario</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rollData.map(row => (
                        <tr key={row.id} className="border-b">
                          <td className="border p-2 font-bold">{row.hora}</td>
                          <td className="border p-2">{row.chofer}</td>
                          <td className="border p-2 uppercase">{row.nombre}</td>
                          <td className="border p-2 uppercase">{row.apellido}</td>
                          <td className="border p-2">{row.vuelo}</td>
                          <td className="border p-2 text-xs">{row.hotel}</td>
                          <td className="border p-2 text-center">{row.pax}</td>
                          <td className="border p-2 text-xs">{row.telefono}</td>
                          <td className="border p-2 text-xs">{row.tipoServicio}</td>
                          <td className="border p-2">{row.vehiculo}</td>
                          {userProfile?.rol === 'admin' && (
                            <>
                              <td className="border p-2 text-xs border-b ocultar-en-foto">{row.proveedor}</td>
                              <td className="border p-2 text-xs font-bold">
                                {row.costoProveedor ? `$${row.costoProveedor}` : ''}
                              </td>
                            </>
                          )}

                          {/* NUEVO BLOQUE: Botones GPS insertados justo después del cobro/cantidad */}
                          <td className="p-2 text-center ocultar-en-foto">
                            <div className="flex gap-2 justify-center">
                              <button
                                onClick={() => registrarUbicacionGPS(row.id, 'inicio')}
                                className="bg-green-100 text-green-700 p-1.5 rounded-full hover:bg-green-200 transition-colors shadow-sm"
                                title="Iniciar Viaje (GPS)"
                              >
                                <Play size={16} className="fill-current" />
                              </button>
                              <button
                                onClick={() => registrarUbicacionGPS(row.id, 'fin')}
                                className="bg-red-100 text-red-700 p-1.5 rounded-full hover:bg-red-200 transition-colors shadow-sm"
                                title="Finalizar Viaje (GPS)"
                              >
                                <Flag size={16} className="fill-current" />
                              </button>
                            </div>
                          </td>

                          <td className="border p-2 text-xs">
                            {row.carSeat > 0 && `Car:${row.carSeat} `}
                            {row.babySeat > 0 && `Baby:${row.babySeat} `}
                            {row.booster > 0 && `Bstr:${row.booster} `}
                            {row.paradaCompras && `Compras`}
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
                      <tr key={row.id} className="hover:bg-gray-50 transition-colors border-b">

                        {/* Hora */}
                        <td className="p-2">
                          {userProfile?.rol === 'admin' ? (
                            <input type="time" value={row.hora || ''} onChange={(e) => handleRollChange(row.id, 'hora', e.target.value)} className="w-full bg-transparent border-b border-dashed focus:outline-none focus:border-blue-500" />
                          ) : (
                            <span className="font-bold text-gray-800">{row.hora}</span>
                          )}
                        </td>

                        {/* Chofer */}
                        <td className="p-2">
                          {userProfile?.rol === 'admin' ? (
                            <input type="text" value={row.chofer || ''} onChange={(e) => handleRollChange(row.id, 'chofer', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none" />
                          ) : (
                            <span className="text-gray-700">{row.chofer}</span>
                          )}
                        </td>

                        {/* Nombre y Apellido (Siempre fijos) */}
                        <td className="p-2 font-medium uppercase">{row.nombre}</td>
                        <td className="p-2 font-medium uppercase">{row.apellido}</td>

                        {/* Vuelo */}
                        <td className="p-2">
                          {userProfile?.rol === 'admin' ? (
                            <input type="text" value={row.vuelo || ''} onChange={(e) => handleRollChange(row.id, 'vuelo', e.target.value)} className="w-20 bg-transparent border-b border-dashed focus:outline-none" />
                          ) : (
                            <span className="text-gray-700">{row.vuelo}</span>
                          )}
                        </td>

                        {/* Hotel */}
                        <td className="p-2">
                          {userProfile?.rol === 'admin' ? (
                            <input type="text" list="hoteles-rol-list" value={row.hotel || ''} onChange={(e) => handleRollChange(row.id, 'hotel', e.target.value)} className="w-32 bg-transparent border-b border-dashed focus:outline-none cursor-pointer" placeholder="Elegir..." />
                          ) : (
                            <span className="text-xs text-gray-700">{row.hotel}</span>
                          )}
                        </td>

                        {/* PAX y Teléfono (Siempre fijos) */}
                        <td className="p-2 text-center">{row.pax}</td>
                        <td className="p-2 text-xs">{row.telefono}</td>

                        {/* Tipo de Servicio */}
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

                        {/* Vehículo */}
                        <td className="p-2">
                          {userProfile?.rol === 'admin' ? (
                            <select value={row.vehiculo || ''} onChange={(e) => handleRollChange(row.id, 'vehiculo', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none text-sm cursor-pointer">
                              <option value=""></option>
                              <option value="Expedition">Expedition</option>
                              <option value="Hiace">Hiace</option>
                            </select>
                          ) : (
                            <span className="text-sm text-gray-700">{row.vehiculo}</span>
                          )}
                        </td>

                        {/* PROVEEDOR Y COSTO (Condicionados al rol de Admin) */}
                        {userProfile?.rol === 'admin' && (
                          <>
                            <td className="p-2"><input type="text" value={row.proveedor || ''} onChange={(e) => handleRollChange(row.id, 'proveedor', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none" /></td>
                            <td className="p-2"><input type="number" value={row.costoProveedor || ''} onChange={(e) => handleRollChange(row.id, 'costoProveedor', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none font-bold text-red-700" /></td>
                          </>
                        )}

                        {/* Extras (Fijos) */}
                        <td className="p-2 text-xs text-gray-600">
                          <div className="flex gap-1 flex-col">
                            {row.carSeat > 0 && <span>Car: {row.carSeat}</span>}{row.babySeat > 0 && <span>Baby: {row.babySeat}</span>}
                            {row.booster > 0 && <span>Bstr: {row.booster}</span>}{row.paradaCompras && <span className="text-blue-600 font-semibold">Compras</span>}
                          </div>
                        </td>

                        {/* Comentarios */}
                        <td className="p-2">
                          {userProfile?.rol === 'admin' ? (
                            <input type="text" value={row.comentario || ''} onChange={(e) => handleRollChange(row.id, 'comentario', e.target.value)} className="w-32 bg-transparent border-b border-dashed focus:outline-none text-xs" />
                          ) : (
                            <span className="text-xs break-words text-gray-600">{row.comentario}</span>
                          )}
                        </td>

                        {/* ACCIONES Y BOTONES (Ya cuentan con sus candados previos) */}
                        <td className="p-2 text-center">
                          <div className="flex justify-center items-center gap-2">

                            {/* --- BOTÓN GPS INICIO: Candado --- */}
                            {(userProfile?.rol === 'admin' || userProfile?.permisos?.rol_diario?.inicio_viaje) && (
                              <button
                                onClick={() => registrarUbicacionGPS(row.id, 'inicio')}
                                className="p-1 text-green-600 hover:bg-green-100 rounded transition-colors"
                                title="Iniciar Viaje (GPS)"
                              >
                                <Play size={18} className="fill-current" />
                              </button>
                            )}

                            {/* --- BOTÓN GPS FIN: Candado --- */}
                            {(userProfile?.rol === 'admin' || userProfile?.permisos?.rol_diario?.viaje_finalizado) && (
                              <button
                                onClick={() => registrarUbicacionGPS(row.id, 'fin')}
                                className="p-1 text-red-600 hover:bg-red-100 rounded transition-colors"
                                title="Finalizar Viaje (GPS)"
                              >
                                <Flag size={18} className="fill-current" />
                              </button>
                            )}

                            {/* BOTÓN VER MAPA */}
                            <button onClick={() => abrirMapaGPS(row)} className="p-1 text-blue-500 hover:bg-blue-100 rounded transition-colors" title="Ver Ruta en Google Maps">
                              <Map size={18} className="fill-current" />
                            </button>

                            {/* BOTÓN COMPARTIR */}
                            <button onClick={() => generateSharePNG(row)} className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Compartir">
                              <Send size={18} />
                            </button>

                            {/* --- BOTÓN IMPRIMIR LETRERO: Candado --- */}
                            {row.tipoServicio === 'Llegada' && (userProfile?.rol === 'admin' || userProfile?.permisos?.rol_diario?.imprimir_letrero) && (
                              <button onClick={() => generateWelcomeSign(row)} className="p-1 text-gray-600 hover:bg-gray-200 rounded" title="Imprimir Letrero">
                                <Printer size={18} />
                              </button>
                            )}

                            {/* --- BOTÓN ELIMINAR: Candado --- */}
                            {(userProfile?.rol === 'admin' || userProfile?.permisos?.rol_diario?.eliminar_servicio) && (
                              <button
                                onClick={async () => {
                                  if (window.confirm('¿Estás seguro de que deseas eliminar este servicio permanentemente de la nube?')) {
                                    try {
                                      showToast('Eliminando...', 'success');
                                      const { error } = await supabase.from('servicios').delete().eq('id', row.id);
                                      if (error) throw error;
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
                            )}
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
                  <span className="text-sm text-gray-500 hidden md:inline-block">{services.length} registros</span>
                </div>

                {/* NUEVO BUSCADOR GLOBAL */}
                <div className="flex-1 w-full md:max-w-md relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    placeholder="Buscar reserva, nombre, hotel, vehículo..."
                    value={dbSearchTerm}
                    onChange={(e) => setDbSearchTerm(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm shadow-sm"
                  />
                </div>

                <div className="flex gap-2">
                  <button onClick={descargarRespaldoExcel} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center gap-2 font-medium transition-colors shadow-sm text-sm">
                    <Download size={16} /> Excel
                  </button>
                  <button onClick={saveDatabaseUpdates} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2 font-medium transition-colors shadow-sm text-sm">
                    <Save size={16} /> Guardar
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto overflow-y-auto p-4 w-full">

                {/* --- BARRA DE FILTROS AVANZADOS ADAPTABLE --- */}
                <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-4 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm sm:items-end">
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Agencia</label>
                    <select
                      value={filtroAgenciaGeneral}
                      onChange={(e) => setFiltroAgenciaGeneral(e.target.value)}
                      className="block w-full sm:w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                    >
                      <option value="">Todas las Agencias</option>
                      <option value="USA">USA</option>
                      <option value="EXPEDIA">Expedia</option>
                      <option value="BOOKING">Booking</option>
                      <option value="DIRECTO">Directo</option>
                    </select>
                  </div>

                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Desde (Fecha)</label>
                    <input
                      type="date"
                      value={filtroFechaInicioGeneral}
                      onChange={(e) => setFiltroFechaInicioGeneral(e.target.value)}
                      className="block w-full sm:w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                    />
                  </div>

                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Hasta (Fecha)</label>
                    <input
                      type="date"
                      value={filtroFechaFinGeneral}
                      onChange={(e) => setFiltroFechaFinGeneral(e.target.value)}
                      className="block w-full sm:w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                    />
                  </div>

                  <div className="pb-1 w-full sm:w-auto sm:ml-auto text-right">
                    <button
                      onClick={() => {
                        setFiltroAgenciaGeneral('');
                        setFiltroFechaInicioGeneral('');
                        setFiltroFechaFinGeneral('');
                        setDbSearchTerm('');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 font-bold underline transition-colors"
                    >
                      Limpiar Filtros
                    </button>
                  </div>
                </div>
                {/* --- FIN BARRA DE FILTROS AVANZADOS --- */}

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
                      {userProfile?.rol === 'admin' && (
                        <>
                          <th className="p-2">Proveedor</th>
                          <th className="p-2">Cantidad</th>
                        </>
                      )}<th className="p-2">Extras</th><th className="p-2">Comentarios</th>
                      <th className="p-2 text-center ocultar-en-foto">GPS / Viaje</th>
                      <th className="p-2 text-center">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {(() => {
                      // 1. Filtramos los datos en tiempo real (AHORA CONECTADO A LOS NUEVOS FILTROS)
                      const filteredDatabase = services.filter(s => {
                        // Filtro por Agencia
                        if (filtroAgenciaGeneral && (s.agencia || '').toUpperCase() !== filtroAgenciaGeneral.toUpperCase()) {
                          return false;
                        }
                        // Filtro por Fechas
                        if (filtroFechaInicioGeneral && s.fecha < filtroFechaInicioGeneral) {
                          return false;
                        }
                        if (filtroFechaFinGeneral && s.fecha > filtroFechaFinGeneral) {
                          return false;
                        }

                        // Filtro del Buscador Global de texto
                        if (!dbSearchTerm) return true; // Si la barra de búsqueda está vacía, pasa.

                        const term = dbSearchTerm.toLowerCase();
                        return (
                          (s.nombre || '').toLowerCase().includes(term) ||
                          (s.apellido || '').toLowerCase().includes(term) ||
                          (s.reserva || '').toLowerCase().includes(term) ||
                          (s.hotel || '').toLowerCase().includes(term) ||
                          (s.vehiculo || '').toLowerCase().includes(term) ||
                          (s.chofer || '').toLowerCase().includes(term)
                        );
                      });

                      // 2. Pintamos los datos ya filtrados
                      if (filteredDatabase.length === 0) return <tr><td colSpan="20" className="text-center p-8 text-gray-500">No se encontraron servicios con los filtros actuales.</td></tr>;

                      return filteredDatabase.map(row => (
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
                          {userProfile?.rol === 'admin' && (
                            <>
                              <td className="p-2">
                                <input type="text" value={row.proveedor || ''} onChange={(e) => handleRollChange(row.id, 'proveedor', e.target.value)} className="w-24 bg-transparent border-b border-dashed focus:outline-none" />
                              </td>
                              <td className="p-2">
                                <input type="number" value={row.costoProveedor || ''} onChange={(e) => handleRollChange(row.id, 'costoProveedor', e.target.value)} className="w-16 bg-transparent border-b border-dashed focus:outline-none font-bold text-red-700" />
                              </td>
                            </>
                          )}
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
                              onClick={() => {
                                setTicketDataToPrint(row);
                                setTicketLang('EN');
                              }}
                              className="p-1 text-slate-500 hover:bg-slate-200 rounded mr-1"
                              title="Generar Ticket"
                            >
                              <Ticket size={18} />
                            </button>
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
                      ));
                    })()}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          { }
          {/* --- PESTAÑA: CIERRE Y REPORTES FINANCIEROS --- */}
          {activeTab === 'cierre' && (
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-blue-800">

              {/* NUEVA CABECERA CON BOTONES Y TIPO DE CAMBIO */}
              <div className="flex justify-between items-center flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Database className="text-blue-800" /> Reportes y Cierres Financieros
                  </h2>

                  {/* NUEVO: Cuadro verde para el precio del Dólar */}
                  <div className="flex items-center bg-green-50 border border-green-300 rounded-md p-1 shadow-sm print:hidden">
                    <div className="flex items-center pl-2 pr-1 text-green-700">
                      <DollarSign size={16} className="font-bold" />
                      <span className="text-xs font-bold uppercase mr-1">TC:</span>
                    </div>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={tipoCambioDolar}
                      onChange={(e) => setTipoCambioDolar(e.target.value)}
                      placeholder="Ej. 18.50"
                      className="w-24 bg-white border border-green-200 rounded p-1 text-sm text-green-800 font-bold focus:outline-none focus:ring-1 focus:ring-green-500 text-center"
                      title="Ingresa el precio del Dólar actual"
                    />
                  </div>
                </div>

                {/* BOTONES CHICOS DE EXPORTACIÓN */}
                <div className="flex gap-2 print:hidden">
                  <button
                    onClick={exportarCierrePDF}
                    className="bg-red-50 text-red-700 border border-red-200 px-3 py-1 rounded text-xs font-bold hover:bg-red-100 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    📄 Exportar PDF
                  </button>
                  <button
                    onClick={exportarCierreExcel}
                    className="bg-green-50 text-green-700 border border-green-200 px-3 py-1 rounded text-xs font-bold hover:bg-green-100 transition-colors flex items-center gap-1 shadow-sm"
                  >
                    📊 Exportar Excel
                  </button>
                </div>
              </div>
              {/* FIN DE LA NUEVA CABECERA */}

              {/* PANEL DE FILTROS ADAPTABLE */}
              <div className="flex flex-col sm:flex-row flex-wrap gap-4 mb-6 bg-gray-50 p-4 rounded-lg border border-gray-200 shadow-sm sm:items-end">
                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Origen de Datos</label>
                  <select
                    value={cierreFiltroTipo}
                    onChange={(e) => setCierreFiltroTipo(e.target.value)}
                    className="block w-full sm:w-48 border border-gray-300 rounded-md shadow-sm p-2 text-sm font-bold text-blue-800 focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                  >
                    <option value="general">Ingresos: Base General</option>
                    <option value="callcenter">Ingresos: Call Center</option>
                    <option value="gastos">Egresos: Gastos de Flota</option>
                  </select>
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Fecha Inicial</label>
                  <input
                    type="date"
                    value={cierreFiltroInicio}
                    onChange={(e) => setCierreFiltroInicio(e.target.value)}
                    className="block w-full sm:w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                  />
                </div>

                <div className="w-full sm:w-auto">
                  <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Fecha Final</label>
                  <input
                    type="date"
                    value={cierreFiltroFin}
                    onChange={(e) => setCierreFiltroFin(e.target.value)}
                    className="block w-full sm:w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                  />
                </div>

                {/* Filtro de Vehículo (Solo visible para General y Gastos) */}
                {(cierreFiltroTipo === 'general' || cierreFiltroTipo === 'gastos') && (
                  <div className="w-full sm:w-auto">
                    <label className="block text-xs font-bold text-gray-700 mb-1 uppercase">Vehículo</label>
                    <select
                      value={cierreFiltroVehiculo}
                      onChange={(e) => setCierreFiltroVehiculo(e.target.value)}
                      className="block w-full sm:w-40 border border-gray-300 rounded-md shadow-sm p-2 text-sm focus:ring-blue-500 focus:border-blue-500 cursor-pointer bg-white"
                    >
                      <option value="">Todos los vehículos</option>
                      <option value="Expedition">Expedition</option>
                      <option value="Hiace">Hiace</option>
                    </select>
                  </div>
                )}

                <div className="pb-1 w-full sm:w-auto sm:ml-auto text-right">
                  <button
                    onClick={() => {
                      setCierreFiltroInicio(''); setCierreFiltroFin(''); setCierreFiltroVehiculo('');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 font-bold underline transition-colors"
                  >
                    Limpiar Filtros
                  </button>
                </div>
              </div>
              {/* FIN PANEL DE FILTROS ADAPTABLE */}

              {/* TABLA DINÁMICA DE RESULTADOS */}
              <div className="overflow-x-auto w-full border border-gray-200 rounded-lg">
                {(() => {
                  // LÓGICA DE FILTRADO DEPENDIENDO DEL TIPO SELECCIONADO
                  let filteredData = [];
                  let totalAmount = 0;

                  if (cierreFiltroTipo === 'general') {
                    filteredData = services.filter(s => {
                      const passInicio = !cierreFiltroInicio || s.fecha >= cierreFiltroInicio;
                      const passFin = !cierreFiltroFin || s.fecha <= cierreFiltroFin;
                      const passVehiculo = !cierreFiltroVehiculo || (s.vehiculo && s.vehiculo.toLowerCase() === cierreFiltroVehiculo.toLowerCase());
                      return passInicio && passFin && passVehiculo;
                    });
                    totalAmount = filteredData.reduce((sum, s) => sum + (parseFloat(s.cobro) || 0), 0);

                    return (
                      <table id="tabla-cierre-financiero" className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-blue-50">
                          <tr className="text-blue-900 border-b">
                            <th className="p-3">Fecha</th><th className="p-3">Reserva</th><th className="p-3">Nombre</th>
                            <th className="p-3">Vehículo</th><th className="p-3">Chofer</th><th className="p-3 text-right">Cobro (Ingreso)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredData.length === 0 ? <tr><td colSpan="6" className="p-4 text-center text-gray-500">No hay servicios en estas fechas.</td></tr> :
                            filteredData.map(row => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                <td className="p-2 font-medium">{row.fecha}</td><td className="p-2">{row.reserva}</td><td className="p-2 uppercase">{row.nombre} {row.apellido}</td>
                                <td className="p-2">{row.vehiculo}</td><td className="p-2 uppercase text-gray-600">{row.chofer}</td>
                                <td className="p-2 text-right font-bold text-green-700">${parseFloat(row.cobro || 0).toFixed(2)}</td>
                              </tr>
                            ))
                          }
                          <tr className="bg-gray-100 border-t-2 border-gray-300">
                            <td colSpan="5" className="p-3 text-right font-bold text-gray-700 uppercase">Total Ingresos (USD):</td>
                            <td className="p-3 text-right font-black text-green-800 text-lg">${totalAmount.toFixed(2)}</td>
                          </tr>

                          {/* NUEVO: Fila condicional para Pesos (Solo aparece si escribes un número en el cuadro verde) */}
                          {tipoCambioDolar && parseFloat(tipoCambioDolar) > 0 && (
                            <tr className="bg-green-100 border-t border-green-300">
                              <td colSpan="5" className="p-3 text-right">
                                <div className="flex justify-end items-center gap-2">
                                  <span className="font-bold text-green-800 uppercase">Total Estimado en Pesos (MXN):</span>
                                  <span className="text-xs text-green-700 bg-white px-2 py-0.5 rounded-full border border-green-300 font-bold shadow-sm">
                                    x ${parseFloat(tipoCambioDolar).toFixed(2)}
                                  </span>
                                </div>
                              </td>
                              <td className="p-3 text-right font-black text-green-900 text-xl">
                                ${(totalAmount * parseFloat(tipoCambioDolar)).toFixed(2)}
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    );
                  }

                  else if (cierreFiltroTipo === 'callcenter') {
                    // Asumiendo que tienes una variable de estado para los datos del call center (ej. callCenterData)
                    // Si no la tienes guardada en memoria general, usa el array vacío por ahora
                    const dataCC = typeof callCenterData !== 'undefined' ? callCenterData : [];
                    filteredData = dataCC.filter(c => {
                      const passInicio = !cierreFiltroInicio || c.fecha_sistema >= cierreFiltroInicio;
                      const passFin = !cierreFiltroFin || c.fecha_sistema <= cierreFiltroFin;
                      return passInicio && passFin;
                    });
                    totalAmount = filteredData.reduce((sum, c) => sum + (parseFloat(c.comision) || 0), 0);

                    return (
                      <table id="tabla-cierre-financiero" className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-purple-50">
                          <tr className="text-purple-900 border-b">
                            <th className="p-3">Fecha</th><th className="p-3">Reserva</th><th className="p-3">Cliente</th>
                            <th className="p-3">Acción</th><th className="p-3 text-right">Comisión</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredData.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay registros de Call Center en estas fechas.</td></tr> :
                            filteredData.map(row => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                <td className="p-2 font-medium">{row.fecha_sistema}</td><td className="p-2">{row.reserva}</td><td className="p-2 uppercase">{row.cliente}</td>
                                <td className="p-2"><span className="px-2 py-1 rounded bg-gray-200 text-xs font-bold">{row.accion}</span></td>
                                <td className="p-2 text-right font-bold text-purple-700">${parseFloat(row.comision || 0).toFixed(2)}</td>
                              </tr>
                            ))
                          }
                          <tr className="bg-gray-100 border-t-2 border-gray-300">
                            <td colSpan="4" className="p-3 text-right font-bold text-gray-700 uppercase">Total Comisiones:</td>
                            <td className="p-3 text-right font-black text-purple-800 text-lg">${totalAmount.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  }

                  else if (cierreFiltroTipo === 'gastos') {
                    const dataGastos = typeof gastosFlota !== 'undefined' ? gastosFlota : [];
                    filteredData = dataGastos.filter(g => {
                      const passInicio = !cierreFiltroInicio || g.fecha >= cierreFiltroInicio;
                      const passFin = !cierreFiltroFin || g.fecha <= cierreFiltroFin;
                      const passVehiculo = !cierreFiltroVehiculo || (g.vehiculo && g.vehiculo.toLowerCase() === cierreFiltroVehiculo.toLowerCase());
                      return passInicio && passFin && passVehiculo;
                    });
                    totalAmount = filteredData.reduce((sum, g) => sum + (parseFloat(g.gasto_total) || 0), 0);

                    return (
                      <table id="tabla-cierre-financiero" className="min-w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-orange-50">
                          <tr className="text-orange-900 border-b">
                            <th className="p-3">Fecha</th><th className="p-3">Vehículo</th><th className="p-3">Chofer</th>
                            <th className="p-3">Detalle de Gastos (Sub-total)</th><th className="p-3 text-right">Gasto Total (Egreso)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y">
                          {filteredData.length === 0 ? <tr><td colSpan="5" className="p-4 text-center text-gray-500">No hay gastos registrados en estas fechas.</td></tr> :
                            filteredData.map(row => (
                              <tr key={row.id} className="hover:bg-gray-50">
                                <td className="p-2 font-medium">{row.fecha}</td><td className="p-2">{row.vehiculo}</td><td className="p-2 uppercase">{row.chofer}</td>

                                {/* NUEVA CELDA DINÁMICA DE CONCEPTOS */}
                                <td className="p-2">
                                  <div className="flex flex-col gap-1 text-xs">
                                    {row.concepto && row.concepto.includes('|') ? (
                                      // 1. Lógica para los registros nuevos (Ej. Dua|4000,Gasolina|800)
                                      row.concepto.split(',').map((item, idx) => {
                                        const partes = item.split('|');
                                        return (
                                          <div key={idx} className="flex justify-between w-48 border-b border-gray-100 border-dashed pb-1">
                                            <span className="font-semibold text-gray-600 uppercase">{partes[0]}</span>
                                            <span className="font-bold text-gray-800">${parseFloat(partes[1]).toFixed(2)}</span>
                                          </div>
                                        )
                                      })
                                    ) : (
                                      // 2. Rescate visual para registros viejos (Antes de la actualización)
                                      <>
                                        {row.gasolina > 0 && <div className="flex justify-between w-48 border-b border-gray-100 border-dashed pb-1"><span className="font-semibold text-gray-600 uppercase">GASOLINA</span><span className="font-bold text-gray-800">${parseFloat(row.gasolina).toFixed(2)}</span></div>}
                                        {row.casetas > 0 && <div className="flex justify-between w-48 border-b border-gray-100 border-dashed pb-1"><span className="font-semibold text-gray-600 uppercase">CASETAS</span><span className="font-bold text-gray-800">${parseFloat(row.casetas).toFixed(2)}</span></div>}
                                        {(!row.gasolina && !row.casetas && row.gasto_total > 0) && <div className="flex justify-between w-48 border-b border-gray-100 border-dashed pb-1"><span className="font-semibold text-gray-600 uppercase">{row.concepto || 'VARIOS'}</span><span className="font-bold text-gray-800">${parseFloat(row.gasto_total).toFixed(2)}</span></div>}
                                      </>
                                    )}
                                  </div>
                                </td>

                                <td className="p-2 text-right font-bold text-red-700">${parseFloat(row.gasto_total || 0).toFixed(2)}</td>
                              </tr>
                            ))
                          }
                          <tr className="bg-gray-100 border-t-2 border-gray-300">
                            <td colSpan="4" className="p-3 text-right font-bold text-gray-700 uppercase">Total Egresos:</td>
                            <td className="p-3 text-right font-black text-red-800 text-lg">${totalAmount.toFixed(2)}</td>
                          </tr>
                        </tbody>
                      </table>
                    );
                  }
                })()}
              </div>

            </div>
          )}
          {/* --- NUEVA PESTAÑA: ADMINISTRACIÓN DE USUARIOS --- */}
          {activeTab === 'usuarios' && userProfile?.rol === 'admin' && (
            <div className="bg-white rounded-lg shadow-md p-6 border-t-4 border-red-600">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <ShieldCheck className="text-red-600" /> Administración de Usuarios y Permisos
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Columna Izquierda: Lista de Usuarios */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 flex flex-col">
                  <div className="flex justify-between items-center border-b pb-2 mb-4">
                    <h3 className="font-semibold text-gray-700">Usuarios del Sistema</h3>
                    <button onClick={descargarListaUsuarios} className="text-xs text-blue-600 hover:text-blue-800 font-bold" title="Recargar lista">
                      🔄 Actualizar
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto space-y-2 mb-4 max-h-96">
                    {listaUsuarios.length === 0 ? (
                      <div className="text-sm text-gray-500 text-center py-4">Presiona actualizar para ver la lista</div>
                    ) : (
                      listaUsuarios.map((usr) => (
                        <button
                          key={usr.id}
                          onClick={() => setUsuarioSeleccionado(usr)}
                          className={`w-full text-left p-3 rounded-md border transition-colors flex flex-col ${usuarioSeleccionado?.id === usr.id ? 'bg-red-50 border-red-300' : 'bg-white border-gray-200 hover:bg-gray-100'}`}
                        >
                          <span className="font-bold text-gray-800 text-sm truncate">{usr.email || 'Usuario sin correo'}</span>
                          <span className={`text-xs font-semibold mt-1 w-max px-2 rounded-full ${usr.rol === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {usr.rol === 'admin' ? 'Administrador' : 'Chofer / Staff'}
                          </span>
                        </button>
                      ))
                    )}
                  </div>

                  <button className="mt-auto w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 text-sm font-medium transition-colors shadow-sm">
                    + Agregar Nuevo Usuario
                  </button>
                </div>

                {/* Columna Derecha: Editor de Permisos */}
                <div className="lg:col-span-2 bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col h-full">
                  <h3 className="font-semibold text-gray-700 border-b pb-2 mb-4">Ajustes y Permisos</h3>

                  {!usuarioSeleccionado ? (
                    <div className="text-center py-12 text-gray-400 flex-1 flex flex-col justify-center">
                      <ShieldCheck size={48} className="mx-auto mb-3 opacity-30" />
                      <p className="text-lg font-medium text-gray-500">Selecciona un usuario de la lista</p>
                      <p className="text-sm">Para ver y editar los botones a los que tiene acceso.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col flex-1">

                      {/* Cabecera del Editor */}
                      <div className="mb-6 flex flex-wrap gap-4 justify-between items-center bg-gray-50 p-4 rounded-md border">
                        <div>
                          <p className="text-sm text-gray-500 font-semibold uppercase">Editando perfil de:</p>
                          <p className="text-xl font-bold text-gray-800">{usuarioSeleccionado.email}</p>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nivel de Acceso General</label>
                          <select
                            value={usuarioSeleccionado.rol}
                            onChange={(e) => handleRolChange(e.target.value)}
                            className={`border rounded-md p-2 font-bold focus:outline-none cursor-pointer shadow-sm ${usuarioSeleccionado.rol === 'admin' ? 'bg-red-100 text-red-700 border-red-300' : 'bg-blue-100 text-blue-700 border-blue-300'}`}
                          >
                            <option value="chofer">Chofer / Staff</option>
                            <option value="admin">Administrador Supremo</option>
                          </select>
                        </div>
                      </div>

                      {/* ZONA DE INTERRUPTORES */}
                      <div className="flex-1 overflow-y-auto space-y-6 pr-2">

                        {/* Módulo: Rol Diario */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-700 flex items-center gap-2">
                            <Calendar size={18} className="text-blue-600" /> Módulo: Rol Diario
                          </div>
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white">
                            {Object.keys(usuarioSeleccionado.permisos?.rol_diario || {}).map((llave) => (
                              <label key={llave} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={usuarioSeleccionado.permisos.rol_diario[llave]}
                                  onChange={() => handlePermisoChange('rol_diario', llave)}
                                  className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {llave.replace(/_/g, ' ')}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Módulo: Accesos Principales (Pestañas) */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-purple-100 px-4 py-2 border-b border-purple-200 font-bold text-purple-900 flex items-center gap-2">
                            <Globe size={18} className="text-purple-600" /> Accesos Principales (Menú Superior)
                          </div>
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white">
                            {/* Generamos los botones manualmente para asegurarnos de que existan */}
                            {['ingresar_reserva', 'ingreso_cc', 'control_flota', 'base_de_datos', 'cierre'].map((llave) => (
                              <label key={llave} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-purple-50 rounded border border-transparent hover:border-purple-200 transition-colors">
                                <input
                                  type="checkbox"
                                  // Usamos !! para forzar a booleano, y el ? para que no rompa si la vista es nueva
                                  checked={!!usuarioSeleccionado.permisos?.vistas?.[llave]}
                                  onChange={() => handlePermisoChange('vistas', llave)}
                                  className="w-5 h-5 text-purple-600 rounded border-gray-300 focus:ring-purple-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {llave.replace(/_/g, ' ')}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Módulo: Catálogos */}
                        <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                          <div className="bg-gray-100 px-4 py-2 border-b font-bold text-gray-700 flex items-center gap-2">
                            <Database size={18} className="text-orange-500" /> Módulo: Catálogos
                          </div>
                          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 bg-white">
                            {Object.keys(usuarioSeleccionado.permisos?.catalogos || {}).map((llave) => (
                              <label key={llave} className="flex items-center gap-3 cursor-pointer p-2 hover:bg-gray-50 rounded border border-transparent hover:border-gray-200 transition-colors">
                                <input
                                  type="checkbox"
                                  checked={usuarioSeleccionado.permisos.catalogos[llave]}
                                  onChange={() => handlePermisoChange('catalogos', llave)}
                                  className="w-5 h-5 text-orange-600 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {llave.replace(/_/g, ' ')}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                      </div>

                      {/* Botón Guardar */}
                      <div className="mt-6 pt-4 border-t flex justify-end gap-3">
                        <button
                          onClick={guardarPermisosUsuario}
                          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 font-bold shadow-md flex items-center gap-2 transition-colors"
                        >
                          <Save size={18} /> Guardar Configuración
                        </button>
                      </div>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

        </main>
      </div> {/* <-- ESTA ES LA LÍNEA NUEVA QUE DEBES AGREGAR */}

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
      {/* --- MODAL DEL TICKET DE IMPRESIÓN --- */}
      {ticketDataToPrint && (
        <div className="fixed inset-0 z-[9999] bg-gray-100 overflow-y-auto flex flex-col items-center py-8 px-4 font-sans print:p-0 print:bg-white">

          {/* Controles superiores (se ocultan al imprimir) */}
          <div className="mb-8 flex flex-wrap justify-center gap-4 print:hidden">
            <button
              onClick={() => setTicketLang(ticketLang === 'EN' ? 'ES' : 'EN')}
              className="bg-white border-2 border-slate-900 text-slate-900 font-bold py-2 px-6 rounded-xl transition-colors hover:bg-slate-100 shadow-md"
            >
              🔄 Cambiar a {ticketLang === 'EN' ? 'Español' : 'English'}
            </button>
            <button
              onClick={() => {
                // 1. Conseguimos el folio real del ticket actual (ej. BTS00006)
                // Cambia "currentTicket.folio" o "service.reserva" por la variable exacta donde guardas el folio
                const numeroTicket = currentService?.folio || currentService?.reserva || "00000";

                // 2. Guardamos el título original de la pestaña de tu app
                const tituloOriginal = document.title;

                // 3. LE CAMBIAMOS EL NOMBRE AL ARCHIVO AUTOMÁTICAMENTE
                // Al hacer esto, el navegador usará este texto exacto como nombre por defecto del PDF
                document.title = `TICKET-${numeroTicket}`;

                // 4. EL TRUCO CONTRA LA SEGUNDA HOJA: Creamos un estilo temporal ultra-estricto para la impresión
                const estiloImpresion = document.createElement('style');
                estiloImpresion.innerHTML = `
      @media print {
        @page {
          size: letter !important; /* Forzamos tamaño carta */
          margin: 0mm !important;  /* Cero márgenes del navegador */
        }
        body, html, #root {
          height: 100% !important;
          max-height: 297mm !important; /* Límite físico de la hoja */
          overflow: hidden !important;
          background: white !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        /* Buscamos el contenedor del boleto y lo obligamos a ajustarse perfectamente */
        /* Reemplaza '.max-w-md' por la clase contenedora principal de tu boleto si es diferente */
        .max-w-md, .bg-white, main { 
          max-height: 280mm !important;
          margin: 0 auto !important;
          box-shadow: none !important;
          page-break-inside: avoid !important;
          page-break-after: avoid !important;
        }
      }
    `;
                document.head.appendChild(estiloImpresion);

                // 5. Mandamos a imprimir / Guardar PDF
                window.print();

                // 6. LIMPIEZA: Cuando se cierre el asistente de PDF, regresamos todo a la normalidad
                setTimeout(() => {
                  document.title = tituloOriginal; // Regresa el nombre normal de tu app a la pestaña
                  document.head.removeChild(estiloImpresion); // Quitamos el parche de impresión temporal
                }, 1000);
              }}
              className="bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 text-sm transition-colors"
            >
              🖨️ Imprimir / PDF
            </button>
            {/* BOTÓN REGRESAR AL MENÚ */}
            <button
              onClick={() => {
                // Aquí cerramos la vista del ticket
                // Busca cómo se llama la variable que usas para abrirlo, seguramente es algo como:
                setTicketDataToPrint(null);
              }}
              className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-4 rounded shadow flex items-center gap-2 text-sm transition-colors"
            >
              ⬅️ Regresar al Menú
            </button>
          </div>

          {/* ÁREA DEL TICKET */}
          <div className="w-full max-w-2xl flex justify-center print:w-full">
            <div className="w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col border border-gray-200 print:shadow-none print:border-gray-400 print:rounded-none">

              <div className="bg-slate-900 text-white p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-10">
                  <SuvIcon size={150} />
                </div>

                <div className="relative z-10 flex justify-between items-start">
                  <div>
                    <h1 className="text-3xl font-black tracking-wider text-amber-500 uppercase">Ballard</h1>
                    <p className="text-sm font-medium tracking-widest text-slate-300 uppercase">Tour Services</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-block bg-amber-500 text-slate-900 font-bold px-3 py-1 rounded text-xs tracking-wider mb-2 uppercase">
                      {ticketLang === 'EN' ? 'CONFIRMED' : 'CONFIRMADO'}
                    </div>
                    {/* El folio dinámico: Si no tiene reserva, usa su ID corto */}
                    <p className="font-mono text-sm text-slate-300 uppercase font-bold">Folio: {ticketDataToPrint.reserva || ticketDataToPrint.id.slice(-5)}</p>
                  </div>
                </div>

                <div className="mt-8 flex justify-between items-end relative z-10">
                  <div>
                    <h2 className="text-xl font-bold tracking-wide uppercase">{ticketLang === 'EN' ? 'PRIVATE TRANSPORTATION' : 'TRANSPORTE PRIVADO'}</h2>
                    <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-amber-500" />
                      Boleto Seguro / Safe Ticket
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-4 bg-white">
                <div className="absolute w-full border-t-2 border-dashed border-gray-300 top-1/2"></div>
                <div className="absolute left-0 top-1/2 -mt-3 -ml-3 w-6 h-6 bg-gray-100 print:bg-white rounded-full"></div>
                <div className="absolute right-0 top-1/2 -mt-3 -mr-3 w-6 h-6 bg-gray-100 print:bg-white rounded-full"></div>
              </div>

              <div className="p-8 pb-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{ticketLang === 'EN' ? 'Passenger Name' : 'Nombre del Pasajero'}</p>
                    <p className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase">
                      <User size={18} className="text-amber-500" />
                      {ticketDataToPrint.nombre} {ticketDataToPrint.apellido}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">
                      {ticketLang === 'EN'
                        ? (ticketDataToPrint.tipoServicio === 'Llegada' ? 'Arrival Date & Time' : 'Pick Up Date & Time')
                        : (ticketDataToPrint.tipoServicio === 'Llegada' ? 'Fecha y Hora de Llegada' : 'Fecha y Hora de Pick Up')}
                    </p>
                    <div className="flex flex-col gap-1">
                      <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Calendar size={18} className="text-amber-500" />
                        {ticketDataToPrint.fecha}
                      </p>
                      <p className="text-base font-bold text-slate-800 flex items-center gap-2">
                        <Clock size={18} className="text-amber-500" />
                        {ticketDataToPrint.hora} {ticketDataToPrint.tipoServicio === 'Salida' ? '(Lobby)' : ''}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">PAX</p>
                      <p className="text-lg font-bold text-slate-800 flex items-center gap-2">
                        <Users size={18} className="text-amber-500" />
                        {ticketDataToPrint.pax}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{ticketLang === 'EN' ? 'Flight' : 'Vuelo'}</p>
                      <p className="text-lg font-bold text-slate-800 flex items-center gap-2 uppercase">
                        <Plane size={18} className="text-amber-500" />
                        {ticketDataToPrint.vuelo || 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{ticketLang === 'EN' ? 'Hotel / Destination' : 'Hotel / Destino'}</p>
                    <p className="text-base font-bold text-slate-800 flex items-start gap-2">
                      <MapPin size={18} className="text-amber-500 min-w-max mt-0.5" />
                      <span className="leading-tight uppercase">{ticketDataToPrint.hotel}</span>
                    </p>
                  </div>

                  {/* NUEVA SECCIÓN DE PAGO */}
                  <div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-wider mb-1">{ticketLang === 'EN' ? 'Payment / Method' : 'Cobro / Método'}</p>
                    <p className="text-base font-bold text-slate-800 flex items-center gap-2 uppercase">
                      {/* Ícono de dinero hecho a medida */}
                      <span className="bg-amber-500 text-slate-900 rounded-full w-5 h-5 flex items-center justify-center font-black text-xs">
                        $
                      </span>
                      {/* Lógica: Si hay cobro lo muestra con su método, si está vacío o es 0 dice PREPAGADO */}
                      {ticketDataToPrint.cobro && ticketDataToPrint.cobro !== '0'
                        ? `$${ticketDataToPrint.cobro} ${ticketDataToPrint.metodoPago ? `(${ticketDataToPrint.metodoPago})` : ''}`
                        : (ticketLang === 'EN' ? 'PREPAID' : 'PREPAGADO')}
                    </p>
                  </div>

                </div>
              </div>

              <div className="px-8 flex justify-center mb-6">
                <svg className="h-12 w-full max-w-sm" preserveAspectRatio="none" viewBox="0 0 200 50" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0" y="0" width="4" height="50" className="text-slate-800" /><rect x="6" y="0" width="2" height="50" className="text-slate-800" /><rect x="12" y="0" width="6" height="50" className="text-slate-800" /><rect x="22" y="0" width="2" height="50" className="text-slate-800" /><rect x="26" y="0" width="8" height="50" className="text-slate-800" /><rect x="38" y="0" width="4" height="50" className="text-slate-800" /><rect x="46" y="0" width="2" height="50" className="text-slate-800" /><rect x="52" y="0" width="6" height="50" className="text-slate-800" /><rect x="62" y="0" width="10" height="50" className="text-slate-800" /><rect x="76" y="0" width="4" height="50" className="text-slate-800" /><rect x="84" y="0" width="2" height="50" className="text-slate-800" /><rect x="90" y="0" width="8" height="50" className="text-slate-800" /><rect x="102" y="0" width="4" height="50" className="text-slate-800" /><rect x="110" y="0" width="6" height="50" className="text-slate-800" /><rect x="120" y="0" width="2" height="50" className="text-slate-800" /><rect x="126" y="0" width="8" height="50" className="text-slate-800" /><rect x="138" y="0" width="4" height="50" className="text-slate-800" /><rect x="146" y="0" width="2" height="50" className="text-slate-800" /><rect x="152" y="0" width="12" height="50" className="text-slate-800" /><rect x="168" y="0" width="4" height="50" className="text-slate-800" /><rect x="176" y="0" width="6" height="50" className="text-slate-800" /><rect x="186" y="0" width="2" height="50" className="text-slate-800" /><rect x="192" y="0" width="8" height="50" className="text-slate-800" />
                </svg>
              </div>

              {/* INSTRUCCIONES DINÁMICAS (Llegada vs Salida / EN vs ES) */}
              <div className="bg-amber-50 p-6 mx-4 rounded-xl border border-amber-200 mb-4">
                <h3 className="text-sm font-bold text-amber-900 flex items-center gap-2 mb-2">
                  <Info size={16} />
                  {ticketDataToPrint.tipoServicio === 'Llegada'
                    ? (ticketLang === 'EN' ? 'How to spot your driver upon arrival?' : '¿Cómo ubicar a su chofer al llegar?')
                    : (ticketLang === 'EN' ? 'Pick-up Instructions' : 'Instrucciones de Pick-up')}
                </h3>
                <p className="text-sm text-amber-800/80 leading-relaxed text-justify">
                  {ticketDataToPrint.tipoServicio === 'Llegada'
                    ? (ticketLang === 'EN'
                      ? 'All transport companies are waiting outside the departure gate. You just have to walk to the parking lot to look for your name on a sign. We are usually located in Shadow 3 or Terminal 1 is "SALIDA DE GRUPOS". So when you get there, just walk into the parking lot and you will see some staff members standing under these curtains holding up their signs, one of them will have your name on it.'
                      : 'Todas las empresas de transporte esperan afuera de la puerta de salida. Camine al estacionamiento y busque su nombre en un letrero. Usualmente estamos en la Sombra 3 o Terminal 1 "SALIDA DE GRUPOS". Al llegar, camine al estacionamiento y verá a nuestro personal bajo los toldos con su letrero.')
                    : (ticketLang === 'EN'
                      ? 'Please be ready in the hotel lobby 15 minutes before your scheduled pick-up time. Look for the driver holding a Ballard Tour Services sign. If you have any issues, please contact us immediately.'
                      : 'Por favor, esté listo en el lobby del hotel 15 minutos antes de su hora programada de pick-up. Busque al chofer con el letrero de Ballard Tour Services. Si tiene algún problema, contáctenos de inmediato.')}
                </p>
              </div>

              <div className="px-6 pb-6 text-center">
                <h3 className="text-sm font-bold text-slate-800 mb-1 flex items-center justify-center gap-2">
                  <Map size={16} className="text-slate-500" />
                  {ticketLang === 'EN' ? 'You need other activities?' : '¿Buscas otras actividades?'}
                </h3>
                <p className="text-xs text-slate-500">
                  {ticketLang === 'EN'
                    ? 'We can take you to see the Arch of Los Cabos, ride a motorcycle, get to know the Historic Center of San Jose del Cabo, the Hotel California in Todos Santos, and much more...'
                    : 'Podemos llevarte a conocer el Arco de Los Cabos, pasear en cuatrimoto, conocer el Centro Histórico de San José del Cabo, el Hotel California en Todos Santos y mucho más...'}
                </p>
              </div>

              <div className="bg-slate-900 text-slate-300 p-4 text-xs flex flex-col md:flex-row justify-between items-center gap-3">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1"><Phone size={14} className="text-amber-500" /> +52 624 139 3497</span>
                  <span className="flex items-center gap-1 hidden sm:flex"><Mail size={14} className="text-amber-500" /> reservationballard@gmail.com</span>
                </div>
                <span className="flex items-center gap-1"><Globe size={14} className="text-amber-500" /> www.ballardtours.com</span>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}