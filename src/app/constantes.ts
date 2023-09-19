import { HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Sesion } from './modelos/usuario/sesion';
import { SesionService } from './servicios/usuario/sesion.service';

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
    anular: "/anular",
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
    obtenerTicket: "/obtenerTicket",
    
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
    obtenerIdentificacionYEmpresaYEstado: "/obtenerIdentificacionYEmpresaYEstado",
    obtenerRazonSocialYEmpresaYEstado: "/obtenerRazonSocialYEmpresaYEstado",
    consultarPorEmpresaYProcesoSRI: "/consultarPorEmpresaYProcesoSRI",
    consultarPorProcesoSRI: "/consultarPorProcesoSRI",
    consultarPorCliente: "/consultarPorCliente",
    consultarPorClienteYProcesoSRI: "/consultarPorClienteYProcesoSRI",
    consultarPorClienteYEmpresaYEstado: "/consultarPorClienteYEmpresaYEstado",
    consultarPorClienteYEmpresaYProcesoSRI: "/consultarPorClienteYEmpresaYProcesoSRI",
    consultarPorClienteYEstadoYProcesoSRI: "/consultarPorClienteYEstadoYProcesoSRI",
    consultarPorEmpresaYEstadoYProcesoSRI: "/consultarPorEmpresaYEstadoYProcesoSRI",
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
    consultarPorProceso: "/consultarPorProceso",
    consultarPorEmpresa: "/consultarPorEmpresa",
    consultarPorEstado: "/consultarPorEstado",
    consultarPorEmpresaYEstado: "/consultarPorEmpresaYEstado",
    consultarPorProveedorYEmpresaYEstado: "/consultarPorProveedorYEmpresaYEstado",
    consultarPorProveedorYEmpresaYEstadoDiferente: "/consultarPorProveedorYEmpresaYEstadoDiferente",
    consultarPorBancoYEmpresa: "/consultarPorBancoYEmpresa",
    consultarPorProducto: "/consultarPorProducto",
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
    pagar: "/pagar",
    
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
    obtenerUltimoPorProductoYBodega: "/obtenerUltimoPorProductoYBodega",
    obtenerUltimoPorProductoYBodegaYTablaTipoComprobante: "/obtenerUltimoPorProductoYBodegaYTablaTipoComprobante",
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
    paquete: "/paquete",
    suscripcion: "/suscripcion",
    perfil: "/perfil",
    consultarPorPerfil: "/consultarPorPerfil",
    permiso: "/permiso",
    sesion: "/sesion",
    establecimiento: "/establecimiento",
    estacionesPorEstablecimiento: "/estacionesPorEstablecimiento",
    puntosVentaPorEstablecimiento: "/puntosVentaPorEstablecimiento",
    estacion: "/estacion",
    obtenerPorApodoYEstado: "/obtenerPorApodoYEstado",
    subirCertificado: "/subirCertificado",
    subirLogo: "/subirLogo",

    //Ventas
    factura: "/factura",
    facturar: "/facturar",
    facturaElectronica: "/facturaElectronica",
    facturaFisica: "/facturaFisica",
    facturaLinea: "/facturaLinea",
    calcular: "/calcular",
    calcularLinea: "/calcularLinea",
    calcularTotales: "/calcularTotales",
    notaCredito: "/notaCredito",
    notaDebito: "/notaDebito",
    obtenerPorFactura: "/obtenerPorFactura",
    notaDebitoElectronica: "/notaDebitoElectronica",
    notaCreditoElectronica: "/notaCreditoElectronica",
    guiaRemisionElectronica: "/guiaRemisionElectronica",
    consultarPorElectronica: "/consultarPorElectronica",
    cierreCaja: "/cierreCaja",
    banco: "/banco",
    cuentaPropia: "/cuentaPropia",
    consultarBancoDistintoPorEmpresaYEstado: "/consultarBancoDistintoPorEmpresaYEstado",
    franquiciaTarjeta: "/franquiciaTarjeta",
    operadorTarjeta: "/operadorTarjeta",
    tipoComprobante: "/tipoComprobante",
    recaudacion: "/recaudacion",
    calcularRecaudacion: "/calcularRecaudacion",
    notaDebitoRecaudacion: "/notaDebitoRecaudacion",
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
    diez: 10,
    vacio: "",
    espacio: " ",
    guion: "-",
    //ESTADOS
    estadoActivo: "ACTIVO",
    estadoInactivo: "INACTIVO",
    //ESTADOS VENTAS
    estadoEmitida: "EMITIDA",
    estadoRecaudada: "RECAUDADA",
    estadoAnulada: "ANULADA",
    estadoCerrada: "CERRADA",
    procesoSRIPendiente: "PENDIENTE",
    procesoSRIAutorizada: "AUTORIZADA",
    procesoSRIAnulada: "ANULADA",
    //ESTADOS COMPRAS
    estadoPagada: "PAGADA",
    estadoPorPagar: "POR PAGAR",

    fechaCorta: "dd-MM-yyyy",
    suspendido: "SUSPENDIDO",
    abierto: "ABIERTO",
    cerrado: "CERRADO",
    pendiente: "PENDIENTE",
    entregado: "ENTREGADO",
    sinGuia: "SIN GUIA",
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
    anual: "ANUAL",
    etiquetaCasa: "CASA",
    etiquetaTrabajo: "TRABAJO",
    etiquetaEmpresa: "EMPRESA",
    latCiudad: -1.6719601146175727,
    lngCiudad: -78.65041698970757,
    devolucion: "DEVOLUCION",
    descuento: "DESCUENTO",
    conjunta: "CONJUNTA",
    avatares: "avatares/",
    logos: "logos/"
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
    error_fecha: "ERROR EN LA FECHA",
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
    error_establecimiento: "ERROR EN EL ESTABLECIMIENTO",
    error_punto_venta: "ERROR EN EL PUNTO DE VENTA",
    error_secuencial: "ERROR EN EL SECUENCIAL",
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
    error_permiso_existe: "EL PERMISO YA SE ENCUENTRA AGREGADO",
    error_factura: "ERROR SELECCIONAR LA FACTURA"
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

export const tablas = {
    /**
     * NOMBRES DE TABLAS
     */
    facturaCompra: "factura_compra",
    notaCreditoCompra: "nota_credito_compra",
    notaDebitoCompra: "nota_debito_compra",
    facturaVenta: "factura",
    notaCreditoVenta: "nota_credito_venta",
    notaDebitoVenta: "nota_debito_venta"
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