import React, { useState, useMemo } from 'react';
import {
  DollarSign, Search, Filter, CheckSquare, Square, FileText, Download,
  CheckCircle, AlertCircle, Clock, CreditCard, Banknote, Building2,
  Calendar, MapPin, User, Car, RefreshCw, Edit3, X, Save, Receipt,
  ArrowUpDown, ShieldCheck, Layers, Trash2
} from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// ============================================================================
// ESTILOS VECTORIALES PARA EL TICKET / COMPROBANTE PDF NATIVO (@react-pdf/renderer)
// ============================================================================
const pdfTicketStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 9,
    color: '#1e293b',
    backgroundColor: '#ffffff'
  },
  headerBanner: {
    backgroundColor: '#0f172a',
    padding: 18,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f59e0b',
    textTransform: 'uppercase',
    letterSpacing: 1
  },
  brandSubtitle: {
    fontSize: 8,
    color: '#cbd5e1',
    textTransform: 'uppercase',
    marginTop: 2,
    letterSpacing: 1.5
  },
  docBadgeBox: {
    alignItems: 'flex-end'
  },
  docTypeBadge: {
    backgroundColor: '#f59e0b',
    color: '#0f172a',
    fontSize: 8,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: 4,
    textTransform: 'uppercase'
  },
  folioText: {
    color: '#f8fafc',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 4
  },
  fechaEmisionText: {
    color: '#94a3b8',
    fontSize: 7.5,
    marginTop: 2
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 16
  },
  summaryCard: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    backgroundColor: '#f8fafc'
  },
  summaryCardDeuda: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fecaca',
    backgroundColor: '#fef2f2'
  },
  summaryCardPagado: {
    flex: 1,
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#bbf7d0',
    backgroundColor: '#f0fdf4'
  },
  summaryLabel: {
    fontSize: 7.5,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 3
  },
  summaryValueGreen: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#15803d',
    marginTop: 3
  },
  summaryValueRed: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#b91c1c',
    marginTop: 3
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingBottom: 4,
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a'
  },
  table: {
    width: '100%',
    marginBottom: 16
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#1e293b',
    color: '#ffffff',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 4
  },
  thText: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#ffffff',
    textTransform: 'uppercase'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center'
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingVertical: 6,
    paddingHorizontal: 6,
    alignItems: 'center'
  },
  cellText: {
    fontSize: 7.5,
    color: '#334155',
    textTransform: 'uppercase'
  },
  cellBold: {
    fontSize: 7.5,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase'
  },
  // Anchos de columna para la tabla detallada
  colFecha: { width: '9%' },
  colReserva: { width: '9%' },
  colProveedor: { width: '11%' },
  colServicio: { width: '16%' },
  colHotel: { width: '15%' },
  colEstado: { width: '9%' },
  colMetodo: { width: '13%' },
  colCosto: { width: '6%', textAlign: 'right' },
  colAbono: { width: '6%', textAlign: 'right' },
  colResta: { width: '6%', textAlign: 'right' },

  badgePagado: {
    backgroundColor: '#dcfce7',
    color: '#166534',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  badgeAbono: {
    backgroundColor: '#fef3c7',
    color: '#92400e',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  badgeDebe: {
    backgroundColor: '#fee2e2',
    color: '#991b1b',
    paddingVertical: 2,
    paddingHorizontal: 4,
    borderRadius: 3,
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    textAlign: 'center'
  },
  footerBox: {
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 7.5,
    color: '#64748b'
  },
  signatureArea: {
    marginTop: 28,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  signatureLine: {
    width: 160,
    borderTopWidth: 1,
    borderTopColor: '#64748b',
    paddingTop: 4,
    alignItems: 'center'
  },
  signatureLabel: {
    fontSize: 7.5,
    color: '#475569',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  }
});

// ============================================================================
// COMPONENTE DOCUMENTO PDF NATIVO PARA TICKET INDIVIDUAL O MÚLTIPLE
// ============================================================================
const ComprobantePagoPDFDocument = ({ items = [], tituloReporte = 'COMPROBANTE DE PAGO Y ESTADO DE SERVICIOS', folioTicket = '' }) => {
  const fechaImpresion = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
  });

  // Calculamos totales y separamos listas
  let totalCosto = 0;
  let totalPagado = 0;
  let totalPendiente = 0;

  const itemsCalculados = items.map(srv => {
    const costo = parseFloat(srv.costoTotal) || 0;
    const abonado = parseFloat(srv.montoPagado) || 0;
    const pendiente = Math.max(0, costo - abonado);
    totalCosto += costo;
    totalPagado += abonado;
    totalPendiente += pendiente;
    return { ...srv, costo, abonado, pendiente };
  });

  const serviciosPagados = itemsCalculados.filter(i => i.estadoPago === 'PAGADO');
  const serviciosConDeuda = itemsCalculados.filter(i => i.estadoPago !== 'PAGADO');

  // Proveedor(es) involucrados
  const proveedoresUnicos = [...new Set(itemsCalculados.map(i => (i.proveedor || 'SIN PROVEEDOR').toUpperCase()))];
  const textoProveedores = proveedoresUnicos.length <= 3 ? proveedoresUnicos.join(', ') : `${proveedoresUnicos.length} PROVEEDORES`;

  return (
    <Document>
      <Page size="LETTER" style={pdfTicketStyles.page}>
        {/* CABECERA */}
        <View style={pdfTicketStyles.headerBanner}>
          <View>
            <Text style={pdfTicketStyles.brandTitle}>BALLARD TOUR SERVICES</Text>
            <Text style={pdfTicketStyles.brandSubtitle}>{tituloReporte}</Text>
            <Text style={[pdfTicketStyles.fechaEmisionText, { color: '#fcd34d', marginTop: 4 }]}>
              PROVEEDOR(ES): {textoProveedores}
            </Text>
          </View>
          <View style={pdfTicketStyles.docBadgeBox}>
            <Text style={pdfTicketStyles.docTypeBadge}>
              {items.length === 1 ? 'TICKET DE PAGO INDIVIDUAL' : `REPORTE MÚLTIPLE (${items.length} SERVICIOS)`}
            </Text>
            <Text style={pdfTicketStyles.folioText}>FOLIO: {folioTicket}</Text>
            <Text style={pdfTicketStyles.fechaEmisionText}>EMISIÓN: {fechaImpresion}</Text>
          </View>
        </View>

        {/* TARJETAS DE RESUMEN FINANCIERO */}
        <View style={pdfTicketStyles.summaryGrid}>
          <View style={pdfTicketStyles.summaryCard}>
            <Text style={pdfTicketStyles.summaryLabel}>TOTAL SERVICIOS ({itemsCalculados.length})</Text>
            <Text style={pdfTicketStyles.summaryValue}>${totalCosto.toFixed(2)}</Text>
            <Text style={{ fontSize: 6.5, color: '#64748b', marginTop: 2 }}>
              PAGADOS: {serviciosPagados.length} | PENDIENTES/ABONO: {serviciosConDeuda.length}
            </Text>
          </View>
          <View style={pdfTicketStyles.summaryCardPagado}>
            <Text style={[pdfTicketStyles.summaryLabel, { color: '#166534' }]}>TOTAL PAGADO / ABONADO</Text>
            <Text style={pdfTicketStyles.summaryValueGreen}>${totalPagado.toFixed(2)}</Text>
            <Text style={{ fontSize: 6.5, color: '#15803d', marginTop: 2 }}>
              LIQUIDADO A FAVOR DEL PROVEEDOR
            </Text>
          </View>
          <View style={pdfTicketStyles.summaryCardDeuda}>
            <Text style={[pdfTicketStyles.summaryLabel, { color: '#991b1b' }]}>SALDO PENDIENTE (SE DEBE)</Text>
            <Text style={pdfTicketStyles.summaryValueRed}>${totalPendiente.toFixed(2)}</Text>
            <Text style={{ fontSize: 6.5, color: '#b91c1c', marginTop: 2 }}>
              {totalPendiente === 0 ? '¡CUENTA TOTALMENTE LIQUIDADA!' : 'RESTANTE POR LIQUIDAR'}
            </Text>
          </View>
        </View>

        {/* LISTA GENERAL DE TODOS LOS SERVICIOS SELECCIONADOS */}
        <Text style={pdfTicketStyles.sectionTitle}>
          1. DESGLOSE GENERAL DE SERVICIOS SELECCIONADOS ({itemsCalculados.length})
        </Text>

        <View style={pdfTicketStyles.table}>
          <View style={pdfTicketStyles.tableHeader}>
            <Text style={[pdfTicketStyles.colFecha, pdfTicketStyles.thText]}>FECHA</Text>
            <Text style={[pdfTicketStyles.colReserva, pdfTicketStyles.thText]}>RESERVA</Text>
            <Text style={[pdfTicketStyles.colProveedor, pdfTicketStyles.thText]}>PROVEEDOR</Text>
            <Text style={[pdfTicketStyles.colServicio, pdfTicketStyles.thText]}>CLIENTE / SERVICIO</Text>
            <Text style={[pdfTicketStyles.colHotel, pdfTicketStyles.thText]}>HOTEL / DESTINO</Text>
            <Text style={[pdfTicketStyles.colEstado, pdfTicketStyles.thText]}>ESTADO</Text>
            <Text style={[pdfTicketStyles.colMetodo, pdfTicketStyles.thText]}>MÉTODO / REF.</Text>
            <Text style={[pdfTicketStyles.colCosto, pdfTicketStyles.thText]}>TOTAL</Text>
            <Text style={[pdfTicketStyles.colAbono, pdfTicketStyles.thText]}>PAGADO</Text>
            <Text style={[pdfTicketStyles.colResta, pdfTicketStyles.thText]}>DEBE</Text>
          </View>

          {itemsCalculados.map((item, idx) => (
            <View key={item.id || idx} style={idx % 2 === 0 ? pdfTicketStyles.tableRow : pdfTicketStyles.tableRowAlt} wrap={false}>
              <View style={pdfTicketStyles.colFecha}>
                <Text style={pdfTicketStyles.cellBold}>{item.fecha || 'S/F'}</Text>
                <Text style={{ fontSize: 6.5, color: '#64748b' }}>{item.hora || ''}</Text>
              </View>
              <Text style={[pdfTicketStyles.colReserva, pdfTicketStyles.cellBold]}>
                {item.reserva || (item.id ? String(item.id).slice(-5) : 'N/A')}
              </Text>
              <View style={pdfTicketStyles.colProveedor}>
                <Text style={pdfTicketStyles.cellBold}>{item.proveedor || 'SIN ASIGNAR'}</Text>
                <Text style={{ fontSize: 6.5, color: '#64748b' }}>{item.vehiculo || ''}</Text>
              </View>
              <View style={pdfTicketStyles.colServicio}>
                <Text style={pdfTicketStyles.cellBold}>{item.nombre} {item.apellido}</Text>
                <Text style={{ fontSize: 6.5, color: '#475569' }}>
                  {item.tipoServicio || 'SERVICIO'} ({item.pax || 1} PAX)
                </Text>
              </View>
              <Text style={[pdfTicketStyles.colHotel, pdfTicketStyles.cellText]}>
                {item.hotel || 'N/A'}
              </Text>
              <View style={[pdfTicketStyles.colEstado, { paddingRight: 4 }]}>
                <Text style={
                  item.estadoPago === 'PAGADO'
                    ? pdfTicketStyles.badgePagado
                    : item.estadoPago === 'ABONO'
                      ? pdfTicketStyles.badgeAbono
                      : pdfTicketStyles.badgeDebe
                }>
                  {item.estadoPago === 'PAGADO' ? 'PAGADO' : item.estadoPago === 'ABONO' ? 'ABONADO' : 'SE DEBE'}
                </Text>
              </View>
              <View style={pdfTicketStyles.colMetodo}>
                <Text style={pdfTicketStyles.cellBold}>{item.formaPago || 'PENDIENTE'}</Text>
                {item.pagoEnLlegada ? (
                  <Text style={{ fontSize: 6, color: '#0369a1', fontWeight: 'bold' }}>• COBRO LLEGADA (EFECTIVO)</Text>
                ) : null}
                {item.esTransferencia && item.referenciaTransferencia ? (
                  <Text style={{ fontSize: 6, color: '#4338ca', fontWeight: 'bold' }}>REF: {item.referenciaTransferencia}</Text>
                ) : null}
                {item.fechaPago ? (
                  <Text style={{ fontSize: 6, color: '#64748b' }}>F. PAGO: {item.fechaPago}</Text>
                ) : null}
              </View>
              <Text style={[pdfTicketStyles.colCosto, pdfTicketStyles.cellBold]}>
                ${item.costo.toFixed(2)}
              </Text>
              <Text style={[pdfTicketStyles.colAbono, pdfTicketStyles.cellBold, { color: '#15803d' }]}>
                ${item.abonado.toFixed(2)}
              </Text>
              <Text style={[pdfTicketStyles.colResta, pdfTicketStyles.cellBold, { color: item.pendiente > 0 ? '#b91c1c' : '#64748b' }]}>
                ${item.pendiente.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* SECCIÓN SEPARADA: RESUMEN DE SERVICIOS QUE SE DEBEN vs SERVICIOS YA PAGADOS */}
        <View style={{ flexDirection: 'row', gap: 12, marginTop: 4 }} wrap={false}>
          {/* COLUMNA 1: SERVICIOS QUE SE DEBEN / CON SALDO PENDIENTE */}
          <View style={{ flex: 1, borderWidth: 1, borderColor: '#fecaca', borderRadius: 6, padding: 8, backgroundColor: '#fff5f5' }}>
            <Text style={{ fontSize: 8.5, fontWeight: 'bold', color: '#991b1b', marginBottom: 6, textTransform: 'uppercase' }}>
              2. SERVICIOS QUE SE DEBEN / CON SALDO ({serviciosConDeuda.length})
            </Text>
            {serviciosConDeuda.length === 0 ? (
              <Text style={{ fontSize: 7.5, color: '#15803d', fontWeight: 'bold' }}>
                NINGÚN SERVICIO PENDIENTE EN ESTA SELECCIÓN.
              </Text>
            ) : (
              serviciosConDeuda.map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#fecaca', paddingVertical: 3 }}>
                  <Text style={{ fontSize: 7, color: '#1e293b', width: '62%' }}>
                    {s.fecha} • {s.reserva || 'S/R'} • {s.proveedor || 'S/P'} ({s.hotel || 'S/H'})
                  </Text>
                  <Text style={{ fontSize: 7, color: '#92400e', width: '18%', textAlign: 'right' }}>
                    ABONO: ${s.abonado.toFixed(0)}
                  </Text>
                  <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#b91c1c', width: '20%', textAlign: 'right' }}>
                    DEBE: ${s.pendiente.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>

          {/* COLUMNA 2: SERVICIOS YA PAGADOS */}
          <View style={{ flex: 1, borderWidth: 1, borderColor: '#bbf7d0', borderRadius: 6, padding: 8, backgroundColor: '#f0fdf4' }}>
            <Text style={{ fontSize: 8.5, fontWeight: 'bold', color: '#166534', marginBottom: 6, textTransform: 'uppercase' }}>
              3. SERVICIOS YA PAGADOS ({serviciosPagados.length})
            </Text>
            {serviciosPagados.length === 0 ? (
              <Text style={{ fontSize: 7.5, color: '#64748b' }}>
                NINGÚN SERVICIO LIQUIDADO EN ESTA SELECCIÓN.
              </Text>
            ) : (
              serviciosPagados.map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#bbf7d0', paddingVertical: 3 }}>
                  <Text style={{ fontSize: 7, color: '#1e293b', width: '58%' }}>
                    {s.fecha} • {s.reserva || 'S/R'} • {s.proveedor || 'S/P'}
                  </Text>
                  <Text style={{ fontSize: 6.5, color: '#15803d', width: '22%', textAlign: 'right' }}>
                    {s.esTransferencia ? `TRANSF. ${s.referenciaTransferencia || ''}` : s.pagoEnLlegada ? 'LLEGADA (EFECT.)' : (s.formaPago || 'PAGADO')}
                  </Text>
                  <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#166534', width: '20%', textAlign: 'right' }}>
                    ${s.abonado.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {/* NOTAS DE AUDITORÍA SI ES INDIVIDUAL */}
        {itemsCalculados.length === 1 && itemsCalculados[0].notasPago ? (
          <View style={{ marginTop: 10, padding: 8, backgroundColor: '#f8fafc', borderRadius: 4, borderWidth: 1, borderColor: '#cbd5e1' }}>
            <Text style={{ fontSize: 7.5, fontWeight: 'bold', color: '#334155' }}>OBSERVACIONES / NOTAS DE CONTROL:</Text>
            <Text style={{ fontSize: 8, color: '#0f172a', marginTop: 2 }}>{itemsCalculados[0].notasPago}</Text>
          </View>
        ) : null}

        {/* FIRMAS DE CONFORMIDAD */}
        <View style={pdfTicketStyles.signatureArea} wrap={false}>
          <View style={pdfTicketStyles.signatureLine}>
            <Text style={pdfTicketStyles.signatureLabel}>AUTORIZADO POR (BALLARD)</Text>
          </View>
          <View style={pdfTicketStyles.signatureLine}>
            <Text style={pdfTicketStyles.signatureLabel}>RECIBIDO DE CONFORMIDAD (PROVEEDOR)</Text>
          </View>
        </View>

        {/* PIE DE PÁGINA */}
        <View style={pdfTicketStyles.footerBox} wrap={false}>
          <Text style={pdfTicketStyles.footerText}>
            BALLARD TOUR SERVICES • CONTROL FINANCIERO Y LIQUIDACIÓN DE SERVICIOS
          </Text>
          <Text style={pdfTicketStyles.footerText}>
            DOCUMENTO PDF NATIVO • FOLIO {folioTicket}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: CONTROL DE PAGOS Y PROVEEDORES
// ============================================================================
export default function PagosProveedores({
  services = [],
  pagosProveedoresMap = {},
  onSavePagoServicio,
  onBatchSavePagos,
  showToast,
  userProfile
}) {
  // Filtros de búsqueda
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS'); // 'TODOS' | 'DEBE' | 'ABONO' | 'PAGADO'
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('TODOS'); // 'TODOS' | 'LLEGADA' | 'TRANSFERENCIA'
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [soloConProveedorOCosto, setSoloConProveedorOCosto] = useState(false);

  // Selección múltiple (checkboxes para encasillar varias reservas)
  const [seleccionados, setSeleccionados] = useState([]);

  // Modal de edición detallada / registro de abono o liquidación
  const [servicioEditando, setServicioEditando] = useState(null);

  // Modal de vista previa de la lista encasillada (seleccionados)
  const [mostrarResumenSeleccion, setMostrarResumenSeleccion] = useState(false);

  // Modal para liquidar múltiples reservas encasilladas con una misma transferencia/pago
  const [modalLiquidacionMasiva, setModalLiquidacionMasiva] = useState(false);
  const [datosMasivos, setDatosMasivos] = useState({
    estadoPago: 'PAGADO',
    pagoEnLlegada: false,
    esTransferencia: true,
    referenciaTransferencia: '',
    bancoDestino: '',
    fechaPago: new Date().toISOString().split('T')[0],
    autorizadoPor: '',
    notasPago: ''
  });

  // Unificamos cada servicio con su información de pago
  const listaServiciosEnriquecida = useMemo(() => {
    return services.map(srv => {
      const infoPago = pagosProveedoresMap[srv.id] || {};
      // Costo base: costoProveedor si existe, si no cobro, o el guardado en infoPago
      const costoBase = infoPago.costoTotal !== undefined && infoPago.costoTotal !== ''
        ? parseFloat(infoPago.costoTotal) || 0
        : (parseFloat(srv.costoProveedor) || parseFloat(srv.cobro) || 0);

      const estadoPago = (infoPago.estadoPago || srv.estadoPagoProveedor || 'DEBE').toUpperCase();
      let montoPagado = infoPago.montoPagado !== undefined && infoPago.montoPagado !== ''
        ? parseFloat(infoPago.montoPagado) || 0
        : 0;

      if (estadoPago === 'PAGADO' && montoPagado === 0 && costoBase > 0) {
        montoPagado = costoBase;
      }
      if (estadoPago === 'DEBE') {
        montoPagado = 0;
      }

      const saldoPendiente = Math.max(0, costoBase - montoPagado);

      const pagoEnLlegada = Boolean(infoPago.pagoEnLlegada);
      const esTransferencia = Boolean(infoPago.esTransferencia);
      const referenciaTransferencia = (infoPago.referenciaTransferencia || '').toUpperCase();
      const bancoDestino = (infoPago.bancoDestino || '').toUpperCase();
      const fechaPago = infoPago.fechaPago || '';
      const autorizadoPor = (infoPago.autorizadoPor || '').toUpperCase();
      const notasPago = (infoPago.notasPago || '').toUpperCase();

      let formaPago = 'PENDIENTE';
      if (pagoEnLlegada && esTransferencia) formaPago = 'EFECTIVO LLEGADA + TRANSF.';
      else if (pagoEnLlegada) formaPago = 'EFECTIVO EN LLEGADA';
      else if (esTransferencia) formaPago = 'TRANSFERENCIA';
      else if (estadoPago === 'PAGADO') formaPago = (srv.metodoPago || 'EFECTIVO').toUpperCase();

      return {
        ...srv,
        proveedor: (infoPago.proveedor || srv.proveedor || '').toUpperCase(),
        vehiculo: (srv.vehiculo || '').toUpperCase() === 'EXPEDITION' ? 'SUV' : (srv.vehiculo || '').toUpperCase() === 'HIACE' ? 'VAN' : (srv.vehiculo || '').toUpperCase(),
        estadoPago, // 'DEBE' | 'ABONO' | 'PAGADO'
        costoTotal: costoBase,
        montoPagado,
        saldoPendiente,
        pagoEnLlegada,
        esTransferencia,
        referenciaTransferencia,
        bancoDestino,
        fechaPago,
        autorizadoPor,
        notasPago,
        formaPago
      };
    }).sort((a, b) => (b.fecha || '').localeCompare(a.fecha || ''));
  }, [services, pagosProveedoresMap]);

  // Lista única de proveedores para el selector de filtro
  const proveedoresDisponibles = useMemo(() => {
    const setProv = new Set();
    listaServiciosEnriquecida.forEach(s => {
      if (s.proveedor && s.proveedor.trim()) setProv.add(s.proveedor.trim().toUpperCase());
    });
    return Array.from(setProv).sort();
  }, [listaServiciosEnriquecida]);

  // Aplicamos filtros
  const serviciosFiltrados = useMemo(() => {
    return listaServiciosEnriquecida.filter(item => {
      if (soloConProveedorOCosto && !item.proveedor && item.costoTotal <= 0) {
        return false;
      }
      if (filtroEstado !== 'TODOS' && item.estadoPago !== filtroEstado) {
        return false;
      }
      if (filtroProveedor && item.proveedor !== filtroProveedor) {
        return false;
      }
      if (filtroMetodo === 'LLEGADA' && !item.pagoEnLlegada) {
        return false;
      }
      if (filtroMetodo === 'TRANSFERENCIA' && !item.esTransferencia) {
        return false;
      }
      if (fechaInicio && item.fecha < fechaInicio) {
        return false;
      }
      if (fechaFin && item.fecha > fechaFin) {
        return false;
      }
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase();
        const match =
          (item.nombre || '').toLowerCase().includes(q) ||
          (item.apellido || '').toLowerCase().includes(q) ||
          (item.reserva || '').toLowerCase().includes(q) ||
          (item.proveedor || '').toLowerCase().includes(q) ||
          (item.hotel || '').toLowerCase().includes(q) ||
          (item.referenciaTransferencia || '').toLowerCase().includes(q) ||
          (item.chofer || '').toLowerCase().includes(q) ||
          (item.notasPago || '').toLowerCase().includes(q);
        if (!match) return false;
      }
      return true;
    });
  }, [listaServiciosEnriquecida, soloConProveedorOCosto, filtroEstado, filtroProveedor, filtroMetodo, fechaInicio, fechaFin, busqueda]);

  // Totales de la vista filtrada
  const resumenFiltrado = useMemo(() => {
    return serviciosFiltrados.reduce((acc, curr) => {
      acc.totalCosto += curr.costoTotal;
      acc.totalPagado += curr.montoPagado;
      acc.totalPendiente += curr.saldoPendiente;
      if (curr.estadoPago === 'PAGADO') acc.countPagados += 1;
      else if (curr.estadoPago === 'ABONO') acc.countAbonos += 1;
      else acc.countDeben += 1;
      return acc;
    }, { totalCosto: 0, totalPagado: 0, totalPendiente: 0, countPagados: 0, countAbonos: 0, countDeben: 0 });
  }, [serviciosFiltrados]);

  // Servicios actualmente encasillados (seleccionados con checkbox)
  const itemsSeleccionados = useMemo(() => {
    return listaServiciosEnriquecida.filter(s => seleccionados.includes(s.id));
  }, [listaServiciosEnriquecida, seleccionados]);

  const resumenSeleccionados = useMemo(() => {
    return itemsSeleccionados.reduce((acc, curr) => {
      acc.totalCosto += curr.costoTotal;
      acc.totalPagado += curr.montoPagado;
      acc.totalPendiente += curr.saldoPendiente;
      if (curr.estadoPago === 'PAGADO') acc.pagados.push(curr);
      else acc.deben.push(curr);
      return acc;
    }, { totalCosto: 0, totalPagado: 0, totalPendiente: 0, pagados: [], deben: [] });
  }, [itemsSeleccionados]);

  // Alternar selección individual
  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Seleccionar o deseleccionar todos los filtrados
  const toggleSeleccionarTodosFiltrados = () => {
    const idsFiltrados = serviciosFiltrados.map(s => s.id);
    const todosEstanSeleccionados = idsFiltrados.length > 0 && idsFiltrados.every(id => seleccionados.includes(id));
    if (todosEstanSeleccionados) {
      setSeleccionados(prev => prev.filter(id => !idsFiltrados.includes(id)));
    } else {
      const nuevoSet = new Set([...seleccionados, ...idsFiltrados]);
      setSeleccionados(Array.from(nuevoSet));
    }
  };

  // Abrir modal para editar el control de pago de un servicio
  const abrirModalEdicion = (item) => {
    setServicioEditando({
      id: item.id,
      reserva: item.reserva || '',
      nombre: item.nombre || '',
      apellido: item.apellido || '',
      fecha: item.fecha || '',
      hora: item.hora || '',
      tipoServicio: item.tipoServicio || 'LLEGADA',
      hotel: item.hotel || '',
      proveedor: (item.proveedor || '').toUpperCase(),
      costoTotal: item.costoTotal || 0,
      estadoPago: item.estadoPago || 'DEBE',
      montoPagado: item.montoPagado || 0,
      pagoEnLlegada: Boolean(item.pagoEnLlegada),
      esTransferencia: Boolean(item.esTransferencia),
      referenciaTransferencia: (item.referenciaTransferencia || '').toUpperCase(),
      bancoDestino: (item.bancoDestino || '').toUpperCase(),
      fechaPago: item.fechaPago || new Date().toISOString().split('T')[0],
      autorizadoPor: (item.autorizadoPor || '').toUpperCase(),
      notasPago: (item.notasPago || '').toUpperCase()
    });
  };

  // Guardar cambios desde el modal individual
  const guardarEdicionIndividual = async () => {
    if (!servicioEditando) return;
    const costo = parseFloat(servicioEditando.costoTotal) || 0;
    let abonado = parseFloat(servicioEditando.montoPagado) || 0;
    let estado = servicioEditando.estadoPago;

    if (estado === 'PAGADO') {
      abonado = costo;
    } else if (estado === 'DEBE') {
      abonado = 0;
    } else if (estado === 'ABONO') {
      if (abonado >= costo && costo > 0) {
        estado = 'PAGADO';
        abonado = costo;
      } else if (abonado <= 0) {
        estado = 'DEBE';
        abonado = 0;
      }
    }

    await onSavePagoServicio(servicioEditando.id, {
      proveedor: (servicioEditando.proveedor || '').toUpperCase(),
      costoTotal: costo,
      estadoPago: estado,
      montoPagado: abonado,
      pagoEnLlegada: servicioEditando.pagoEnLlegada,
      esTransferencia: servicioEditando.esTransferencia,
      referenciaTransferencia: (servicioEditando.referenciaTransferencia || '').toUpperCase(),
      bancoDestino: (servicioEditando.bancoDestino || '').toUpperCase(),
      fechaPago: servicioEditando.fechaPago,
      autorizadoPor: (servicioEditando.autorizadoPor || '').toUpperCase(),
      notasPago: (servicioEditando.notasPago || '').toUpperCase()
    });

    setServicioEditando(null);
  };

  // Cambio rápido de estado en la fila
  const cambiarEstadoRapido = async (item, nuevoEstado) => {
    const costo = parseFloat(item.costoTotal) || 0;
    let nuevoMontoPagado = item.montoPagado;
    if (nuevoEstado === 'PAGADO') nuevoMontoPagado = costo;
    else if (nuevoEstado === 'DEBE') nuevoMontoPagado = 0;
    else if (nuevoEstado === 'ABONO' && (nuevoMontoPagado <= 0 || nuevoMontoPagado >= costo)) {
      // Si selecciona ABONO rápido, abrimos el modal para que ponga la cantidad exacta abonada
      abrirModalEdicion({ ...item, estadoPago: 'ABONO', montoPagado: costo > 0 ? Math.round(costo / 2) : 0 });
      return;
    }

    await onSavePagoServicio(item.id, {
      proveedor: item.proveedor,
      costoTotal: costo,
      estadoPago: nuevoEstado,
      montoPagado: nuevoMontoPagado,
      pagoEnLlegada: item.pagoEnLlegada,
      esTransferencia: item.esTransferencia,
      referenciaTransferencia: item.referenciaTransferencia,
      bancoDestino: item.bancoDestino,
      fechaPago: nuevoEstado !== 'DEBE' ? (item.fechaPago || new Date().toISOString().split('T')[0]) : '',
      autorizadoPor: item.autorizadoPor,
      notasPago: item.notasPago
    });
  };

  // Aplicar liquidación o actualización masiva a las reservas encasilladas
  const aplicarLiquidacionMasiva = async () => {
    if (itemsSeleccionados.length === 0) return;

    const updatesMap = {};
    itemsSeleccionados.forEach(item => {
      const costo = parseFloat(item.costoTotal) || 0;
      const pagado = datosMasivos.estadoPago === 'PAGADO' ? costo : 0;
      updatesMap[item.id] = {
        proveedor: item.proveedor,
        costoTotal: costo,
        estadoPago: datosMasivos.estadoPago,
        montoPagado: pagado,
        pagoEnLlegada: datosMasivos.pagoEnLlegada,
        esTransferencia: datosMasivos.esTransferencia,
        referenciaTransferencia: (datosMasivos.referenciaTransferencia || '').toUpperCase(),
        bancoDestino: (datosMasivos.bancoDestino || '').toUpperCase(),
        fechaPago: datosMasivos.fechaPago,
        autorizadoPor: (datosMasivos.autorizadoPor || '').toUpperCase(),
        notasPago: (datosMasivos.notasPago || item.notasPago || '').toUpperCase()
      };
    });

    await onBatchSavePagos(updatesMap);
    setModalLiquidacionMasiva(false);
    if (showToast) showToast(`¡${itemsSeleccionados.length} SERVICIOS ACTUALIZADOS CORRECTAMENTE!`);
  };

  // Generar y descargar Ticket / Comprobante en PDF Nativo Vectorial
  const descargarTicketPDFNativo = async (listaItems, tituloPersonalizado) => {
    if (!listaItems || listaItems.length === 0) {
      if (showToast) showToast('SELECCIONA AL MENOS UN SERVICIO PARA GENERAR EL TICKET PDF', 'error');
      return;
    }

    try {
      if (showToast) showToast('GENERANDO TICKET DE PAGO EN PDF NATIVO...');
      const folioTicket = listaItems.length === 1
        ? `PAG-${(listaItems[0].reserva || String(listaItems[0].id).slice(-5)).toUpperCase()}`
        : `LOTE-${Date.now().toString().slice(-6)}`;

      const docInstance = (
        <ComprobantePagoPDFDocument
          items={listaItems}
          tituloReporte={tituloPersonalizado || 'COMPROBANTE DE PAGO Y ESTADO DE SERVICIOS'}
          folioTicket={folioTicket}
        />
      );

      const blob = await pdf(docInstance).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      const fechaHoy = new Date().toISOString().split('T')[0];
      link.download = `TICKET_PAGO_${folioTicket}_${fechaHoy}.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      if (showToast) showToast('¡TICKET DE PAGO PDF NATIVO DESCARGADO CON ÉXITO!');
    } catch (err) {
      console.error('Error generando PDF nativo de pago:', err);
      if (showToast) showToast('ERROR AL GENERAR EL PDF NATIVO', 'error');
    }
  };

  return (
    <div className="space-y-6 uppercase">
      {/* CABECERA Y TARJETAS DE CONTROL FINANCIERO */}
      <div className="bg-white rounded-xl shadow-md p-6 border-t-4 border-indigo-600">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">
              <Receipt className="text-indigo-600" size={28} />
              CONTROL DE PAGOS, ABONOS Y PROVEEDORES
            </h2>
            <p className="text-xs font-semibold text-slate-500 mt-1">
              GESTIONA SERVICIOS QUE SE DEBEN, PAGADOS O ABONADOS, COBROS EN LLEGADA, TRANSFERENCIAS Y EMITE TICKETS PDF NATIVOS.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => descargarTicketPDFNativo(serviciosFiltrados, 'ESTADO DE CUENTA Y SERVICIOS FILTRADOS')}
              className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-2.5 rounded-lg text-xs font-black flex items-center gap-2 shadow-sm transition-colors"
              title="Descargar reporte en PDF nativo de todos los servicios en la tabla actual"
            >
              <Download size={16} /> EXPORTAR LISTA ACTUAL (PDF NATIVO)
            </button>
          </div>
        </div>

        {/* TARJETAS DE RESUMEN */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
            <div className="text-xs font-bold text-slate-500">TOTAL SERVICIOS EN LISTA</div>
            <div className="text-2xl font-black text-slate-800 mt-1">${resumenFiltrado.totalCosto.toFixed(2)}</div>
            <div className="text-[11px] font-bold text-slate-500 mt-1">
              {serviciosFiltrados.length} SERVICIO(S) REGISTRADOS
            </div>
          </div>

          <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
            <div className="text-xs font-bold text-red-700 flex items-center justify-between">
              <span>CANTIDAD QUE SE DEBE</span>
              <span className="bg-red-200 text-red-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                {resumenFiltrado.countDeben} DEBEN / {resumenFiltrado.countAbonos} ABONOS
              </span>
            </div>
            <div className="text-2xl font-black text-red-700 mt-1">${resumenFiltrado.totalPendiente.toFixed(2)}</div>
            <div className="text-[11px] font-bold text-red-600 mt-1">
              SALDO PENDIENTE POR LIQUIDAR
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
            <div className="text-xs font-bold text-emerald-800 flex items-center justify-between">
              <span>TOTAL PAGADO / ABONADO</span>
              <span className="bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full text-[10px] font-black">
                {resumenFiltrado.countPagados} LIQUIDADOS
              </span>
            </div>
            <div className="text-2xl font-black text-emerald-700 mt-1">${resumenFiltrado.totalPagado.toFixed(2)}</div>
            <div className="text-[11px] font-bold text-emerald-600 mt-1">
              PAGOS Y ABONOS REGISTRADOS
            </div>
          </div>

          <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-indigo-800">RESERVAS ENCASILLADAS</span>
              <span className="bg-indigo-600 text-white px-2.5 py-0.5 rounded-full text-xs font-black">
                {itemsSeleccionados.length}
              </span>
            </div>
            <div className="text-sm font-black text-indigo-900 my-1">
              DEBE: <span className="text-red-600">${resumenSeleccionados.totalPendiente.toFixed(2)}</span> | PAGADO: <span className="text-emerald-700">${resumenSeleccionados.totalPagado.toFixed(2)}</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => {
                  if (itemsSeleccionados.length === 0) {
                    if (showToast) showToast('ENCASILLA UNA O MÁS RESERVAS EN LA TABLA PRIMERO', 'error');
                    return;
                  }
                  setMostrarResumenSeleccion(true);
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-1.5 px-2 rounded text-[11px] font-black transition-colors text-center"
              >
                VER DESGLOSE ({itemsSeleccionados.length})
              </button>
              <button
                onClick={() => descargarTicketPDFNativo(itemsSeleccionados, 'COMPROBANTE DE RESERVAS SELECCIONADAS')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 py-1.5 px-2.5 rounded text-[11px] font-black transition-colors flex items-center gap-1"
                title="Generar Ticket PDF de las reservas encasilladas"
              >
                <FileText size={13} /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA FLOTANTE CUANDO HAY RESERVAS ENCASILLADAS */}
      {itemsSeleccionados.length > 0 && (
        <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border border-indigo-700">
          <div className="flex flex-wrap items-center gap-4">
            <div className="bg-amber-500 text-slate-950 font-black px-3 py-1 rounded-lg text-sm flex items-center gap-2">
              <CheckSquare size={18} />
              {itemsSeleccionados.length} RESERVA(S) ENCASILLADA(S)
            </div>
            <div className="text-xs space-x-3">
              <span>TOTAL: <strong className="text-white text-sm">${resumenSeleccionados.totalCosto.toFixed(2)}</strong></span>
              <span>• PAGADO/ABONADO: <strong className="text-emerald-300 text-sm">${resumenSeleccionados.totalPagado.toFixed(2)}</strong> ({resumenSeleccionados.pagados.length} PAGADOS)</span>
              <span>• SE DEBE: <strong className="text-red-300 text-sm">${resumenSeleccionados.totalPendiente.toFixed(2)}</strong> ({resumenSeleccionados.deben.length} PENDIENTES)</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setMostrarResumenSeleccion(true)}
              className="bg-white/15 hover:bg-white/25 text-white px-3 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors"
            >
              <Layers size={15} /> VER LISTA PAGADOS VS SE DEBEN
            </button>
            <button
              onClick={() => setModalLiquidacionMasiva(true)}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 px-3 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors shadow"
            >
              <CheckCircle size={15} /> LIQUIDAR / ASIGNAR TRANSFERENCIA
            </button>
            <button
              onClick={() => descargarTicketPDFNativo(itemsSeleccionados, 'TICKET COMPROBANTE DE RESERVAS ENCASILLADAS')}
              className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 py-2 rounded-lg text-xs font-black flex items-center gap-1.5 transition-colors shadow"
            >
              <Download size={15} /> TICKET PDF NATIVO ({itemsSeleccionados.length})
            </button>
            <button
              onClick={() => setSeleccionados([])}
              className="p-2 text-indigo-200 hover:text-white hover:bg-indigo-800 rounded-lg transition-colors"
              title="Limpiar selección"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE FILTROS */}
      <div className="bg-white rounded-xl shadow-md p-4 border border-slate-200">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
          {/* BUSCADOR */}
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-black text-slate-600 mb-1">BUSCAR (PROVEEDOR, CLIENTE, HOTEL, REF, RESERVA)</label>
            <div className="relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
                placeholder="ESCRIBE PARA FILTRAR..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none uppercase font-semibold"
              />
            </div>
          </div>

          {/* ESTADO DE PAGO */}
          <div>
            <label className="block text-[11px] font-black text-slate-600 mb-1">ESTADO DE PAGO</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="TODOS">TODOS LOS ESTADOS</option>
              <option value="DEBE">🔴 SE DEBE (PENDIENTES)</option>
              <option value="ABONO">🟡 SE ABONÓ (PARCIAL)</option>
              <option value="PAGADO">🟢 YA PAGADOS</option>
            </select>
          </div>

          {/* PROVEEDOR */}
          <div>
            <label className="block text-[11px] font-black text-slate-600 mb-1">PROVEEDOR</label>
            <select
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">TODOS LOS PROVEEDORES</option>
              {proveedoresDisponibles.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          {/* DESDE FECHA */}
          <div>
            <label className="block text-[11px] font-black text-slate-600 mb-1">DESDE FECHA</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold bg-white"
            />
          </div>

          {/* HASTA FECHA */}
          <div>
            <label className="block text-[11px] font-black text-slate-600 mb-1">HASTA FECHA</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold bg-white"
            />
          </div>
        </div>

        {/* FILTROS SECUNDARIOS RÁPIDOS */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-3 pt-3 border-t border-slate-100">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-black text-slate-500">MODALIDAD:</span>
            {['TODOS', 'LLEGADA', 'TRANSFERENCIA'].map(mod => (
              <button
                key={mod}
                onClick={() => setFiltroMetodo(mod)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-black transition-colors ${
                  filtroMetodo === mod
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {mod === 'TODOS' ? 'TODAS' : mod === 'LLEGADA' ? '💵 PAGO EN LLEGADA (EFECTIVO)' : '🏦 TRANSFERENCIA'}
              </button>
            ))}

            <label className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 ml-3 cursor-pointer">
              <input
                type="checkbox"
                checked={soloConProveedorOCosto}
                onChange={(e) => setSoloConProveedorOCosto(e.target.checked)}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
              <span>MOSTRAR SOLO CON PROVEEDOR / CANTIDAD ASIGNADA</span>
            </label>
          </div>

          <button
            onClick={() => {
              setBusqueda('');
              setFiltroEstado('TODOS');
              setFiltroProveedor('');
              setFiltroMetodo('TODOS');
              setFechaInicio('');
              setFechaFin('');
              setSoloConProveedorOCosto(false);
            }}
            className="text-xs font-black text-indigo-600 hover:text-indigo-800 underline"
          >
            LIMPIAR FILTROS
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL DE SERVICIOS Y CONTROL DE PAGOS */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="min-w-max w-full text-left text-xs whitespace-nowrap">
            <thead className="sticky top-0 bg-slate-900 text-white z-10">
              <tr>
                <th className="p-3 text-center w-10">
                  <button
                    onClick={toggleSeleccionarTodosFiltrados}
                    className="text-amber-400 hover:text-amber-300 flex items-center justify-center mx-auto"
                    title="Encasillar / Desmarcar todos los servicios visibles"
                  >
                    {serviciosFiltrados.length > 0 && serviciosFiltrados.every(s => seleccionados.includes(s.id)) ? (
                      <CheckSquare size={18} />
                    ) : (
                      <Square size={18} />
                    )}
                  </button>
                </th>
                <th className="p-3">PROVEEDOR</th>
                <th className="p-3">FECHA / HORA</th>
                <th className="p-3">RESERVA / CLIENTE</th>
                <th className="p-3">SERVICIO / VEHÍCULO</th>
                <th className="p-3">HOTEL / DESTINO</th>
                <th className="p-3 text-center">ESTADO DE PAGO</th>
                <th className="p-3 text-right">COSTO TOTAL</th>
                <th className="p-3 text-right">ABONADO / PAGADO</th>
                <th className="p-3 text-right bg-red-950/40 text-amber-300">CANTIDAD QUE SE DEBE</th>
                <th className="p-3 text-center">PAGO LLEGADA (EFECTIVO)</th>
                <th className="p-3">TRANSFERENCIA / REFERENCIA</th>
                <th className="p-3">CONTROL / NOTAS</th>
                <th className="p-3 text-center">ACCIONES / TICKET</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="14" className="p-10 text-center text-slate-400 font-bold">
                    NO SE ENCONTRARON SERVICIOS CON LOS FILTROS SELECCIONADOS.
                  </td>
                </tr>
              ) : (
                serviciosFiltrados.map(item => {
                  const isSelected = seleccionados.includes(item.id);
                  return (
                    <tr
                      key={item.id}
                      className={`transition-colors ${
                        isSelected
                          ? 'bg-indigo-50/90 hover:bg-indigo-100/70'
                          : item.estadoPago === 'PAGADO'
                            ? 'bg-emerald-50/20 hover:bg-slate-50'
                            : item.estadoPago === 'ABONO'
                              ? 'bg-amber-50/30 hover:bg-slate-50'
                              : 'hover:bg-slate-50'
                      }`}
                    >
                      {/* CHECKBOX ENCASILLAR */}
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSeleccion(item.id)}
                          className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500 cursor-pointer"
                        />
                      </td>

                      {/* PROVEEDOR */}
                      <td className="p-3">
                        <div className="font-black text-slate-900">
                          {item.proveedor || <span className="text-slate-400 italic">SIN PROVEEDOR</span>}
                        </div>
                        {item.chofer && (
                          <div className="text-[10px] text-slate-500 font-bold">CHOFER: {item.chofer}</div>
                        )}
                      </td>

                      {/* FECHA / HORA */}
                      <td className="p-3">
                        <div className="font-bold text-slate-800">{item.fecha || 'S/F'}</div>
                        <div className="text-[10px] text-slate-500 font-bold">{item.hora || ''}</div>
                      </td>

                      {/* RESERVA / CLIENTE */}
                      <td className="p-3">
                        <div className="font-mono text-[11px] font-black text-indigo-700">
                          {item.reserva || `#${String(item.id).slice(-5)}`}
                        </div>
                        <div className="font-bold text-slate-800">
                          {item.nombre} {item.apellido}
                        </div>
                      </td>

                      {/* SERVICIO / VEHÍCULO */}
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                          (item.tipoServicio || '').toUpperCase() === 'LLEGADA'
                            ? 'bg-emerald-100 text-emerald-800'
                            : (item.tipoServicio || '').toUpperCase() === 'SALIDA'
                              ? 'bg-red-100 text-red-800'
                              : 'bg-blue-100 text-blue-800'
                        }`}>
                          {item.tipoServicio || 'SERVICIO'}
                        </span>
                        <div className="text-[10px] font-bold text-slate-500 mt-1">
                          {item.vehiculo || 'S/V'} • {item.pax || 1} PAX
                        </div>
                      </td>

                      {/* HOTEL */}
                      <td className="p-3 font-semibold text-slate-700 max-w-[180px] truncate" title={item.hotel}>
                        {item.hotel || 'N/A'}
                      </td>

                      {/* ESTADO DE PAGO (SELECTOR RÁPIDO) */}
                      <td className="p-3 text-center">
                        <select
                          value={item.estadoPago}
                          onChange={(e) => cambiarEstadoRapido(item, e.target.value)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-black border cursor-pointer focus:outline-none ${
                            item.estadoPago === 'PAGADO'
                              ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                              : item.estadoPago === 'ABONO'
                                ? 'bg-amber-100 text-amber-900 border-amber-300'
                                : 'bg-red-100 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="DEBE">🔴 SE DEBE</option>
                          <option value="ABONO">🟡 SE ABONÓ</option>
                          <option value="PAGADO">🟢 PAGADO</option>
                        </select>
                      </td>

                      {/* COSTO TOTAL */}
                      <td className="p-3 text-right font-bold text-slate-700">
                        ${item.costoTotal.toFixed(2)}
                      </td>

                      {/* ABONADO / PAGADO */}
                      <td className="p-3 text-right font-black text-emerald-700">
                        ${item.montoPagado.toFixed(2)}
                      </td>

                      {/* CANTIDAD QUE SE DEBE */}
                      <td className={`p-3 text-right font-black text-sm ${
                        item.saldoPendiente > 0 ? 'text-red-600 bg-red-50/60' : 'text-slate-400'
                      }`}>
                        ${item.saldoPendiente.toFixed(2)}
                      </td>

                      {/* PAGO EN LLEGADA (COBRO EFECTIVO) */}
                      <td className="p-3 text-center">
                        <button
                          onClick={() => onSavePagoServicio(item.id, {
                            ...item,
                            pagoEnLlegada: !item.pagoEnLlegada
                          })}
                          className={`px-2.5 py-1 rounded-md text-[10px] font-black border transition-colors ${
                            item.pagoEnLlegada
                              ? 'bg-sky-100 text-sky-900 border-sky-300'
                              : 'bg-slate-100 text-slate-400 border-slate-200 hover:text-slate-600'
                          }`}
                          title="Marcar si se pagó en la llegada (cobro de efectivo)"
                        >
                          {item.pagoEnLlegada ? '💵 SÍ (EN LLEGADA)' : 'NO'}
                        </button>
                      </td>

                      {/* TRANSFERENCIA Y NÚMERO DE REFERENCIA */}
                      <td className="p-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => abrirModalEdicion({ ...item, esTransferencia: !item.esTransferencia })}
                            className={`px-2 py-0.5 rounded text-[10px] font-black border ${
                              item.esTransferencia
                                ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                                : 'bg-slate-100 text-slate-400 border-slate-200'
                            }`}
                          >
                            {item.esTransferencia ? '🏦 TRANSF.' : 'SIN TRANSF.'}
                          </button>
                          {item.referenciaTransferencia && (
                            <span className="font-mono text-[11px] font-black text-indigo-900 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                              REF: {item.referenciaTransferencia}
                            </span>
                          )}
                        </div>
                        {item.bancoDestino && (
                          <div className="text-[10px] text-slate-500 font-bold mt-0.5">
                            BANCO: {item.bancoDestino}
                          </div>
                        )}
                      </td>

                      {/* CONTROL ADICIONAL (FECHA PAGO, AUTORIZADO, NOTAS) */}
                      <td className="p-3">
                        {item.fechaPago && (
                          <div className="text-[10px] font-bold text-slate-600">
                            F. PAGO: {item.fechaPago}
                          </div>
                        )}
                        {item.autorizadoPor && (
                          <div className="text-[10px] font-bold text-slate-500">
                            AUT: {item.autorizadoPor}
                          </div>
                        )}
                        {item.notasPago && (
                          <div className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded max-w-[150px] truncate" title={item.notasPago}>
                            {item.notasPago}
                          </div>
                        )}
                      </td>

                      {/* ACCIONES: EDITAR DETALLE / TICKET PDF NATIVO */}
                      <td className="p-3 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => abrirModalEdicion(item)}
                            className="p-1.5 bg-slate-100 hover:bg-indigo-100 text-indigo-700 rounded-lg transition-colors font-bold text-[11px] flex items-center gap-1"
                            title="Registrar Abono, Referencia de Transferencia, Cobro en Llegada o Notas"
                          >
                            <Edit3 size={14} /> EDITAR / ABONAR
                          </button>
                          <button
                            onClick={() => descargarTicketPDFNativo([item], 'COMPROBANTE DE PAGO DE SERVICIO')}
                            className="p-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-lg transition-colors font-black text-[11px] flex items-center gap-1 shadow-xs"
                            title="Descargar Ticket / Comprobante de Pago en PDF Nativo"
                          >
                            <FileText size={14} /> PDF
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODAL 1: EDITAR CONTROL DE PAGO / ABONO / TRANSFERENCIA DE UN SERVICIO    */}
      {/* ========================================================================= */}
      {servicioEditando && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-8">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black flex items-center gap-2 text-amber-400">
                  <Receipt size={20} />
                  CONTROL DE PAGO Y COMPROBANTE DEL SERVICIO
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  RESERVA: {servicioEditando.reserva || 'S/R'} • {servicioEditando.nombre} {servicioEditando.apellido} • {servicioEditando.fecha}
                </p>
              </div>
              <button
                onClick={() => setServicioEditando(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
              {/* DATOS BASE DEL PROVEEDOR Y COSTO */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">PROVEEDOR</label>
                  <input
                    type="text"
                    value={servicioEditando.proveedor}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, proveedor: e.target.value.toUpperCase() }))}
                    placeholder="NOMBRE DEL PROVEEDOR"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold uppercase bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">COSTO TOTAL DEL SERVICIO ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={servicioEditando.costoTotal}
                    onChange={(e) => {
                      const nuevoCosto = parseFloat(e.target.value) || 0;
                      setServicioEditando(prev => ({
                        ...prev,
                        costoTotal: e.target.value,
                        montoPagado: prev.estadoPago === 'PAGADO' ? nuevoCosto : prev.montoPagado
                      }));
                    }}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-black text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">ESTADO DEL PAGO</label>
                  <select
                    value={servicioEditando.estadoPago}
                    onChange={(e) => {
                      const nuevoEst = e.target.value;
                      const costo = parseFloat(servicioEditando.costoTotal) || 0;
                      setServicioEditando(prev => ({
                        ...prev,
                        estadoPago: nuevoEst,
                        montoPagado: nuevoEst === 'PAGADO' ? costo : nuevoEst === 'DEBE' ? 0 : prev.montoPagado
                      }));
                    }}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-black bg-white"
                  >
                    <option value="DEBE">🔴 SE DEBE (PENDIENTE)</option>
                    <option value="ABONO">🟡 SE ABONÓ (PAGO PARCIAL)</option>
                    <option value="PAGADO">🟢 YA ESTÁ PAGADO</option>
                  </select>
                </div>
              </div>

              {/* DESGLOSE DE ABONO Y SALDO QUE SE DEBE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-amber-50/70 p-4 rounded-xl border border-amber-200">
                <div>
                  <label className="block text-[11px] font-black text-amber-900 mb-1">
                    CANTIDAD ABONADA / PAGADA ($)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={servicioEditando.montoPagado}
                    onChange={(e) => {
                      const val = parseFloat(e.target.value) || 0;
                      const costo = parseFloat(servicioEditando.costoTotal) || 0;
                      let est = 'ABONO';
                      if (val <= 0) est = 'DEBE';
                      else if (costo > 0 && val >= costo) est = 'PAGADO';
                      setServicioEditando(prev => ({
                        ...prev,
                        montoPagado: e.target.value,
                        estadoPago: est
                      }));
                    }}
                    className="w-full p-2.5 text-sm border border-amber-400 rounded-lg font-black text-emerald-800 bg-white"
                  />
                </div>

                <div className="flex flex-col justify-center bg-white p-3 rounded-lg border border-red-200">
                  <span className="text-[11px] font-black text-slate-500">CANTIDAD QUE SE DEBE (RESTANTE):</span>
                  <span className="text-2xl font-black text-red-600">
                    ${Math.max(0, (parseFloat(servicioEditando.costoTotal) || 0) - (parseFloat(servicioEditando.montoPagado) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              {/* MODALIDAD: COBRO EN LLEGADA Y TRANSFERENCIA */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* PAGO EN LLEGADA */}
                <label className={`p-4 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  servicioEditando.pagoEnLlegada
                    ? 'border-sky-500 bg-sky-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={servicioEditando.pagoEnLlegada}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, pagoEnLlegada: e.target.checked }))}
                    className="mt-1 w-4 h-4 text-sky-600 rounded"
                  />
                  <div>
                    <div className="text-xs font-black text-slate-800">💵 PAGO EN LA LLEGADA (COBRO EFECTIVO)</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      EL PASAJERO O CHOFER LIQUIDÓ EN EFECTIVO AL MOMENTO DE LA LLEGADA.
                    </div>
                  </div>
                </label>

                {/* SE TRANSFIRIÓ */}
                <label className={`p-4 rounded-xl border-2 cursor-pointer flex items-start gap-3 transition-all ${
                  servicioEditando.esTransferencia
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={servicioEditando.esTransferencia}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, esTransferencia: e.target.checked }))}
                    className="mt-1 w-4 h-4 text-indigo-600 rounded"
                  />
                  <div>
                    <div className="text-xs font-black text-slate-800">🏦 SE TRANSFIRIÓ (TRANSFERENCIA BANCARIA)</div>
                    <div className="text-[11px] text-slate-500 font-semibold mt-0.5">
                      HABILITA EL NÚMERO DE REFERENCIA Y BANCO PARA LLEVAR EL CONTROL.
                    </div>
                  </div>
                </label>
              </div>

              {/* CAMPOS DE TRANSFERENCIA Y CONTROL ADICIONAL */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-[11px] font-black text-indigo-900 mb-1">
                    NÚMERO DE REFERENCIA / FOLIO DE TRANSFERENCIA
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.referenciaTransferencia}
                    onChange={(e) => setServicioEditando(prev => ({
                      ...prev,
                      referenciaTransferencia: e.target.value.toUpperCase(),
                      esTransferencia: e.target.value.trim() ? true : prev.esTransferencia
                    }))}
                    placeholder="EJ. REF-9845120 / SPEI-0012"
                    className="w-full p-2 text-xs border border-indigo-300 rounded-lg font-mono font-black uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">
                    BANCO / CUENTA DESTINO
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.bancoDestino}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, bancoDestino: e.target.value.toUpperCase() }))}
                    placeholder="EJ. BBVA, SANTANDER, BANORTE..."
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">
                    FECHA EN QUE SE REALIZÓ EL PAGO / ABONO
                  </label>
                  <input
                    type="date"
                    value={servicioEditando.fechaPago}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, fechaPago: e.target.value }))}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">
                    PAGADO / AUTORIZADO POR
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.autorizadoPor}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, autorizadoPor: e.target.value.toUpperCase() }))}
                    placeholder="NOMBRE DE QUIEN AUTORIZA O PAGA"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold uppercase bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-black text-slate-600 mb-1">
                    OBSERVACIONES / NOTAS DE CONTROL
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.notasPago}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, notasPago: e.target.value.toUpperCase() }))}
                    placeholder="EJ. SE ABONÓ LA MITAD EN EFECTIVO Y EL RESTO PENDIENTE..."
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-semibold uppercase bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => descargarTicketPDFNativo([servicioEditando], 'COMPROBANTE DE PAGO DE SERVICIO')}
                className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
              >
                <FileText size={15} /> GENERAR TICKET PDF NATIVO
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServicioEditando(null)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  onClick={guardarEdicionIndividual}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Save size={15} /> GUARDAR CONTROL DE PAGO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DESGLOSE DE RESERVAS ENCASILLADAS (TODOS, SE DEBEN Y PAGADOS)    */}
      {/* ========================================================================= */}
      {mostrarResumenSeleccion && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full overflow-hidden border border-slate-200 my-8 flex flex-col">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-amber-400 flex items-center gap-2">
                  <Layers size={20} />
                  RESUMEN DE RESERVAS ENCASILLADAS ({itemsSeleccionados.length} SERVICIOS)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  LISTA COMPLETA DE SERVICIOS SELECCIONADOS, LOS QUE SE DEBEN (CON ABONOS) Y LOS QUE YA SE PAGARON.
                </p>
              </div>
              <button
                onClick={() => setMostrarResumenSeleccion(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* TOTALES DE LA SELECCIÓN */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-slate-50 border border-slate-200 p-4 rounded-xl">
                  <div className="text-xs font-black text-slate-500">COSTO TOTAL DE SELECCIÓN</div>
                  <div className="text-2xl font-black text-slate-900 mt-1">${resumenSeleccionados.totalCosto.toFixed(2)}</div>
                  <div className="text-[11px] font-bold text-slate-500">{itemsSeleccionados.length} SERVICIOS ENCASILLADOS</div>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-xl">
                  <div className="text-xs font-black text-emerald-800">TOTAL YA PAGADO / ABONADO</div>
                  <div className="text-2xl font-black text-emerald-700 mt-1">${resumenSeleccionados.totalPagado.toFixed(2)}</div>
                  <div className="text-[11px] font-bold text-emerald-700">{resumenSeleccionados.pagados.length} SERVICIOS LIQUIDADOS</div>
                </div>
                <div className="bg-red-50 border border-red-200 p-4 rounded-xl">
                  <div className="text-xs font-black text-red-800">CANTIDAD TOTAL QUE SE DEBE</div>
                  <div className="text-2xl font-black text-red-600 mt-1">${resumenSeleccionados.totalPendiente.toFixed(2)}</div>
                  <div className="text-[11px] font-bold text-red-700">{resumenSeleccionados.deben.length} SERVICIOS CON SALDO PENDIENTE</div>
                </div>
              </div>

              {/* 1. LISTA DE TODOS LOS SERVICIOS SELECCIONADOS */}
              <div>
                <h4 className="text-sm font-black text-slate-800 border-b-2 border-slate-800 pb-1.5 mb-3">
                  1. LISTA DE TODOS LOS SERVICIOS SELECCIONADOS ({itemsSeleccionados.length})
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-xl">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-100 text-slate-700 font-black">
                      <tr>
                        <th className="p-2.5">FECHA</th>
                        <th className="p-2.5">RESERVA</th>
                        <th className="p-2.5">PROVEEDOR</th>
                        <th className="p-2.5">CLIENTE / SERVICIO</th>
                        <th className="p-2.5">HOTEL</th>
                        <th className="p-2.5 text-center">ESTADO</th>
                        <th className="p-2.5 text-right">COSTO</th>
                        <th className="p-2.5 text-right">ABONADO</th>
                        <th className="p-2.5 text-right text-red-700">SE DEBE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {itemsSeleccionados.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2.5 font-bold">{s.fecha}</td>
                          <td className="p-2.5 font-mono font-black text-indigo-700">{s.reserva || String(s.id).slice(-5)}</td>
                          <td className="p-2.5 font-black">{s.proveedor || 'S/P'}</td>
                          <td className="p-2.5 font-semibold">{s.nombre} {s.apellido} ({s.tipoServicio})</td>
                          <td className="p-2.5">{s.hotel}</td>
                          <td className="p-2.5 text-center">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                              s.estadoPago === 'PAGADO'
                                ? 'bg-emerald-100 text-emerald-800'
                                : s.estadoPago === 'ABONO'
                                  ? 'bg-amber-100 text-amber-900'
                                  : 'bg-red-100 text-red-800'
                            }`}>
                              {s.estadoPago === 'PAGADO' ? 'PAGADO' : s.estadoPago === 'ABONO' ? 'ABONADO' : 'SE DEBE'}
                            </span>
                          </td>
                          <td className="p-2.5 text-right font-bold">${s.costoTotal.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-bold text-emerald-700">${s.montoPagado.toFixed(2)}</td>
                          <td className="p-2.5 text-right font-black text-red-600">${s.saldoPendiente.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 2. COMPARATIVA LADO A LADO: LOS QUE SE DEBEN vs LOS QUE YA SE PAGARON */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* COLUMNA A: SERVICIOS QUE SE DEBEN (INCLUYE ABONOS PARCIALES) */}
                <div className="border-2 border-red-200 rounded-xl p-4 bg-red-50/30">
                  <h4 className="text-xs font-black text-red-800 uppercase mb-3 flex items-center justify-between">
                    <span>🔴 SERVICIOS QUE SE DEBEN / CON ABONO ({resumenSeleccionados.deben.length})</span>
                    <span>RESTA: ${resumenSeleccionados.totalPendiente.toFixed(2)}</span>
                  </h4>
                  {resumenSeleccionados.deben.length === 0 ? (
                    <div className="text-xs font-bold text-emerald-700 py-4 text-center">
                      ¡NO SE DEBE NINGÚN SERVICIO DE LOS SELECCIONADOS!
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {resumenSeleccionados.deben.map(s => (
                        <div key={s.id} className="bg-white p-3 rounded-lg border border-red-200 flex justify-between items-center text-xs shadow-2xs">
                          <div>
                            <div className="font-black text-slate-800">
                              {s.fecha} • {s.reserva || 'S/R'} • {s.proveedor || 'SIN PROVEEDOR'}
                            </div>
                            <div className="text-[11px] text-slate-600 font-semibold">
                              {s.nombre} {s.apellido} • {s.hotel}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] font-bold text-slate-500">
                              COSTO: ${s.costoTotal.toFixed(2)} | ABONO: ${s.montoPagado.toFixed(2)}
                            </div>
                            <div className="text-sm font-black text-red-600">
                              SE DEBE: ${s.saldoPendiente.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* COLUMNA B: SERVICIOS QUE YA SE PAGARON */}
                <div className="border-2 border-emerald-200 rounded-xl p-4 bg-emerald-50/30">
                  <h4 className="text-xs font-black text-emerald-800 uppercase mb-3 flex items-center justify-between">
                    <span>🟢 SERVICIOS QUE YA SE PAGARON ({resumenSeleccionados.pagados.length})</span>
                    <span>PAGADO: ${resumenSeleccionados.pagados.reduce((a, c) => a + c.montoPagado, 0).toFixed(2)}</span>
                  </h4>
                  {resumenSeleccionados.pagados.length === 0 ? (
                    <div className="text-xs font-bold text-slate-400 py-4 text-center">
                      NO HAY SERVICIOS LIQUIDADOS EN ESTA SELECCIÓN.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {resumenSeleccionados.pagados.map(s => (
                        <div key={s.id} className="bg-white p-3 rounded-lg border border-emerald-200 flex justify-between items-center text-xs shadow-2xs">
                          <div>
                            <div className="font-black text-slate-800">
                              {s.fecha} • {s.reserva || 'S/R'} • {s.proveedor || 'SIN PROVEEDOR'}
                            </div>
                            <div className="text-[11px] text-slate-600 font-semibold">
                              {s.nombre} {s.apellido} • {s.hotel}
                            </div>
                            <div className="text-[10px] font-bold text-indigo-700 mt-0.5">
                              {s.formaPago} {s.referenciaTransferencia ? `• REF: ${s.referenciaTransferencia}` : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded text-[10px] font-black">
                              PAGADO
                            </span>
                            <div className="text-sm font-black text-emerald-700 mt-1">
                              ${s.montoPagado.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-wrap justify-between items-center gap-3">
              <button
                onClick={() => {
                  setMostrarResumenSeleccion(false);
                  setModalLiquidacionMasiva(true);
                }}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-4 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <CheckCircle size={15} /> MARCAR SELECCIÓN COMO PAGADA / ASIGNAR TRANSFERENCIA
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMostrarResumenSeleccion(false)}
                  className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
                >
                  CERRAR
                </button>
                <button
                  onClick={() => descargarTicketPDFNativo(itemsSeleccionados, 'COMPROBANTE Y ESTADO DE SERVICIOS SELECCIONADOS')}
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-1.5 shadow-md"
                >
                  <Download size={16} /> DESCARGAR TICKET PDF NATIVO ({itemsSeleccionados.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LIQUIDAR VARIAS RESERVAS ENCASILLADAS CON UNA TRANSFERENCIA      */}
      {/* ========================================================================= */}
      {modalLiquidacionMasiva && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-amber-400">
                  ACTUALIZACIÓN MASIVA ({itemsSeleccionados.length} RESERVAS)
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  APLICA EL MISMO ESTADO Y REFERENCIA DE TRANSFERENCIA A LOS SERVICIOS ENCASILLADOS.
                </p>
              </div>
              <button onClick={() => setModalLiquidacionMasiva(false)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">NUEVO ESTADO DE PAGO</label>
                <select
                  value={datosMasivos.estadoPago}
                  onChange={(e) => setDatosMasivos(prev => ({ ...prev, estadoPago: e.target.value }))}
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg font-black bg-white"
                >
                  <option value="PAGADO">🟢 YA PAGADO (LIQUIDAR TOTAL)</option>
                  <option value="DEBE">🔴 SE DEBE (MARCAR COMO PENDIENTE)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                  <input
                    type="checkbox"
                    checked={datosMasivos.pagoEnLlegada}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, pagoEnLlegada: e.target.checked }))}
                  />
                  <span className="text-xs font-black">💵 PAGO EN LLEGADA</span>
                </label>
                <label className="p-3 border rounded-xl flex items-center gap-2 cursor-pointer bg-slate-50">
                  <input
                    type="checkbox"
                    checked={datosMasivos.esTransferencia}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, esTransferencia: e.target.checked }))}
                  />
                  <span className="text-xs font-black">🏦 SE TRANSFIRIÓ</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-black text-indigo-900 mb-1">NÚMERO DE REFERENCIA DE TRANSFERENCIA</label>
                <input
                  type="text"
                  value={datosMasivos.referenciaTransferencia}
                  onChange={(e) => setDatosMasivos(prev => ({ ...prev, referenciaTransferencia: e.target.value.toUpperCase() }))}
                  placeholder="EJ. SPEI-9948231"
                  className="w-full p-2.5 text-xs border border-indigo-300 rounded-lg font-mono font-black uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">BANCO DESTINO</label>
                  <input
                    type="text"
                    value={datosMasivos.bancoDestino}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, bancoDestino: e.target.value.toUpperCase() }))}
                    placeholder="EJ. BBVA"
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-black text-slate-600 mb-1">FECHA DE PAGO</label>
                  <input
                    type="date"
                    value={datosMasivos.fechaPago}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, fechaPago: e.target.value }))}
                    className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-600 mb-1">NOTAS / OBSERVACIONES</label>
                <input
                  type="text"
                  value={datosMasivos.notasPago}
                  onChange={(e) => setDatosMasivos(prev => ({ ...prev, notasPago: e.target.value.toUpperCase() }))}
                  placeholder="EJ. LIQUIDACIÓN SEMANAL PROVEEDOR"
                  className="w-full p-2 text-xs border border-slate-300 rounded-lg font-bold uppercase"
                />
              </div>
            </div>

            <div className="bg-slate-100 p-4 border-t border-slate-200 flex justify-end gap-2">
              <button
                onClick={() => setModalLiquidacionMasiva(false)}
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-lg"
              >
                CANCELAR
              </button>
              <button
                onClick={aplicarLiquidacionMasiva}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2 rounded-xl text-xs flex items-center gap-1.5 shadow"
              >
                <Save size={15} /> APLICAR A {itemsSeleccionados.length} SERVICIOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
