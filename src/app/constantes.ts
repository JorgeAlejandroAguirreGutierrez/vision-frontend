import { TabService } from './servicios/comun/tab/tab.service';
import { HttpHeaders } from '@angular/common/http';
import { SesionService } from './servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from './modelos/usuario/sesion';

export const urn =
{
    /**
     * URN 
     */
    //Global
    slash: "/",
    ruta: "/vision",
    modelo: "/modelo",
    activar: "/activar",
    inactivar: "/inactivar",
    validar: "/validar",
    recaudar: "/recaudar",
    consultar: "/consultar",
    buscar: "/buscar",
    obtenerPorTipo: "/obtenerPorTipo",
    consultarPorTipo: "/consultarPorTipo",
    codigo: "/codigo",
    porcentaje: "/porcentaje",
    validarIdentificacion: "/validarIdentificacion",
    nombre: "/nombre",
    consultarActivos: "/consultarActivos",
    obtenerPorAbreviatura: "/obtenerPorAbreviatura",
    personalizado: "/personalizado",
    generar: "/generar",
    obtener: "/obtener",
    pdf: "/pdf",
    excel: "/excel",
    enviarPDFYXML: "/enviarPDFYXML",
    obtenerPDF: "/obtenerPDF",
    // Cliente
    calificacionCliente: "/calificacionCliente",
    cliente: "/cliente",
    dependiente: "/dependiente",
    formaPago: "/formaPago",
    grupoCliente: "/grupoCliente",
    origenIngreso: "/origenIngreso",
    plazoCredito: "/plazoCredito",
    segmento: "/segmento",
    tipoContribuyente: "/tipoContribuyente",
    genero: "/genero",
    tipoIdentificacion: "/tipoIdentificacion",
    identificacion: "/identificacion",
    razonSocial: "/razonSocial",
    consultarPorCliente: "/consultarPorCliente",
    validarIdentificacionPorEmpresa: "/validarIdentificacionPorEmpresa",

    //Compras
    facturaCompra: "/facturaCompra",
    facturaCompraLinea: "/facturaCompraLinea",
    notaCreditoCompra: "/notaCreditoCompra",
    notaDebitoCompra: "/notaDebitoCompra",
    obtenerPorFacturaCompra: "/obtenerPorFacturaCompra",
    proveedor: "/proveedor",
    grupoProveedor: "/grupoProveedor",
    productoProveedor: "/productoProveedor",
    consultarPorUsuario: "/consultarPorUsuario",
    consultarPorEstado: "/consultarPorEstado",
    consultarPorEmpresa: "/consultarPorEmpresa",
    consultarPorEmpresaYEstado: "/consultarPorEmpresaYEstado",
    consultarPorEmpresaYBanco: "/consultarPorEmpresaYBanco",
    consultarGrupos: "/consultarGrupos",
    consultarSubgrupos: "/consultarSubgrupos",
    consultarSecciones: "/consultarSecciones",
    consultarLineas: "/consultarLineas",
    consultarSublineas: "/consultarSublineas",
    consultarPresentaciones: "/consultarPresentaciones",
    consultarProveedor: "/consultarProveedor",
    consultarPorProveedor: "/consultarPorProveedor",
    consultarPorCategoriaProductoYEstado: "/consultarPorCategoriaProductoYEstado",
    consultarPorCategoriaProductoYProveedorYEstado: "/consultarPorCategoriaProductoYProveedorYEstado",
    consultarPorCategoriaProductoYEmpresaYEstado: "/consultarPorCategoriaProductoYEmpresaYEstado",
    consultarPorCategoriaProductoYProveedorYEmpresaYEstado: "/consultarPorCategoriaProductoYProveedorYEmpresaYEstado",
    //Configuración
    estadoCivil: "/estadoCivil",
    impuesto: "/impuesto",
    retencionCliente: "/retencionCliente",
    menuOpcion: "/menuOpcion",
    consultarModulos: "/consultarModulos",
    consultarPorModulo: "/consultarPorModulo",
    regimen: "/regimen",
    secuencial: "/secuencial",
    tipoRetencion: "/tipoRetencion",
    ubicacion: "/ubicacion",
    importar: "/importar",

    //Contabilidad
    cuentaContable: "/cuentaContable",
    movimientoContable: "/movimientoContable",
    consultarMovimientoContable: "/consultarMovimientoContable",
    afectacionContable: "/afectacionContable",

    //Inventario
    bodega: "/bodega",
    grupoProducto: "/grupoProducto",
    kardex: "/kardex",
    medida: "/medida",
    producto: "/producto",
    existencias: "/existencias",
    medidaPrecio: "/medidaPrecio",
    precio: "/precio",
    tipoGasto: "/tipoGasto",
    obtenerUltimoPorBodega: "/obtenerUltimoPorBodega",
    consultarIvaBien: "/consultarIvaBien",
    consultarIvaServicio: "/consultarIvaServicio",
    consultarRentaBien: "/consultarRentaBien",
    consultarRentaServicio: "/consultarRentaServicio",
    saldoInicialInventario: "/saldoInicialInventario",
    consultarBien: "/consultarBien",
    consultarBienPorProveedor: "/consultarBienPorProveedor",
    consultarServicio: "/consultarServicio",
    consultarServicioPorProveedor: "/consultarServicioPorProveedor",
    consultarActivoFijo: "/consultarActivoFijo",
    consultarActivoFijoPorProveedor: "/consultarActivoFijoPorProveedor",
    caracteristica: "/caracteristica",
    presentacionProducto: "/presentacionProducto",
    obtenerGrupoProducto: "/obtenerGrupoProducto",
    categoriaProducto: "/categoriaProducto",
    buscarMedidasEquivalentes: "/buscarMedidasEquivalentes",
    equivalenciaMedida: "/tablaEquivalenciaMedida",

    //Accesos
    empresa: "/empresa",
    parametro: "/parametro",
    usuario: "/usuario",
    estacionUsuario: "estacionUsuario",
    perfil: "/perfil",
    permiso: "/permiso",
    sesion: "/sesion",
    establecimiento: "/establecimiento",
    establecimientoPuntoVenta: "/establecimientoPuntoVenta",
    estacion: "/estacion",
    obtenerPorApodoYEstado: "/obtenerPorApodoYEstado",

    //Ventas
    factura: "/factura",
    facturar: "/facturar",
    facturaElectronica: "/facturaElectronica",
    facturaFisica: "/facturaFisica",
    facturaLinea: "/facturaLinea",
    calcular: "/calcular",
    calcularLinea: "/calcularLinea",
    calcularTotales: "/calcularTotales",
    notaCreditoVenta: "/notaCreditoVenta",
    notaDebitoVenta: "/notaDebitoVenta",
    obtenerPorFactura: "/obtenerPorFactura",
    notaDebitoEletronica: "/notaDebitoEletronica",
    notaCreditoEletronica: "/notaCreditoEletronica",
    guiaRemisionEletronica: "/guiaRemisionEletronica",
    consultarPorElectronica: "/consultarPorElectronica",
    banco: "/banco",
    cuentaPropia: "/cuentaPropia",
    consultarBancoDistintoPorEmpresaYEstado: "/consultarBancoDistintoPorEmpresaYEstado",
    franquiciaTarjeta: "/franquiciaTarjeta",
    operadorTarjeta: "/operadorTarjeta",
    tipoComprobante: "/tipoComprobante",
    recaudacion: "/recaudacion",
    calcularRecaudacion: "/calcularRecaudacion",
    notaDebitoVentaRecaudacion: "/notaDebitoVentaRecaudacion",
    credito: "/credito",
    amortizacion: "/amortizacion",
    guiaRemision: "/guiaRemision",
    transportista: "/transportista",
    vehiculo: "/vehiculo",

    //REPORTES
    reporteVenta: "/reporteVenta",
    reporteKardex: "/reporteKardex",
    reporteCaja: "/reporteCaja"
}

export const valores = {
    /**
     * VALORES
     */
    cero: 0,
    uno: 1,
    menosUno: -1,
    vacio: "",
    espacio: " ",
    activo: "ACTIVO",
    inactivo: "INACTIVO",
    suspendido: "SUSPENDIDO",
    abierto: "ABIERTO",
    cerrado: "CERRADO",
    pendiente: "PENDIENTE",
    entregado: "ENTREGADO",
    sinGuia: "SIN GUIA",
    noRecaudada: "NO RECAUDADA",
    recaudada: "RECAUDADA",
    emitida: "EMITIDA",
    anulada: "ANULADA",
    facturada: "FACTURADA",
    noFacturada: "NO FACTURADA",
    si: "SI",
    no: "NO",
    ahorros: "AHORROS",
    corriente: "CORRIENTE",
    chequeALaVista: "A LA VISTA",
    chequePosfechado: "POSFECHADO",
    transferenciaDirecta: "DIRECTA",
    transferenciaViaBCE: "VIA BCE",
    modulo: "MODULO",
    operacion: "OPERACION",
    bien: "B",
    servicio: "S",
    activoFijo: "AF",
    clienteDireccion: "CLIENTE DIRECCION",
    nuevaDireccion: "NUEVA DIRECCION",
    mensual: "MENSUAL",
    etiquetaCasa: "CASA",
    etiquetaTrabajo: "TRABAJO",
    etiquetaEmpresa: "EMPRESA",
    latCiudad: -1.6719601146175727,
    lngCiudad: -78.65041698970757,
    devolucion: "DEVOLUCION",
    descuento: "DESCUENTO",
    conjunta: "CONJUNTA"
}

export const tipoMedidas = ["PESO", "VOLUMEN", "UNIDAD"]

export const dispositivos = ["PC ESCRITORIO", "PC PORTATIL", "TABLETA", "TELÉFONO", "CAJA REGISTRADORA", "OTRO"]

export const preguntas = ["¿CUAL ES EL NOMBRE DE TU MASCOTA?", "¿CUAL ES EL APELLIDO DE TU ABUELA MATERNA?", "¿CUAL ES EL NOMBRE DE TU EQUIPO PREFERIDO?", "¿CUAL ES TU MARCA DE VEHICULO PREFERIDO?"]

export const mensajes = {
    /**
     * Mensajes de Éxito
     */
    exito_agregar_detalle_factura: "SE AGREGO EL DETALLE",
    exito_crear_factura: "SE CREO LA FACTURA",
    exito_actualizar_factura: "SE ACTUALIZO LA FACTURA",
    exito_kardex_inicializado: "KARDEX INICIALIZADO CON EXITO",
    // Mensajes de Advertencia
    advertencia_precio_venta_publico_manual: "EL PVP MANUAL ES MENOR QUE EL PVP CALCULADO",
    mensaje_kardex_inicial: "INICIALIZAR KARDEX CON SALDO 0",
    // Mensajes de Error
    error_usuario: "INGRESE UN USUARIO",
    error_estacion_permiso: "NO TIENE PERMISOS PARA INGRESAR DESDE ESTE DISPOSITIVO",
    error_usuario_no_existe: "USUARIO NO EXISTE",
    error_usuario_existe: "USUARIO YA EXISTE",
    error_contrasena: "CONTRASEÑA INVÁLIDA",
    error_confirmar_contrasena: "CONFIRME LA CONTRASEÑA",
    error_empresa: "SELECCIONE UNA EMPRESA VÁLIDA",
    error_nombre: "INGRESE EL NOMBRE",
    error_telefono_ingresado: "INGRESE UN NUMERO DE TELEFONO",
    error_telefono_invalido: "NUMERO DE TELEFONO INVALIDO",
    error_celular_ingresado: "INGRESE UN NUMERO DE CELULAR",
    error_celular_invalido: "NUMERO DE CELULAR INVALIDO",
    error_correo_ingresado: "INGRESE UN CORREO ELECTRÓNICO",
    error_correo_invalido: "CORREO INVALIDO",
    error_contrasena_invalida: "CONTRASENA INVALIDA",
    error_perfil: "SELECCIONE UN PERFIL",
    error_unidad_kardex: "ERROR EN UNIDAD KARDEX",
    error_impuesto: "ERROR EN IMPUESTO",
    error_costo: "ERROR EN COSTO",
    error_medida: "ERROR EN MEDIDA, DEBE SELECCIONAR UNA MEDIDA PARA EL KARDEX",
    error_proveedor: "ERROR EN PROVEEDOR",
    error_nombre_producto: "INGRESE UN NOMBRE VÁLIDO",
    error_grupo_producto: "SELECCIONE UN GRUPO PARA EL PRODUCTO",
    error_sub_grupo_producto: "ERROR EN SUB GRUPO DE PRODUCTO",
    error_seccion_producto: "ERROR EN SECCION DE PRODUCTO",
    error_linea_producto: "ERROR EN LINEA DE PRODUCTO",
    error_sub_linea_producto: "ERROR EN SUB LINEA DE PRODUCTO",
    error_presentacion_producto: "ERROR EN PRESENTACION DE PRODUCTO",
    error_medida_karde: "SELECCIONE UNA MEDIDA PARA EL KARDEX DEL PRODUCTO",
    error_saldo_inicial: "AGREGUE EL SALDO INICIAL PARA EL KARDEX",
    error_tipo_gasto: "ERROR EN TIPO DE GASTO",
    error_tipo_producto: "ERROR EN TIPO DE PRODUCTO",
    error_kardex_inicial: "ERROR EN KARDEX INICIAL",
    error_cantidad: "INGRESE UNA CANTIDAD VALIDA",
    error_costo_unitario: "INGRESE UN COSTO UNITARIO VALIDO",
    error_costo_total: "COSTO TOTAL NO SE PUEDE DETERMINAR",
    error_precio: "INGRESE UN PRECIO",
    error_producto: "ERROR EN EL PRODUCTO",
    error_producto_proveedor: "PROVEEDOR YA EXISTE PARA ESTE PRODUCTO",
    error_estacion: "ERROR EN LA ESTACIÓN",
    error_estacion_usuario: "EL USUARIO YA FUE ASIGNADO A LA ESTACIÓN",
    error_kardex: "ERROR KARDEX EXISTENTE",
    error_kardex_vacio: "ERROR KARDEX VACIO",
    error_kardex_vacio_mensaje: "INGRESA UN KARDEX",
    error_bodega: "ERROR EN BODEGA",
    error_bodega_cantidad: "LA CANTIDAD SUPERA A LA EXISTENTE",
    error_eliminar_bodega: "NO PUEDE ELIMINAR UNA BODEGA CON SALDO",
    error_agregar_recaudacion: "VALOR SUPERA EL MONTO DE COBRO DE LA FACTURA",
    error_factura_recaudada: "FACTURA EN ESTADO RECAUDADA",
    error_recaudacion_dato: "DATO INVÁLIDO",
    error_recaudacion_valor: "VALOR INVÁLIDO",
    error_agregar_dependiente: "ERROR AL AGREGAR EL DEPENDIENTE",
    error_identificacion: "INGRESE UNA IDENTIFICACIÓN",
    error_razon_social: "ERROR EN RAZON SOCIAL",
    error_direccion: "ERROR EN DIRECCIÓN",
    error_ubicacion: "ERROR EN PROVINCIA, CANTON O PARROQUIA",
    error_medida_kardex: "ERROR MEDIDA KARDEX",
    error_falta_datos: "DATOS INCOMPLETOS, FAVOR INGRESE TODOS LOS DATOS",
    error_falta_correo: "DEBE AGREGAR POR LO MENOS UN CORREO ELECTRÓNICO PARA LA FACTURACIÓN",
    error_falta_imagen: "DEBE SELECCIONAR UNA IMAGEN",
    error_ruc: "DEBE INGRESAR UN RUC",
    error_permiso_existe: "EL PERMISO YA SE ENCUENTRA AGREGADO"
}

export const otras = {
    /**
     * OTRAS
     */
    credito: "CREDITO",
    debito: "DEBITO",
    identificacion_consumidor_final: "9999999999999",
    tipoIdentificacionCedula: "CÉDULA",
    tipoIdentificacionRUC: "RUC",
    tipoContribuyenteNatural: "NATURAL",
    tipoContribuyenteJuridica: "JURIDICA",
    tipoContribuyentePublica: "PUBLICA",
    tablaAmortizacionFrancesa: "FRANCESA",
    tablaAmortizacionAlemana: "ALEMANA",
    amortizacion: "AMORTIZACION",
    periodicidad: "PERIODICIDAD",
    periodo: "PERIODO",
    tipo_transaccion: "TIPO TRANSACCION",
    operacionInicialKardex: 'INVENTARIO INICIAL',
    pregunta_eliminar_cheque: "Realmente quiere eliminar el cheque?",
    pregunta_eliminar_deposito: "Realmente quiere eliminar el deposito?",
    pregunta_eliminar_transferencia: "Realmente quiere eliminar la transferencia?",
    pregunta_eliminar_tarjeta_credito: "Realmente quiere eliminar la tarjeta de crédito?",
    pregunta_eliminar_tarjeta_debito: "Realmente quiere eliminar la tarjeta de debito?",
    pregunta_eliminar_compensacion: "Realmente quiere eliminar la compensacion?",
    pregunta_eliminar_retencion_venta: "Realmente quiere eliminar la retencion en la venta?",
}

export const codigos = {
    /**
     * CODIGOS DE ERROR
     */
    error_codigo_modelo_existente: "4001",
    error_codigo_modelo_no_existente: "4002",
    error_codigo_suscripcion_invalida: "4003",
    error_codigo_sesion_invalida: "4004",
    error_codigo_datos_invalidos: "4005",
    error_codigo_generico: "4000"
}
export const modulos = {
    /**
     * MODULOS
     */
    modulo_clientes: "CLIENTES",
    modulo_compras: "COMPRAS",
    modulo_ventas: "VENTAS",
    modulo_inventarios: "INVENTARIOS",
    modulo_caja_bancos: "CAJA BANCOS",
    modulo_cuentas_cobrar: "CUENTAS POR COBRAR",
    modulo_cuentas_pagar: "CUENTAS POR PAGAR",
    modulo_activos_fijos: "ACTIVOS FIJOS",
    modulo_produccion: "PRODUCCION",
    modulo_contabilidad: "CONTABILIDAD",
    modulo_talento_humano: "TALENTO HUMANO",
    modulo_financiero: "FINANCIERO",
    modulo_importacion: "IMPORTACION",
    modulo_reportes: "REPORTES",

    modulo_accesos: "ACCESOS",
    modulo_configuracion: "CONFIGURACION",
    modulo_indicadores: "INDICADORES",
    modulo_control: "CONTROL",
    modulo_auditoria: "AUDITORIA",
    modulo_tutoriales: "TUTORIALES"
}

export const tabs = {
    /**
     * TABS
     */
    //Clientes
    tab_cliente: "Cliente",
    tab_segmento: "Segmentos",
    tab_grupo_cliente: "Grupo Cliente",
    tab_forma_pago: "Forma de Pago",
    tab_origen_ingreso: "Origen de Ingreso",
    tab_plazo_credito: "Plazo de Credito",
    tab_calificacion_cliente: "Calificacion Cliente",

    //Compras
    tab_proveedor: "Proveedor",
    tab_grupo_proveedor: "Grupo Proveedor",
    tab_factura_compra: "Factura de Compra",
    tab_nota_credito_compra: "Nota de Crédito",
    tab_nota_debito_compra: "Nota de Débito",

    //Ventas
    tab_factura: "Factura",
    tab_pedido: "Pedido",
    tab_proforma: "Proforma",
    tab_egreso: " Egreso",
    tab_nota_credito_venta: "Nota de Crédito",
    tab_nota_debito_venta: "Nota de Débito",
    tab_guia_remision: "Guia de Remision",
    tab_transportista: "Transportista",
    tab_vehiculo_transporte: "Vehiculo de Transporte",

    // Inventarios
    tab_grupo_producto: "Grupo de Producto",
    tab_producto: "Producto",
    tab_kardex: "Kardex",
    tab_promocion: "Promocion",
    tab_proveedor_producto: "Proveedor Producto",
    tab_transferencia_bodega: "Transferencia Bodega",
    tab_bodega: "Bodegas",
    tab_medida: "Medida",
    tab_equivalencia_medida: "Equivalencia Medida",

    // Caja Bancos
    tab_cuenta_propia: "Cuenta Propia",
    tab_banco: "Banco",

    // Cuentas x Cobrar
    // Cuentas x Pagar
    // Activos Fijos
    // Producción

    // Contabilidad
    tab_cuenta_contable: "Cuenta contable",
    tab_movimiento_contable: "Movimiento contable",

    // Talento Humano
    // Financiero
    // Importaciones
    // Reportes
    tab_reporte_clientes: "Clientes",
    tab_reporte_compras: "Compras",
    tab_reporte_ventas: "Ventas",
    tab_reporte_inventarios: "Invetarios",
    tab_reporte_caja_bancos: "Caja bancos",
    tab_reporte_cuentas_cobrar: "Cuentas x cobrar",
    tab_reporte_cuentas_pagar: "Cuentas x pagar",
    tab_reporte_activos_fijos: "Activos fijos",
    tab_reporte_produccion: "Producción",
    tab_reporte_contabilidad: "Contabilidad",
    tab_reporte_talento_humano: "Talento humano",
    tab_reporte_financiero: "Financiero",
    tab_reporte_importacion: "Importación",

    // Accesos
    tab_usuario: "Usuario",
    tab_empresa: "Empresa",
    tab_estacion_usuario: "Estación Usuario",
    tab_establecimiento: "Establecimiento",
    tab_estacion: "Estación",
    tab_perfil: "Pefil",
    tab_permiso: "Permiso",

    // Configuración
    tab_ubicacion: "Ubicacion",
    tab_estado_civil: "Estado Civil",
    tab_impuesto: "Impuesto",
    tab_secuencial: "Secuencial",
    tab_tipo_retencion: "Tipo de Retencion",
    tab_regimen: "Regimen",
    tab_exportacion: "Exportacion",
    tab_importacion: "Importacion",

    // Estadisticas
    tab_indicadores: "Indicadores",

    // Otros
    tab_retencion_cliente: "Retencion Cliente",
    tab_contabilizacion: "Contabilizacion",
    tab_cuenta: "Cuenta",
    tab_saldo_inicial_inventario: "Saldo inicial",
    tab_mapa_cliente: "Mapa Cliente",

}

export const items = {
    /*** ITEMS PARA OPCIONES DEL MENU Y PERMISOS*/
    // CLIENTES
    item_cliente: "Clientes",
    item_segmento: "Segmentos",
    item_grupo_cliente: "Grupos de Clientes",
    item_forma_pago: "Formas de Pago",
    item_origen_ingreso: "Origen de Ingresos",
    item_plazo_credito: "Plazos de Crédito",
    item_calificacion_cliente: "Calificación de Clientes",

    //COMPRAS
    item_proveedor: "Proveedores",
    item_factura_compra: "Facturas de Compra",
    item_grupo_proveedor: "Grupos de Proveedores",
    item_nota_credito_compra: "Notas de Crédito Compra",
    item_nota_debito_compra: "Notas de Débito Compra",

    //VENTAS
    item_factura: "Facturas",
    item_pedido: "Pedidos",
    item_proforma: "Proformas",
    item_egreso: "Egresos",
    item_nota_credito_venta: "Notas de Crédito Venta",
    item_nota_debito_venta: "Notas de Débito Venta",
    item_guia_remision: "Guias de Remision",
    item_transportista: "Transportistas",
    item_vehiculo_transporte: "Vehiculos Transportes",

    //INVENTARIOS
    item_grupo_producto: "Grupos de Productos",
    item_producto: "Productos",
    item_kardex: "Kardex",
    item_promocion: "Promociones",
    item_proveedor_producto: "Proveedores de productos",
    item_transferencia_bodega: "Transferencias de Bodega",
    item_bodega: "Bodegas",
    item_medida: "Medidas",
    item_equivalencia_medida: "Equivalencia de Medidas",

    //CAJA BANCOS
    item_cuenta_propia: "Cuentas Propias",
    item_banco: "Bancos",

    //CONTABILIDAD
    item_cuenta_contable: "Cuentas Contables",
    item_movimiento_contable: "Movimientos Contables",

    //REPORTES
    item_reporte_clientes: "Cliente",
    item_reporte_compras: "Compras",
    item_reporte_ventas: "Ventas",
    item_reporte_inventarios: "Invetarios",
    item_reporte_caja_bancos: "Caja Bancos",
    item_reporte_cuentas_cobrar: "Cuentas Por Cobrar",
    item_reporte_cuentas_pagar: "Cuentas Por Pagar",
    item_reporte_activos_fijos: "Activos Fijos",
    item_reporte_produccion: "Producción",
    item_reporte_contabilidad: "Contabilidad",
    item_reporte_talento_humano: "Talento Humano",
    item_reporte_financiero: "Financiero",
    item_reporte_importacion: "Importación",

    //ACCESOS
    item_usuario: "Usuarios",
    item_empresa: "Empresas",
    item_establecimiento: "Establecimientos",
    item_estacion: "Estaciones",
    item_perfil: "Perfiles",

    item_estacion_usuario: "Estación Usuario",
    item_permiso: "Permisos",

    //CONFIGURACION
    item_ubicacion: "Ubicación",
    item_estado_civil: "Estado Civil",
    item_impuesto: "Impuestos",
    item_secuencial: "Secuenciales",
    item_tipo_retencion: "Tipos de Retención",
    item_regimen: "Régimen",
    item_importacion: "Importaciones",
    item_exportacion: "Exportaciones",

    //ESTADISTICAS
    item_indicadores: "Dashboard",

    // OTROS NO UTILIZADOS
    item_servicio: "Servicios y Activos Fijos",
    item_grupo_servicio: "Grupo de Servicio",

    item_retencion_cliente: "Retencion de Cliente",
    item_tipo_contribuyente: "Tipo de Contribuyente",

    item_pago_compra: "Pago de Compra",
    item_proveedor_bodega: "Proveedor de Bodega",

    item_contabilizacion: "Contabilizacion",
    item_cuenta: "Cuenta",
    item_entrega: "Entrega",

    item_activo_fijo: "Activo Fijo",
    item_saldo_inicial_inventario: "Saldo Inicial Producto",
    item_recaudacion: "Recaudación",
    item_mapa_cliente: "Mapa Cliente"

}

export const icos = {
    /**
     * ICONOS
     */
    // Clientes
    ico_cliente: 'fa fa-address-book',
    ico_segmento: 'fa fa-th-list',
    ico_grupo_cliente: 'fa fa-users',
    ico_forma_pago: 'fa fa-cc-mastercard',
    ico_origen_ingreso: 'fa fa-briefcase',
    ico_plazo_credito: 'fa fa-calendar',
    ico_calificacion_cliente: 'fa fa-star-half-o',

    // Compras
    ico_proveedor: 'fa fa-truck',
    ico_factura_compra: 'fa fa-cart-arrow-down',
    ico_grupo_proveedor: 'fa fa-suitcase',
    ico_nota_credito_compra: 'fa fa-share',
    ico_nota_debito_compra: 'fa fa-reply',

    // Ventas
    ico_factura: 'fa fa-clipboard',
    ico_pedido: 'fa fa-file-text-o',
    ico_proforma: 'fa fa-file-text-o',
    ico_egreso: 'fa fa-file-text-o',
    ico_nota_credito_venta: 'fa fa-share',
    ico_nota_debito_venta: 'fa fa-reply',
    ico_guia_remision: 'fa fa-handshake',
    ico_transportista: 'fa fa-id-card',
    ico_vehiculo_transporte: 'fa fa-truck',

    // Inventarios
    ico_grupo_producto: 'fa fa-object-group',
    ico_producto: 'fa fa-shopping-basket',
    ico_kardex: 'fa fa-table',
    ico_promocion: 'fa fa-product-hunt',
    ico_proveedor_producto: 'fa fa-bus',
    ico_transferencia_bodega: 'fa fa-handshake-o',
    ico_bodega: 'fa fa-archive',
    ico_medida: 'fa fa-medium',
    ico_equivalencia_medida: 'fa fa-exchange',

    // Caja Bancos
    ico_cuenta_propia: 'fa fa-list-alt',
    ico_banco: 'fa fa-university',

    // Contabilidad
    ico_cuenta_contable: 'fa fa-sort-amount-asc',
    ico_movimiento_contable: 'fa fa-retweet',

    //REPORTES
    ico_reporte_clientes: "fa fa-address-book",
    ico_reporte_compras: "fa fa-truck",
    ico_reporte_ventas: "fa fa-clipboard",
    ico_reporte_inventarios: "fa fa-shopping-basket",
    ico_reporte_caja_bancos: "fa fa-university",
    ico_reporte_cuentas_cobrar: "fa fa-file-text-o",
    ico_reporte_cuentas_pagar: "fa fa-file-text-o",
    ico_reporte_activos_fijos: "fa fa-file-text-o",
    ico_reporte_produccion: "fa fa-file-text-o",
    ico_reporte_contabilidad: "fa fa-sort-amount-asc",
    ico_reporte_talento_humano: "fa fa-file-text-o",
    ico_reporte_financiero: "fa fa-file-text-o",
    ico_reporte_importacion: "fa fa-file-text-o",

    // Accesos
    ico_usuario: 'fa fa-user',
    ico_empresa: 'fa fa-building',
    ico_estacion_usuario: 'fa fa-street-view',
    ico_establecimiento: 'fa fa-home',
    ico_estacion: 'fa fa-laptop',
    ico_perfil: 'fa fa-database',
    ico_permiso: 'fa fa-check-square',

    // Configuración
    ico_ubicacion: 'fa fa-globe',
    ico_estado_civil: 'fa fa-venus-mars',
    ico_impuesto: 'fa fa-money',
    ico_secuencial: 'fa fa-caret-square-o-right',
    ico_tipo_retencion: 'fa fa-retweet',
    ico_regimen: 'fa fa-fax',
    ico_exportacion: 'fa fa-download',
    ico_importacion: 'fa fa-upload',

    // Estadisticas
    ico_indicadores: 'fa fa-bar-chart',

    // Otros
    ico_contabilizacion: 'fa fa-file-text-o',
    ico_cuenta: 'fa fa-file-text-o',
    ico_proveedor_bodega: 'fa fa-bus',
    ico_mapa_cliente: 'fa fa-map',
}

export const exito = "EXITO";
export const error = "Error";
export const exito_swal = 'success';
export const error_swal = 'error';
export const warning_swal = 'warning';
export const warning = "ADVERTENCIA";
export const si_seguro = "SI, ESTOY SEGURO";
export const error_formulario = "FORMULARIO INCOMPLETO"

//CAMPOS PARA CONSULTAS DINAMICAS
export const descripcion = "descripcion";
export const abreviatura = "abreviatura";

export const credencialUsuario = "admin";
export const credencialPassword = "admin";
export const credencial = credencialUsuario + ":" + credencialPassword;
export const headers = new HttpHeaders({ "Content-Type": "application/json", "Authorization": "Basic " + btoa(credencial) });
export const headersPDF = new HttpHeaders({ "Content-Type": "application/pdf", "responseType": "blob", "Authorization": "Basic " + btoa(credencial) });
export const options = { headers: headers };
export const optionsPDF = { headers: headersPDF };
export const headersCargarArchivo = new HttpHeaders({ "Authorization": "Basic " + btoa(credencial) });
export const optionsCargarArchivo = { headers: headersCargarArchivo };
export const optionsGenerarArchivo = { headers: headers, responseType: "blob" as "json" };

export function validarSesion(sesionService: SesionService, router: Router): Sesion {
    let sesion: Sesion = sesionService.getSesion();
    sesionService.validar(sesion).subscribe({
        next: res => {
            sesion = res.resultado as Sesion;
            return sesion;
        },
        error: err => {
            if (err.error.codigo == codigos.error_codigo_sesion_invalida) {
                sesionService.cerrarSesion();
                router.navigate(['/index']);
            }
            if (err.error.codigo == codigos.error_codigo_modelo_no_existente) {
                sesionService.cerrarSesion();
                router.navigate(['/index']);
            }
        }
    });
    return sesion;
}

export function tab_activo(tabService: TabService) {
    for (let i = 0; i < tabService.tabs.length; i++) {
        if (tabService.tabs[i].active) {
            return i;
        }
    }
}

export const imagenes = {
    logo_empresa: "/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAHRApgDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD6pooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKzPEGv6Z4fsjdavdx28f8IPLOfRVHJNNJt2Qm0ldmnXKeMfHmi+FkZLufz73Hy2sJBf8eyj6/rXk3jX4vahqfmWvh9W0+0PBmJ/fOPr0X8OfevLZHaR2eRmd2OSzHJJ9Sa9GjgG9an3HDWxqWlM+vfB+sP4g8N2WqSQrC1yrN5anIUbiAM/hXm9p8d9CtfHeseGPEyHTJLS7e3hvSd0MgBwN/dD78j3Fdn8Jf+Sd6L/1yb/0Nq+H/jX/AMlZ8Wf9hCX/ANCp4PC069WdOXTb7zqU3yRZ+hVtPFcwRz20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BRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//Z",
    avatar_usuario: "data:image/jpeg;base64,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"
}








