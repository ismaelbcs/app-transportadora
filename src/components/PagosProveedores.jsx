import React, { useState, useMemo } from 'react';
import {
  Search, CheckSquare, Square, FileText, Download,
  CheckCircle, Edit3, X, Save, Receipt, Layers
} from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

// ============================================================================
// ESTILOS VECTORIALES SOBRIOS PARA EL COMPROBANTE PDF NATIVO (@react-pdf/renderer)
// ============================================================================
const pdfTicketStyles = StyleSheet.create({
  page: {
    padding: 32,
    fontFamily: 'Helvetica',
    fontSize: 8.5,
    color: '#1e293b',
    backgroundColor: '#ffffff'
  },
  headerBanner: {
    borderBottomWidth: 2,
    borderBottomColor: '#0f172a',
    paddingBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 14
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  brandSubtitle: {
    fontSize: 8.5,
    color: '#475569',
    textTransform: 'uppercase',
    marginTop: 2
  },
  docBadgeBox: {
    alignItems: 'flex-end'
  },
  docTypeBadge: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    color: '#0f172a',
    fontSize: 7.5,
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 7,
    textTransform: 'uppercase'
  },
  folioText: {
    color: '#0f172a',
    fontSize: 9.5,
    fontWeight: 'bold',
    marginTop: 4
  },
  fechaEmisionText: {
    color: '#64748b',
    fontSize: 7.5,
    marginTop: 2
  },
  summaryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
    marginBottom: 14
  },
  summaryCard: {
    flex: 1,
    padding: 9,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    backgroundColor: '#f8fafc'
  },
  summaryLabel: {
    fontSize: 7,
    color: '#64748b',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 3
  },
  summaryValueGreen: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#166534',
    marginTop: 3
  },
  summaryValueRed: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#991b1b',
    marginTop: 3
  },
  sectionTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
    marginBottom: 6,
    paddingBottom: 3,
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8'
  },
  table: {
    width: '100%',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#cbd5e1'
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderBottomWidth: 1,
    borderBottomColor: '#94a3b8',
    paddingVertical: 5,
    paddingHorizontal: 5
  },
  thText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#1e293b',
    textTransform: 'uppercase'
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  tableRowAlt: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#e2e8f0',
    backgroundColor: '#f8fafc',
    paddingVertical: 5,
    paddingHorizontal: 5,
    alignItems: 'center'
  },
  cellText: {
    fontSize: 7,
    color: '#334155',
    textTransform: 'uppercase'
  },
  cellBold: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase'
  },
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
    color: '#166534',
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  badgeAbono: {
    color: '#92400e',
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  badgeDebe: {
    color: '#991b1b',
    fontSize: 6.5,
    fontWeight: 'bold',
    textTransform: 'uppercase'
  },
  footerBox: {
    marginTop: 14,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#cbd5e1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  footerText: {
    fontSize: 7,
    color: '#64748b'
  },
  signatureArea: {
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  signatureLine: {
    width: 160,
    borderTopWidth: 1,
    borderTopColor: '#475569',
    paddingTop: 4,
    alignItems: 'center'
  },
  signatureLabel: {
    fontSize: 7,
    color: '#334155',
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
            <Text style={[pdfTicketStyles.fechaEmisionText, { color: '#334155', marginTop: 3 }]}>
              PROVEEDOR(ES): {textoProveedores}
            </Text>
          </View>
          <View style={pdfTicketStyles.docBadgeBox}>
            <Text style={pdfTicketStyles.docTypeBadge}>
              {items.length === 1 ? 'COMPROBANTE INDIVIDUAL' : `REPORTE DE LOTE (${items.length} SERVICIOS)`}
            </Text>
            <Text style={pdfTicketStyles.folioText}>FOLIO: {folioTicket}</Text>
            <Text style={pdfTicketStyles.fechaEmisionText}>EMISIÓN: {fechaImpresion}</Text>
          </View>
        </View>

        {/* RESUMEN FINANCIERO */}
        <View style={pdfTicketStyles.summaryGrid}>
          <View style={pdfTicketStyles.summaryCard}>
            <Text style={pdfTicketStyles.summaryLabel}>IMPORTE TOTAL ({itemsCalculados.length} SERVICIOS)</Text>
            <Text style={pdfTicketStyles.summaryValue}>${totalCosto.toFixed(2)}</Text>
            <Text style={{ fontSize: 6.5, color: '#64748b', marginTop: 2 }}>
              PAGADOS: {serviciosPagados.length} | PENDIENTES: {serviciosConDeuda.length}
            </Text>
          </View>
          <View style={pdfTicketStyles.summaryCard}>
            <Text style={pdfTicketStyles.summaryLabel}>TOTAL PAGADO / ABONADO</Text>
            <Text style={pdfTicketStyles.summaryValueGreen}>${totalPagado.toFixed(2)}</Text>
            <Text style={{ fontSize: 6.5, color: '#64748b', marginTop: 2 }}>
              IMPORTE CUBIERTO
            </Text>
          </View>
          <View style={pdfTicketStyles.summaryCard}>
            <Text style={pdfTicketStyles.summaryLabel}>SALDO PENDIENTE (SE DEBE)</Text>
            <Text style={pdfTicketStyles.summaryValueRed}>${totalPendiente.toFixed(2)}</Text>
            <Text style={{ fontSize: 6.5, color: '#64748b', marginTop: 2 }}>
              {totalPendiente === 0 ? 'CUENTA LIQUIDADA' : 'POR LIQUIDAR'}
            </Text>
          </View>
        </View>

        {/* TABLA DE SERVICIOS */}
        <Text style={pdfTicketStyles.sectionTitle}>
          1. DESGLOSE DE SERVICIOS ({itemsCalculados.length})
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
                <Text style={{ fontSize: 6, color: '#64748b' }}>{item.hora || ''}</Text>
              </View>
              <Text style={[pdfTicketStyles.colReserva, pdfTicketStyles.cellBold]}>
                {item.reserva || (item.id ? String(item.id).slice(-5) : 'N/A')}
              </Text>
              <View style={pdfTicketStyles.colProveedor}>
                <Text style={pdfTicketStyles.cellBold}>{item.proveedor || 'SIN ASIGNAR'}</Text>
                <Text style={{ fontSize: 6, color: '#64748b' }}>{item.vehiculo || ''}</Text>
              </View>
              <View style={pdfTicketStyles.colServicio}>
                <Text style={pdfTicketStyles.cellBold}>{item.nombre} {item.apellido}</Text>
                <Text style={{ fontSize: 6, color: '#475569' }}>
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
                  <Text style={{ fontSize: 6, color: '#334155' }}>COBRO LLEGADA (EFECTIVO)</Text>
                ) : null}
                {item.esTransferencia && item.referenciaTransferencia ? (
                  <Text style={{ fontSize: 6, color: '#0f172a', fontWeight: 'bold' }}>REF: {item.referenciaTransferencia}</Text>
                ) : null}
                {item.fechaPago ? (
                  <Text style={{ fontSize: 6, color: '#64748b' }}>F. PAGO: {item.fechaPago}</Text>
                ) : null}
              </View>
              <Text style={[pdfTicketStyles.colCosto, pdfTicketStyles.cellBold]}>
                ${item.costo.toFixed(2)}
              </Text>
              <Text style={[pdfTicketStyles.colAbono, pdfTicketStyles.cellBold, { color: '#166534' }]}>
                ${item.abonado.toFixed(2)}
              </Text>
              <Text style={[pdfTicketStyles.colResta, pdfTicketStyles.cellBold, { color: item.pendiente > 0 ? '#991b1b' : '#64748b' }]}>
                ${item.pendiente.toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* SECCIÓN SEPARADA: SERVICIOS QUE SE DEBEN vs SERVICIOS YA PAGADOS */}
        <View style={{ flexDirection: 'row', gap: 10, marginTop: 2 }} wrap={false}>
          <View style={{ flex: 1, borderWidth: 1, borderColor: '#cbd5e1', padding: 8, backgroundColor: '#ffffff' }}>
            <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#991b1b', marginBottom: 5, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 3 }}>
              2. SERVICIOS QUE SE DEBEN / CON SALDO ({serviciosConDeuda.length})
            </Text>
            {serviciosConDeuda.length === 0 ? (
              <Text style={{ fontSize: 7, color: '#64748b' }}>
                NINGÚN SERVICIO PENDIENTE EN ESTA SELECCIÓN.
              </Text>
            ) : (
              serviciosConDeuda.map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9', paddingVertical: 2.5 }}>
                  <Text style={{ fontSize: 6.8, color: '#1e293b', width: '60%' }}>
                    {s.fecha} | {s.reserva || 'S/R'} | {s.proveedor || 'S/P'} ({s.hotel || 'S/H'})
                  </Text>
                  <Text style={{ fontSize: 6.8, color: '#475569', width: '20%', textAlign: 'right' }}>
                    ABONO: ${s.abonado.toFixed(0)}
                  </Text>
                  <Text style={{ fontSize: 6.8, fontWeight: 'bold', color: '#991b1b', width: '20%', textAlign: 'right' }}>
                    DEBE: ${s.pendiente.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>

          <View style={{ flex: 1, borderWidth: 1, borderColor: '#cbd5e1', padding: 8, backgroundColor: '#ffffff' }}>
            <Text style={{ fontSize: 8, fontWeight: 'bold', color: '#166534', marginBottom: 5, textTransform: 'uppercase', borderBottomWidth: 1, borderBottomColor: '#e2e8f0', paddingBottom: 3 }}>
              3. SERVICIOS YA PAGADOS ({serviciosPagados.length})
            </Text>
            {serviciosPagados.length === 0 ? (
              <Text style={{ fontSize: 7, color: '#64748b' }}>
                NINGÚN SERVICIO LIQUIDADO EN ESTA SELECCIÓN.
              </Text>
            ) : (
              serviciosPagados.map((s, i) => (
                <View key={i} style={{ flexDirection: 'row', justifyContent: 'space-between', borderBottomWidth: 0.5, borderBottomColor: '#f1f5f9', paddingVertical: 2.5 }}>
                  <Text style={{ fontSize: 6.8, color: '#1e293b', width: '56%' }}>
                    {s.fecha} | {s.reserva || 'S/R'} | {s.proveedor || 'S/P'}
                  </Text>
                  <Text style={{ fontSize: 6.5, color: '#475569', width: '24%', textAlign: 'right' }}>
                    {s.esTransferencia ? `TRANSF. ${s.referenciaTransferencia || ''}` : s.pagoEnLlegada ? 'LLEGADA (EFECT.)' : (s.formaPago || 'PAGADO')}
                  </Text>
                  <Text style={{ fontSize: 6.8, fontWeight: 'bold', color: '#166534', width: '20%', textAlign: 'right' }}>
                    ${s.abonado.toFixed(2)}
                  </Text>
                </View>
              ))
            )}
          </View>
        </View>

        {itemsCalculados.length === 1 && itemsCalculados[0].notasPago ? (
          <View style={{ marginTop: 10, padding: 7, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1' }}>
            <Text style={{ fontSize: 7, fontWeight: 'bold', color: '#334155' }}>OBSERVACIONES:</Text>
            <Text style={{ fontSize: 7.5, color: '#0f172a', marginTop: 2 }}>{itemsCalculados[0].notasPago}</Text>
          </View>
        ) : null}

        <View style={pdfTicketStyles.signatureArea} wrap={false}>
          <View style={pdfTicketStyles.signatureLine}>
            <Text style={pdfTicketStyles.signatureLabel}>AUTORIZADO POR (BALLARD)</Text>
          </View>
          <View style={pdfTicketStyles.signatureLine}>
            <Text style={pdfTicketStyles.signatureLabel}>RECIBIDO DE CONFORMIDAD (PROVEEDOR)</Text>
          </View>
        </View>

        <View style={pdfTicketStyles.footerBox} wrap={false}>
          <Text style={pdfTicketStyles.footerText}>
            BALLARD TOUR SERVICES • CONTROL ADMINISTRATIVO DE SERVICIOS
          </Text>
          <Text style={pdfTicketStyles.footerText}>
            FOLIO {folioTicket}
          </Text>
        </View>
      </Page>
    </Document>
  );
};

// ============================================================================
// COMPONENTE PRINCIPAL: CONTROL DE PAGOS Y PROVEEDORES (DISEÑO SOBRIO / DESKTOP)
// ============================================================================
export default function PagosProveedores({
  services = [],
  pagosProveedoresMap = {},
  onSavePagoServicio,
  onBatchSavePagos,
  showToast
}) {
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState('TODOS');
  const [filtroProveedor, setFiltroProveedor] = useState('');
  const [filtroMetodo, setFiltroMetodo] = useState('TODOS');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [soloConProveedorOCosto, setSoloConProveedorOCosto] = useState(false);

  const [seleccionados, setSeleccionados] = useState([]);
  const [servicioEditando, setServicioEditando] = useState(null);
  const [mostrarResumenSeleccion, setMostrarResumenSeleccion] = useState(false);
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

  const listaServiciosEnriquecida = useMemo(() => {
    return services.map(srv => {
      const infoPago = pagosProveedoresMap[srv.id] || {};

      // Priorizar siempre el precio actual del servicio (costoProveedor en Rol Diario/BD, o cobro)
      // para que cualquier cambio de precio refleje de inmediato la deuda real
      const costoServicioActual = srv.costoProveedor !== undefined && srv.costoProveedor !== null && String(srv.costoProveedor).trim() !== ''
        ? parseFloat(srv.costoProveedor) || 0
        : (srv.cobro !== undefined && srv.cobro !== null && String(srv.cobro).trim() !== ''
          ? parseFloat(srv.cobro) || 0
          : null);

      const costoBase = costoServicioActual !== null
        ? costoServicioActual
        : (infoPago.costoTotal !== undefined && infoPago.costoTotal !== ''
          ? parseFloat(infoPago.costoTotal) || 0
          : 0);

      const estadoPago = (infoPago.estadoPago || srv.estadoPagoProveedor || 'DEBE').toUpperCase();
      let montoPagado = infoPago.montoPagado !== undefined && infoPago.montoPagado !== ''
        ? parseFloat(infoPago.montoPagado) || 0
        : 0;

      // Si el estado es PAGADO, el monto pagado es el costo actual completo; si es DEBE, es 0
      if (estadoPago === 'PAGADO') {
        montoPagado = costoBase;
      } else if (estadoPago === 'DEBE') {
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
        estadoPago,
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

  const proveedoresDisponibles = useMemo(() => {
    const setProv = new Set();
    listaServiciosEnriquecida.forEach(s => {
      if (s.proveedor && s.proveedor.trim()) setProv.add(s.proveedor.trim().toUpperCase());
    });
    return Array.from(setProv).sort();
  }, [listaServiciosEnriquecida]);

  const serviciosFiltrados = useMemo(() => {
    return listaServiciosEnriquecida.filter(item => {
      if (soloConProveedorOCosto && !item.proveedor && item.costoTotal <= 0) return false;
      if (filtroEstado !== 'TODOS' && item.estadoPago !== filtroEstado) return false;
      if (filtroProveedor && item.proveedor !== filtroProveedor) return false;
      if (filtroMetodo === 'LLEGADA' && !item.pagoEnLlegada) return false;
      if (filtroMetodo === 'TRANSFERENCIA' && !item.esTransferencia) return false;
      if (fechaInicio && item.fecha < fechaInicio) return false;
      if (fechaFin && item.fecha > fechaFin) return false;
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

  const toggleSeleccion = (id) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

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

  const cambiarEstadoRapido = async (item, nuevoEstado) => {
    const costo = parseFloat(item.costoTotal) || 0;
    let nuevoMontoPagado = item.montoPagado;
    if (nuevoEstado === 'PAGADO') nuevoMontoPagado = costo;
    else if (nuevoEstado === 'DEBE') nuevoMontoPagado = 0;
    else if (nuevoEstado === 'ABONO' && (nuevoMontoPagado <= 0 || nuevoMontoPagado >= costo)) {
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
    if (showToast) showToast(`${itemsSeleccionados.length} SERVICIOS ACTUALIZADOS`);
  };

  const descargarTicketPDFNativo = async (listaItems, tituloPersonalizado) => {
    if (!listaItems || listaItems.length === 0) {
      if (showToast) showToast('SELECCIONA AL MENOS UN SERVICIO PARA GENERAR EL PDF', 'error');
      return;
    }

    try {
      if (showToast) showToast('GENERANDO COMPROBANTE PDF...');
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
      link.download = `COMPROBANTE_${folioTicket}_${fechaHoy}.pdf`;
      document.body.appendChild(link);
      link.click();
      setTimeout(() => {
        if (document.body.contains(link)) document.body.removeChild(link);
        URL.revokeObjectURL(url);
      }, 1000);

      if (showToast) showToast('PDF DESCARGADO CORRECTAMENTE');
    } catch (err) {
      console.error('Error generando PDF nativo de pago:', err);
      if (showToast) showToast('ERROR AL GENERAR EL PDF', 'error');
    }
  };

  return (
    <div className="space-y-3 uppercase text-slate-800">
      {/* CABECERA Y RESUMEN ESTILO SISTEMA DE ESCRITORIO */}
      <div className="bg-white border border-slate-300 p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2 tracking-tight">
              <Receipt className="text-slate-700" size={20} />
              CONTROL DE PAGOS, ABONOS Y PROVEEDORES
            </h2>
            <p className="text-[11px] text-slate-500 mt-0.5">
              REGISTRO DE SERVICIOS POR PAGAR, ABONOS, COBROS EN LLEGADA, TRANSFERENCIAS Y COMPROBANTES PDF.
            </p>
          </div>

          <button
            onClick={() => descargarTicketPDFNativo(serviciosFiltrados, 'ESTADO DE CUENTA Y SERVICIOS FILTRADOS')}
            className="bg-slate-800 hover:bg-slate-900 text-white px-3.5 py-2 rounded-sm text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Descargar reporte en PDF nativo de todos los servicios mostrados"
          >
            <Download size={14} /> EXPORTAR LISTA ACTUAL (PDF)
          </button>
        </div>

        {/* MÉTRICAS EN RECUADROS SOBRIOS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
          <div className="border border-slate-300 bg-slate-50 p-3">
            <div className="text-[11px] font-semibold text-slate-500">TOTAL SERVICIOS EN LISTA</div>
            <div className="text-xl font-bold text-slate-900 mt-0.5">${resumenFiltrado.totalCosto.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              {serviciosFiltrados.length} SERVICIO(S)
            </div>
          </div>

          <div className="border border-slate-300 bg-white border-l-4 border-l-red-700 p-3">
            <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
              <span>CANTIDAD QUE SE DEBE</span>
              <span className="text-[10px] font-bold text-red-800 bg-slate-100 border border-slate-300 px-1.5 py-0.5">
                {resumenFiltrado.countDeben} DEBEN / {resumenFiltrado.countAbonos} ABONOS
              </span>
            </div>
            <div className="text-xl font-bold text-red-800 mt-0.5">${resumenFiltrado.totalPendiente.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              SALDO PENDIENTE POR LIQUIDAR
            </div>
          </div>

          <div className="border border-slate-300 bg-white border-l-4 border-l-emerald-700 p-3">
            <div className="text-[11px] font-semibold text-slate-600 flex items-center justify-between">
              <span>TOTAL PAGADO / ABONADO</span>
              <span className="text-[10px] font-bold text-emerald-800 bg-slate-100 border border-slate-300 px-1.5 py-0.5">
                {resumenFiltrado.countPagados} LIQUIDADOS
              </span>
            </div>
            <div className="text-xl font-bold text-emerald-800 mt-0.5">${resumenFiltrado.totalPagado.toFixed(2)}</div>
            <div className="text-[11px] text-slate-500 mt-0.5">
              PAGOS Y ABONOS REGISTRADOS
            </div>
          </div>

          <div className="border border-slate-300 bg-slate-50 p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-600">SELECCIONADOS</span>
              <span className="bg-slate-800 text-white px-2 py-0.5 text-[11px] font-bold">
                {itemsSeleccionados.length}
              </span>
            </div>
            <div className="text-xs font-bold text-slate-800 my-1">
              DEBE: <span className="text-red-800">${resumenSeleccionados.totalPendiente.toFixed(2)}</span> | PAGADO: <span className="text-emerald-800">${resumenSeleccionados.totalPagado.toFixed(2)}</span>
            </div>
            <div className="flex gap-1.5 mt-1">
              <button
                onClick={() => {
                  if (itemsSeleccionados.length === 0) {
                    if (showToast) showToast('SELECCIONA UNA O MÁS RESERVAS EN LA TABLA', 'error');
                    return;
                  }
                  setMostrarResumenSeleccion(true);
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-900 text-white py-1 px-2 text-[11px] font-semibold transition-colors text-center"
              >
                VER DESGLOSE ({itemsSeleccionados.length})
              </button>
              <button
                onClick={() => descargarTicketPDFNativo(itemsSeleccionados, 'COMPROBANTE DE RESERVAS SELECCIONADAS')}
                className="bg-white hover:bg-slate-100 text-slate-800 border border-slate-400 py-1 px-2.5 text-[11px] font-semibold transition-colors flex items-center gap-1"
                title="Descargar PDF de las reservas seleccionadas"
              >
                <FileText size={12} /> PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* BARRA DE ACCIÓN CUANDO HAY RESERVAS SELECCIONADAS */}
      {itemsSeleccionados.length > 0 && (
        <div className="bg-slate-800 text-white p-3 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 border border-slate-900">
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-slate-700 border border-slate-500 text-white font-bold px-2.5 py-1 text-xs flex items-center gap-1.5">
              <CheckSquare size={15} />
              {itemsSeleccionados.length} RESERVA(S) SELECCIONADA(S)
            </div>
            <div className="text-xs space-x-3 text-slate-200">
              <span>TOTAL: <strong className="text-white">${resumenSeleccionados.totalCosto.toFixed(2)}</strong></span>
              <span>| PAGADO: <strong className="text-emerald-300">${resumenSeleccionados.totalPagado.toFixed(2)}</strong> ({resumenSeleccionados.pagados.length})</span>
              <span>| SE DEBE: <strong className="text-red-300">${resumenSeleccionados.totalPendiente.toFixed(2)}</strong> ({resumenSeleccionados.deben.length})</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
            <button
              onClick={() => setMostrarResumenSeleccion(true)}
              className="bg-slate-700 hover:bg-slate-600 border border-slate-500 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Layers size={14} /> VER LISTA PAGADOS VS SE DEBEN
            </button>
            <button
              onClick={() => setModalLiquidacionMasiva(true)}
              className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <CheckCircle size={14} /> LIQUIDAR / ASIGNAR TRANSFERENCIA
            </button>
            <button
              onClick={() => descargarTicketPDFNativo(itemsSeleccionados, 'COMPROBANTE DE RESERVAS SELECCIONADAS')}
              className="bg-white hover:bg-slate-100 text-slate-900 px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <Download size={14} /> DESCARGAR PDF ({itemsSeleccionados.length})
            </button>
            <button
              onClick={() => setSeleccionados([])}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
              title="Limpiar selección"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* BARRA DE FILTROS SOBRIA */}
      <div className="bg-white border border-slate-300 p-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5 items-end">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-600 mb-1">BUSCAR (PROVEEDOR, CLIENTE, HOTEL, REF, RESERVA)</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2 text-slate-400" size={14} />
              <input
                type="text"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value.toUpperCase())}
                placeholder="FILTRAR..."
                className="w-full pl-8 pr-3 py-1.5 text-xs border border-slate-300 focus:border-slate-600 focus:outline-none uppercase"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">ESTADO DE PAGO</label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 bg-white focus:border-slate-600 focus:outline-none"
            >
              <option value="TODOS">TODOS LOS ESTADOS</option>
              <option value="DEBE">SE DEBE (PENDIENTES)</option>
              <option value="ABONO">SE ABONÓ (PARCIAL)</option>
              <option value="PAGADO">YA PAGADOS</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">PROVEEDOR</label>
            <select
              value={filtroProveedor}
              onChange={(e) => setFiltroProveedor(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 bg-white focus:border-slate-600 focus:outline-none"
            >
              <option value="">TODOS LOS PROVEEDORES</option>
              {proveedoresDisponibles.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">DESDE FECHA</label>
            <input
              type="date"
              value={fechaInicio}
              onChange={(e) => setFechaInicio(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 bg-white focus:border-slate-600 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">HASTA FECHA</label>
            <input
              type="date"
              value={fechaFin}
              onChange={(e) => setFechaFin(e.target.value)}
              className="w-full py-1.5 px-2 text-xs border border-slate-300 bg-white focus:border-slate-600 focus:outline-none"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-2.5 pt-2.5 border-t border-slate-200">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-bold text-slate-500 mr-1">MODALIDAD:</span>
            {['TODOS', 'LLEGADA', 'TRANSFERENCIA'].map(mod => (
              <button
                key={mod}
                onClick={() => setFiltroMetodo(mod)}
                className={`px-2.5 py-1 text-[11px] font-semibold border transition-colors ${
                  filtroMetodo === mod
                    ? 'bg-slate-800 text-white border-slate-800'
                    : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-100'
                }`}
              >
                {mod === 'TODOS' ? 'TODAS' : mod === 'LLEGADA' ? 'PAGO EN LLEGADA (EFECTIVO)' : 'TRANSFERENCIA'}
              </button>
            ))}

            <label className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-600 ml-3 cursor-pointer">
              <input
                type="checkbox"
                checked={soloConProveedorOCosto}
                onChange={(e) => setSoloConProveedorOCosto(e.target.checked)}
                className="border-slate-400 text-slate-800 focus:ring-0"
              />
              <span>SOLO CON PROVEEDOR / CANTIDAD ASIGNADA</span>
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
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 underline"
          >
            LIMPIAR FILTROS
          </button>
        </div>
      </div>

      {/* TABLA PRINCIPAL ESTILO HOJA DE CÁLCULO / ERP */}
      <div className="bg-white border border-slate-300 overflow-hidden">
        <div className="overflow-x-auto max-h-[65vh]">
          <table className="min-w-max w-full text-left text-xs whitespace-nowrap border-collapse">
            <thead className="sticky top-0 bg-slate-100 text-slate-700 border-b border-slate-300 z-10">
              <tr>
                <th className="p-2.5 text-center w-9 border-r border-slate-200">
                  <button
                    onClick={toggleSeleccionarTodosFiltrados}
                    className="text-slate-700 hover:text-slate-950 flex items-center justify-center mx-auto"
                    title="Seleccionar / Desmarcar todos los visibles"
                  >
                    {serviciosFiltrados.length > 0 && serviciosFiltrados.every(s => seleccionados.includes(s.id)) ? (
                      <CheckSquare size={15} />
                    ) : (
                      <Square size={15} />
                    )}
                  </button>
                </th>
                <th className="p-2.5 font-bold border-r border-slate-200">PROVEEDOR</th>
                <th className="p-2.5 font-bold border-r border-slate-200">FECHA / HORA</th>
                <th className="p-2.5 font-bold border-r border-slate-200">RESERVA / CLIENTE</th>
                <th className="p-2.5 font-bold border-r border-slate-200">SERVICIO / VEHÍCULO</th>
                <th className="p-2.5 font-bold border-r border-slate-200">HOTEL / DESTINO</th>
                <th className="p-2.5 font-bold text-center border-r border-slate-200">ESTADO DE PAGO</th>
                <th className="p-2.5 font-bold text-right border-r border-slate-200">COSTO TOTAL</th>
                <th className="p-2.5 font-bold text-right border-r border-slate-200">ABONADO / PAGADO</th>
                <th className="p-2.5 font-bold text-right border-r border-slate-200 bg-slate-200/70 text-slate-900">SE DEBE</th>
                <th className="p-2.5 font-bold text-center border-r border-slate-200">PAGO EN LLEGADA</th>
                <th className="p-2.5 font-bold border-r border-slate-200">TRANSFERENCIA / REF.</th>
                <th className="p-2.5 font-bold border-r border-slate-200">CONTROL / NOTAS</th>
                <th className="p-2.5 font-bold text-center">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan="14" className="p-8 text-center text-slate-500 font-semibold">
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
                          ? 'bg-blue-50/60 hover:bg-blue-50'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <td className="p-2.5 text-center border-r border-slate-100">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSeleccion(item.id)}
                          className="w-3.5 h-3.5 text-slate-800 border-slate-400 focus:ring-0 cursor-pointer"
                        />
                      </td>

                      <td className="p-2.5 border-r border-slate-100">
                        <div className="font-bold text-slate-900">
                          {item.proveedor || <span className="text-slate-400 font-normal">SIN PROVEEDOR</span>}
                        </div>
                        {item.chofer && (
                          <div className="text-[10px] text-slate-500">CHOFER: {item.chofer}</div>
                        )}
                      </td>

                      <td className="p-2.5 border-r border-slate-100">
                        <div className="font-semibold text-slate-800">{item.fecha || 'S/F'}</div>
                        <div className="text-[10px] text-slate-500">{item.hora || ''}</div>
                      </td>

                      <td className="p-2.5 border-r border-slate-100">
                        <div className="font-mono text-[11px] font-bold text-slate-600">
                          {item.reserva || `#${String(item.id).slice(-5)}`}
                        </div>
                        <div className="font-semibold text-slate-900">
                          {item.nombre} {item.apellido}
                        </div>
                      </td>

                      <td className="p-2.5 border-r border-slate-100">
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                          (item.tipoServicio || '').toUpperCase() === 'LLEGADA'
                            ? 'bg-slate-100 text-slate-800 border-slate-300'
                            : (item.tipoServicio || '').toUpperCase() === 'SALIDA'
                              ? 'bg-slate-100 text-slate-700 border-slate-300'
                              : 'bg-slate-50 text-slate-700 border-slate-300'
                        }`}>
                          {item.tipoServicio || 'SERVICIO'}
                        </span>
                        <div className="text-[10px] text-slate-500 mt-0.5">
                          {item.vehiculo || 'S/V'} • {item.pax || 1} PAX
                        </div>
                      </td>

                      <td className="p-2.5 text-slate-700 max-w-[180px] truncate border-r border-slate-100" title={item.hotel}>
                        {item.hotel || 'N/A'}
                      </td>

                      <td className="p-2.5 text-center border-r border-slate-100">
                        <select
                          value={item.estadoPago}
                          onChange={(e) => cambiarEstadoRapido(item, e.target.value)}
                          className={`px-2 py-1 text-[11px] font-bold border cursor-pointer focus:outline-none ${
                            item.estadoPago === 'PAGADO'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : item.estadoPago === 'ABONO'
                                ? 'bg-amber-50 text-amber-900 border-amber-300'
                                : 'bg-red-50 text-red-800 border-red-300'
                          }`}
                        >
                          <option value="DEBE">SE DEBE</option>
                          <option value="ABONO">SE ABONÓ</option>
                          <option value="PAGADO">PAGADO</option>
                        </select>
                      </td>

                      <td className="p-2.5 text-right font-semibold text-slate-700 border-r border-slate-100">
                        ${item.costoTotal.toFixed(2)}
                      </td>

                      <td className="p-2.5 text-right font-bold text-emerald-800 border-r border-slate-100">
                        ${item.montoPagado.toFixed(2)}
                      </td>

                      <td className={`p-2.5 text-right font-bold border-r border-slate-100 ${
                        item.saldoPendiente > 0 ? 'text-red-800 bg-red-50/40' : 'text-slate-400'
                      }`}>
                        ${item.saldoPendiente.toFixed(2)}
                      </td>

                      <td className="p-2.5 text-center border-r border-slate-100">
                        <button
                          onClick={() => onSavePagoServicio(item.id, {
                            ...item,
                            pagoEnLlegada: !item.pagoEnLlegada
                          })}
                          className={`px-2 py-0.5 text-[10px] font-bold border transition-colors ${
                            item.pagoEnLlegada
                              ? 'bg-slate-800 text-white border-slate-800'
                              : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
                          }`}
                          title="Marcar si se pagó en la llegada (cobro de efectivo)"
                        >
                          {item.pagoEnLlegada ? 'SÍ (LLEGADA)' : 'NO'}
                        </button>
                      </td>

                      <td className="p-2.5 border-r border-slate-100">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => abrirModalEdicion({ ...item, esTransferencia: !item.esTransferencia })}
                            className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                              item.esTransferencia
                                ? 'bg-slate-800 text-white border-slate-800'
                                : 'bg-white text-slate-500 border-slate-300 hover:bg-slate-100'
                            }`}
                          >
                            {item.esTransferencia ? 'TRANSF.' : 'NO'}
                          </button>
                          {item.referenciaTransferencia && (
                            <span className="font-mono text-[11px] font-bold text-slate-800 bg-slate-100 px-1.5 py-0.5 border border-slate-300">
                              REF: {item.referenciaTransferencia}
                            </span>
                          )}
                        </div>
                        {item.bancoDestino && (
                          <div className="text-[10px] text-slate-500 mt-0.5">
                            BANCO: {item.bancoDestino}
                          </div>
                        )}
                      </td>

                      <td className="p-2.5 border-r border-slate-100">
                        {item.fechaPago && (
                          <div className="text-[10px] text-slate-600">
                            F. PAGO: {item.fechaPago}
                          </div>
                        )}
                        {item.autorizadoPor && (
                          <div className="text-[10px] text-slate-500">
                            AUT: {item.autorizadoPor}
                          </div>
                        )}
                        {item.notasPago && (
                          <div className="text-[10px] text-slate-700 bg-slate-100 px-1.5 py-0.5 border border-slate-200 max-w-[150px] truncate" title={item.notasPago}>
                            {item.notasPago}
                          </div>
                        )}
                      </td>

                      <td className="p-2.5 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => abrirModalEdicion(item)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-[11px] flex items-center gap-1"
                            title="Editar pago, abono o referencia"
                          >
                            <Edit3 size={12} /> EDITAR
                          </button>
                          <button
                            onClick={() => descargarTicketPDFNativo([item], 'COMPROBANTE DE PAGO DE SERVICIO')}
                            className="px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-[11px] flex items-center gap-1"
                            title="Descargar Comprobante en PDF Nativo"
                          >
                            <FileText size={12} /> PDF
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
      {/* MODAL 1: EDITAR CONTROL DE PAGO / ABONO / TRANSFERENCIA                   */}
      {/* ========================================================================= */}
      {servicioEditando && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white shadow-xl max-w-2xl w-full border border-slate-400 my-8">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Receipt size={16} />
                  CONTROL DE PAGO Y COMPROBANTE DEL SERVICIO
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  RESERVA: {servicioEditando.reserva || 'S/R'} | {servicioEditando.nombre} {servicioEditando.apellido} | {servicioEditando.fecha}
                </p>
              </div>
              <button
                onClick={() => setServicioEditando(null)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3 border border-slate-300">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">PROVEEDOR</label>
                  <input
                    type="text"
                    value={servicioEditando.proveedor}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, proveedor: e.target.value.toUpperCase() }))}
                    placeholder="NOMBRE DEL PROVEEDOR"
                    className="w-full p-1.5 text-xs border border-slate-300 font-semibold uppercase bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">COSTO TOTAL ($)</label>
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
                    className="w-full p-1.5 text-xs border border-slate-300 font-bold text-slate-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">ESTADO DEL PAGO</label>
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
                    className="w-full p-1.5 text-xs border border-slate-300 font-bold bg-white"
                  >
                    <option value="DEBE">SE DEBE (PENDIENTE)</option>
                    <option value="ABONO">SE ABONÓ (PARCIAL)</option>
                    <option value="PAGADO">PAGADO</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 border border-slate-300">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
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
                    className="w-full p-2 text-sm border border-slate-400 font-bold text-emerald-800 bg-white"
                  />
                </div>

                <div className="flex flex-col justify-center bg-slate-50 p-3 border border-slate-300">
                  <span className="text-[11px] font-bold text-slate-600">CANTIDAD QUE SE DEBE (RESTANTE):</span>
                  <span className="text-xl font-bold text-red-800">
                    ${Math.max(0, (parseFloat(servicioEditando.costoTotal) || 0) - (parseFloat(servicioEditando.montoPagado) || 0)).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <label className={`p-3 border cursor-pointer flex items-start gap-2.5 ${
                  servicioEditando.pagoEnLlegada
                    ? 'border-slate-800 bg-slate-100'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={servicioEditando.pagoEnLlegada}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, pagoEnLlegada: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 text-slate-800"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">PAGO EN LA LLEGADA (EFECTIVO)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      COBRO EN EFECTIVO AL MOMENTO DE LA LLEGADA.
                    </div>
                  </div>
                </label>

                <label className={`p-3 border cursor-pointer flex items-start gap-2.5 ${
                  servicioEditando.esTransferencia
                    ? 'border-slate-800 bg-slate-100'
                    : 'border-slate-300 bg-white hover:bg-slate-50'
                }`}>
                  <input
                    type="checkbox"
                    checked={servicioEditando.esTransferencia}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, esTransferencia: e.target.checked }))}
                    className="mt-0.5 w-4 h-4 text-slate-800"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">SE TRANSFIRIÓ (TRANSFERENCIA)</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      REGISTRAR NÚMERO DE REFERENCIA Y BANCO.
                    </div>
                  </div>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-slate-50 p-3 border border-slate-300">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    NÚMERO DE REFERENCIA DE TRANSFERENCIA
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
                    className="w-full p-1.5 text-xs border border-slate-300 font-mono font-bold uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    BANCO / CUENTA DESTINO
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.bancoDestino}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, bancoDestino: e.target.value.toUpperCase() }))}
                    placeholder="EJ. BBVA, SANTANDER, BANORTE..."
                    className="w-full p-1.5 text-xs border border-slate-300 font-semibold uppercase bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    FECHA DE PAGO / ABONO
                  </label>
                  <input
                    type="date"
                    value={servicioEditando.fechaPago}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, fechaPago: e.target.value }))}
                    className="w-full p-1.5 text-xs border border-slate-300 font-semibold bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    PAGADO / AUTORIZADO POR
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.autorizadoPor}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, autorizadoPor: e.target.value.toUpperCase() }))}
                    placeholder="NOMBRE DE QUIEN AUTORIZA"
                    className="w-full p-1.5 text-xs border border-slate-300 font-semibold uppercase bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    OBSERVACIONES / NOTAS DE CONTROL
                  </label>
                  <input
                    type="text"
                    value={servicioEditando.notasPago}
                    onChange={(e) => setServicioEditando(prev => ({ ...prev, notasPago: e.target.value.toUpperCase() }))}
                    placeholder="NOTAS ADICIONALES..."
                    className="w-full p-1.5 text-xs border border-slate-300 uppercase bg-white"
                  />
                </div>
              </div>
            </div>

            <div className="bg-slate-100 px-4 py-3 border-t border-slate-300 flex flex-wrap justify-between items-center gap-2">
              <button
                type="button"
                onClick={() => descargarTicketPDFNativo([servicioEditando], 'COMPROBANTE DE PAGO DE SERVICIO')}
                className="bg-white hover:bg-slate-50 text-slate-800 border border-slate-400 font-semibold px-3 py-1.5 text-xs flex items-center gap-1.5"
              >
                <FileText size={14} /> DESCARGAR COMPROBANTE PDF
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setServicioEditando(null)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300 bg-white"
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  onClick={guardarEdicionIndividual}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-1.5 text-xs flex items-center gap-1.5"
                >
                  <Save size={14} /> GUARDAR CAMBIOS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 2: DESGLOSE DE RESERVAS SELECCIONADAS (TODOS, SE DEBEN Y PAGADOS)   */}
      {/* ========================================================================= */}
      {mostrarResumenSeleccion && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white shadow-xl max-w-5xl w-full border border-slate-400 my-8 flex flex-col">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold flex items-center gap-2">
                  <Layers size={16} />
                  RESUMEN DE RESERVAS SELECCIONADAS ({itemsSeleccionados.length} SERVICIOS)
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  LISTA GENERAL, SERVICIOS QUE SE DEBEN (CON ABONOS) Y SERVICIOS LIQUIDADOS.
                </p>
              </div>
              <button
                onClick={() => setMostrarResumenSeleccion(false)}
                className="text-slate-300 hover:text-white p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-5 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-50 border border-slate-300 p-3">
                  <div className="text-[11px] font-bold text-slate-500">COSTO TOTAL DE SELECCIÓN</div>
                  <div className="text-xl font-bold text-slate-900 mt-0.5">${resumenSeleccionados.totalCosto.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-500">{itemsSeleccionados.length} SERVICIOS</div>
                </div>
                <div className="bg-white border border-slate-300 border-l-4 border-l-emerald-700 p-3">
                  <div className="text-[11px] font-bold text-slate-600">TOTAL YA PAGADO / ABONADO</div>
                  <div className="text-xl font-bold text-emerald-800 mt-0.5">${resumenSeleccionados.totalPagado.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-500">{resumenSeleccionados.pagados.length} SERVICIOS LIQUIDADOS</div>
                </div>
                <div className="bg-white border border-slate-300 border-l-4 border-l-red-700 p-3">
                  <div className="text-[11px] font-bold text-slate-600">CANTIDAD TOTAL QUE SE DEBE</div>
                  <div className="text-xl font-bold text-red-800 mt-0.5">${resumenSeleccionados.totalPendiente.toFixed(2)}</div>
                  <div className="text-[11px] text-slate-500">{resumenSeleccionados.deben.length} SERVICIOS CON SALDO</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-800 border-b border-slate-300 pb-1.5 mb-2">
                  1. LISTA DE TODOS LOS SERVICIOS SELECCIONADOS ({itemsSeleccionados.length})
                </h4>
                <div className="overflow-x-auto border border-slate-300">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-100 text-slate-700 font-bold border-b border-slate-300">
                      <tr>
                        <th className="p-2">FECHA</th>
                        <th className="p-2">RESERVA</th>
                        <th className="p-2">PROVEEDOR</th>
                        <th className="p-2">CLIENTE / SERVICIO</th>
                        <th className="p-2">HOTEL</th>
                        <th className="p-2 text-center">ESTADO</th>
                        <th className="p-2 text-right">COSTO</th>
                        <th className="p-2 text-right">ABONADO</th>
                        <th className="p-2 text-right text-red-800">SE DEBE</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {itemsSeleccionados.map(s => (
                        <tr key={s.id} className="hover:bg-slate-50">
                          <td className="p-2 font-semibold">{s.fecha}</td>
                          <td className="p-2 font-mono font-bold text-slate-700">{s.reserva || String(s.id).slice(-5)}</td>
                          <td className="p-2 font-bold">{s.proveedor || 'S/P'}</td>
                          <td className="p-2">{s.nombre} {s.apellido} ({s.tipoServicio})</td>
                          <td className="p-2">{s.hotel}</td>
                          <td className="p-2 text-center">
                            <span className={`px-1.5 py-0.5 text-[10px] font-bold border ${
                              s.estadoPago === 'PAGADO'
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                : s.estadoPago === 'ABONO'
                                  ? 'bg-amber-50 text-amber-900 border-amber-300'
                                  : 'bg-red-50 text-red-800 border-red-300'
                            }`}>
                              {s.estadoPago === 'PAGADO' ? 'PAGADO' : s.estadoPago === 'ABONO' ? 'ABONADO' : 'SE DEBE'}
                            </span>
                          </td>
                          <td className="p-2 text-right font-semibold">${s.costoTotal.toFixed(2)}</td>
                          <td className="p-2 text-right font-bold text-emerald-800">${s.montoPagado.toFixed(2)}</td>
                          <td className="p-2 text-right font-bold text-red-800">${s.saldoPendiente.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="border border-slate-300 p-3 bg-slate-50">
                  <h4 className="text-xs font-bold text-red-800 uppercase mb-2 pb-1.5 border-b border-slate-300 flex items-center justify-between">
                    <span>SERVICIOS QUE SE DEBEN / CON ABONO ({resumenSeleccionados.deben.length})</span>
                    <span>RESTA: ${resumenSeleccionados.totalPendiente.toFixed(2)}</span>
                  </h4>
                  {resumenSeleccionados.deben.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      NO SE DEBE NINGÚN SERVICIO DE LOS SELECCIONADOS.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {resumenSeleccionados.deben.map(s => (
                        <div key={s.id} className="bg-white p-2.5 border border-slate-300 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-slate-900">
                              {s.fecha} | {s.reserva || 'S/R'} | {s.proveedor || 'SIN PROVEEDOR'}
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {s.nombre} {s.apellido} • {s.hotel}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[10px] text-slate-500">
                              COSTO: ${s.costoTotal.toFixed(2)} | ABONO: ${s.montoPagado.toFixed(2)}
                            </div>
                            <div className="text-xs font-bold text-red-800">
                              SE DEBE: ${s.saldoPendiente.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="border border-slate-300 p-3 bg-slate-50">
                  <h4 className="text-xs font-bold text-emerald-800 uppercase mb-2 pb-1.5 border-b border-slate-300 flex items-center justify-between">
                    <span>SERVICIOS QUE YA SE PAGARON ({resumenSeleccionados.pagados.length})</span>
                    <span>PAGADO: ${resumenSeleccionados.pagados.reduce((a, c) => a + c.montoPagado, 0).toFixed(2)}</span>
                  </h4>
                  {resumenSeleccionados.pagados.length === 0 ? (
                    <div className="text-xs text-slate-500 py-4 text-center">
                      NO HAY SERVICIOS LIQUIDADOS EN ESTA SELECCIÓN.
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      {resumenSeleccionados.pagados.map(s => (
                        <div key={s.id} className="bg-white p-2.5 border border-slate-300 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold text-slate-900">
                              {s.fecha} | {s.reserva || 'S/R'} | {s.proveedor || 'SIN PROVEEDOR'}
                            </div>
                            <div className="text-[11px] text-slate-600">
                              {s.nombre} {s.apellido} • {s.hotel}
                            </div>
                            <div className="text-[10px] font-semibold text-slate-500 mt-0.5">
                              {s.formaPago} {s.referenciaTransferencia ? `| REF: ${s.referenciaTransferencia}` : ''}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="bg-emerald-50 text-emerald-800 border border-emerald-300 px-1.5 py-0.5 text-[10px] font-bold">
                              PAGADO
                            </span>
                            <div className="text-xs font-bold text-emerald-800 mt-1">
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

            <div className="bg-slate-100 px-4 py-3 border-t border-slate-300 flex flex-wrap justify-between items-center gap-2">
              <button
                onClick={() => {
                  setMostrarResumenSeleccion(false);
                  setModalLiquidacionMasiva(true);
                }}
                className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold px-3.5 py-1.5 text-xs flex items-center gap-1.5"
              >
                <CheckCircle size={14} /> MARCAR SELECCIÓN COMO PAGADA / ASIGNAR TRANSFERENCIA
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMostrarResumenSeleccion(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300 bg-white"
                >
                  CERRAR
                </button>
                <button
                  onClick={() => descargarTicketPDFNativo(itemsSeleccionados, 'COMPROBANTE Y ESTADO DE SERVICIOS SELECCIONADOS')}
                  className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-1.5 text-xs flex items-center gap-1.5"
                >
                  <Download size={14} /> DESCARGAR PDF ({itemsSeleccionados.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODAL 3: LIQUIDAR VARIAS RESERVAS CON UNA TRANSFERENCIA                   */}
      {/* ========================================================================= */}
      {modalLiquidacionMasiva && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white shadow-xl max-w-lg w-full border border-slate-400">
            <div className="bg-slate-800 text-white px-4 py-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold">
                  ACTUALIZACIÓN MASIVA ({itemsSeleccionados.length} RESERVAS)
                </h3>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  APLICAR ESTADO Y REFERENCIA DE TRANSFERENCIA A LOS SERVICIOS SELECCIONADOS.
                </p>
              </div>
              <button onClick={() => setModalLiquidacionMasiva(false)} className="text-slate-300 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">NUEVO ESTADO DE PAGO</label>
                <select
                  value={datosMasivos.estadoPago}
                  onChange={(e) => setDatosMasivos(prev => ({ ...prev, estadoPago: e.target.value }))}
                  className="w-full p-2 text-xs border border-slate-300 font-bold bg-white"
                >
                  <option value="PAGADO">PAGADO (LIQUIDAR TOTAL)</option>
                  <option value="DEBE">SE DEBE (MARCAR COMO PENDIENTE)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <label className="p-2.5 border border-slate-300 flex items-center gap-2 cursor-pointer bg-slate-50">
                  <input
                    type="checkbox"
                    checked={datosMasivos.pagoEnLlegada}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, pagoEnLlegada: e.target.checked }))}
                  />
                  <span className="text-xs font-bold">PAGO EN LLEGADA</span>
                </label>
                <label className="p-2.5 border border-slate-300 flex items-center gap-2 cursor-pointer bg-slate-50">
                  <input
                    type="checkbox"
                    checked={datosMasivos.esTransferencia}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, esTransferencia: e.target.checked }))}
                  />
                  <span className="text-xs font-bold">SE TRANSFIRIÓ</span>
                </label>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">NÚMERO DE REFERENCIA DE TRANSFERENCIA</label>
                <input
                  type="text"
                  value={datosMasivos.referenciaTransferencia}
                  onChange={(e) => setDatosMasivos(prev => ({ ...prev, referenciaTransferencia: e.target.value.toUpperCase() }))}
                  placeholder="EJ. SPEI-9948231"
                  className="w-full p-2 text-xs border border-slate-300 font-mono font-bold uppercase"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">BANCO DESTINO</label>
                  <input
                    type="text"
                    value={datosMasivos.bancoDestino}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, bancoDestino: e.target.value.toUpperCase() }))}
                    placeholder="EJ. BBVA"
                    className="w-full p-2 text-xs border border-slate-300 font-semibold uppercase"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">FECHA DE PAGO</label>
                  <input
                    type="date"
                    value={datosMasivos.fechaPago}
                    onChange={(e) => setDatosMasivos(prev => ({ ...prev, fechaPago: e.target.value }))}
                    className="w-full p-2 text-xs border border-slate-300 font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">NOTAS / OBSERVACIONES</label>
                <input
                  type="text"
                  value={datosMasivos.notasPago}
                  onChange={(e) => setDatosMasivos(prev => ({ ...prev, notasPago: e.target.value.toUpperCase() }))}
                  placeholder="EJ. LIQUIDACIÓN SEMANAL PROVEEDOR"
                  className="w-full p-2 text-xs border border-slate-300 uppercase"
                />
              </div>
            </div>

            <div className="bg-slate-100 px-4 py-3 border-t border-slate-300 flex justify-end gap-2">
              <button
                onClick={() => setModalLiquidacionMasiva(false)}
                className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-200 border border-slate-300 bg-white"
              >
                CANCELAR
              </button>
              <button
                onClick={aplicarLiquidacionMasiva}
                className="bg-slate-800 hover:bg-slate-900 text-white font-semibold px-4 py-1.5 text-xs flex items-center gap-1.5"
              >
                <Save size={14} /> APLICAR A {itemsSeleccionados.length} SERVICIOS
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
