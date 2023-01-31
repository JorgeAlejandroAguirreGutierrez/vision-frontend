import { TabService } from './componentes/services/tab.service';
import { HttpHeaders } from '@angular/common/http';
import { SesionService } from './servicios/usuario/sesion.service';
import { Router } from '@angular/router';
import { Sesion } from './modelos/usuario/sesion';

export const urn =
{
    /**
     * URN
     */
     slash: "/",
     ruta: "/sicecuador",
     activar: "/activar",
     inactivar: "/inactivar",
     dependiente: "/dependiente",
     plazoCredito: "/plazoCredito",
     impuesto: "/impuesto",
     retencionCliente: "/retencionCliente",
     grupoCliente: "/grupoCliente",
     tipoContribuyente: "/tipoContribuyente",
     transportista: "/transportista",
     ubicacion: "/ubicacion",
     vehiculoTransporte: "/vehiculoTransporte",
     empresa: "/empresa",
     parametro: "/parametro",
     usuario: "/usuario",
     estacionUsuario: "estacionUsuario",
     perfil: "/perfil",
     permiso: "/permiso",
     sesion: "/sesion",
     validar: "/validar",
     establecimiento: "/establecimiento",
     estacion: "/estacion",
     origenIngreso: "/origenIngreso",
     genero: "/genero",
     estadoCivil: "/estadoCivil",
     calificacionCliente: "/calificacionCliente",
     tipoPago: "/tipoPago",
     formaPago: "/formaPago",
     tipoIdentificacion: "/tipoIdentificacion",
     cliente: "/cliente",
     factura: "/factura",
     facturaEletronica: "/facturaEletronica",
     facturaFisica: "/facturaFisica",
     facturaDetalle: "/facturaDetalle",
     tipoRetencion: "/tipoRetencion",
     consultarBien: "/consultarBien",
     consultarServicio: "/consultarServicio",
     consultarActivoFijo: "/consultarActivoFijo",
     caracteristica: "/caracteristica",
     obtenerPorTipo: "/obtenerPorTipo",
     consultarPorTipo: "/consultarPorTipo",
     producto: "/producto",
     medida: "/medida",
     buscar: "/buscar",
     obtenerPorApodo: "/obtenerPorApodo",
     calcular: "/calcular",
     calcularTotales: "/calcularTotales",
     calcularFacturaDetalleTemp: "/calcularFacturaDetalleTemp",
     identificacion: "/identificacion",
     razonSocial: "/razonSocial",
     codigo: "/codigo",
     importar: "/importar",
     porcentaje: "/porcentaje",
     secuencia: "/secuencia",
     nombre: "/nombre",
     banco: "/banco",
     cuentaPropia:  "/cuentaPropia",
     franquiciaTarjeta: "/franquiciaTarjeta",
     existencias: "/existencias",
     bodega: "/bodega",
     operadorTarjeta: "/operadorTarjeta",
     tipoComprobante: "/tipoComprobante",
     recaudacion: "/recaudacion",
     credito: "/credito",
     amortizacion: "/amortizacion",
     entrega: "/entrega",
     grupoProducto: "/grupoProducto",
     proveedor: "/proveedor",
     grupoProveedor: "/grupoProveedor",
     productoProveedor: "/productoProveedor",
     consultarPorUsuario: "/consultarPorUsuario",
     consultarPorEmpresa: "/consultarPorEmpresa",
     consultarGrupos: "/consultarGrupos",
     consultarSubgrupos: "/consultarSubgrupos",
     consultarSecciones: "/consultarSecciones",
     consultarLineas: "/consultarLineas",
     consultarSublineas: "/consultarSublineas",
     consultarPresentaciones: "/consultarPresentaciones",
     consultarMovimientoContable: "/consultarMovimientoContable",
     consultarActivos : "/consultarActivos",
     consultarProveedor: "/consultarProveedor",
     cuentaContable: "/cuentaContable",
     presentacionProducto: "/presentacionProducto",
     obtenerGrupoProducto: "/obtenerGrupoProducto",
     categoriaProducto: "/categoriaProducto",
     afectacionContable: "/afectacionContable",
     tipoGasto: "/tipoGasto",
     modelo: "/modelo",
     medidaPrecio: "/medidaPrecio",
     movimientoContable: "/movimientoContable",
     precio: "/precio",
     segmento: "/segmento",
     saldoInicialInventario: "/saldoInicialInventario",
     kardex: "/kardex",
     consultarIvaBien: "/consultarIvaBien",
     consultarIvaServicio: "/consultarIvaServicio",
     consultarRentaBien: "/consultarRentaBien",
     consultarRentaServicio: "/consultarRentaServicio",
     equivalenciaMedida: "/tablaEquivalenciaMedida",
     buscarMedidasEquivalentes: "/buscarMedidasEquivalentes",
     personalizado: "/personalizado",
     generar: "/generar",
     pdf: "/pdf"
}
export const valores ={
    /**
     * VALORES
     */
     cero : 0,
     uno : 1,
     vacio : "",
     espacio : " ",
     activo : "ACTIVO",
     inactivo : "INACTIVO",
     abierto : "ABIERTO",
     cerrado : "CERRADO",
     pendiente : "PENDIENTE",
     entregado : "ENTREGADO",
     sinGuia : "SIN GUIA",
     noRecaudado : "NO RECAUDADO",
     recaudado : "RECAUDADO",
     emitida : "EMITIDA",
     anulada: "ANULADA",
     facturada: "FACTURADA",
     noFacturada: "NO FACTURADA",
     si : "SI",
     no : "NO",
     modulo : "MODULO",
     operacion : "OPERACION",
     bien : "B",
     servicio : "S",
     activoFijo : "AF",
     clienteDireccion : "CLIENTE DIRECCION",
     nuevaDireccion : "NUEVA DIRECCION",
     mensual : "MENSUAL",
     etiquetaCasa: "CASA",
     etiquetaTrabajo: "TRABAJO",
     latCiudad: -1.6705413480437092,
     lngCiudad: -78.64974203645144
}

export const preguntas = ["¿CUAL ES EL NOMBRE DE TU MASCOTA?", "¿CUAL ES EL APELLIDO DE TU ABUELA MATERNA?", "¿CUAL ES EL NOMBRE DE TU EQUIPO PREFERIDO?", "¿CUAL ES TU MARCA DE VEHICULO PREFERIDO?"]
    
export const mensajes = {
    /**
     * Mensajes de Éxito
     */
     exito_agregar_detalle_factura : "SE AGREGO EL DETALLE",
     exito_crear_factura : "SE CREO LA FACTURA",
     exito_actualizar_factura : "SE ACTUALIZO LA FACTURA",
    // Mensajes de Error
     error_usuario : "INGRESE UN USUARIO",
     error_estacion_permiso : "NO TIENE PERMISOS PARA INGRESAR DESDE ESTE DISPOSITIVO",
     error_usuario_no_existe : "USUARIO NO EXISTE",
     error_usuario_existe : "USUARIO YA EXISTE",
     error_contrasena : "CONTRASEÑA INVÁLIDA",
     error_confirmar_contrasena : "CONFIRME LA CONTRASEÑA",
     error_empresa : "SELECCIONE UNA EMPRESA VÁLIDA",
     error_nombre : "INGRESE EL NOMBRE", 
     error_telefono_ingresado : "INGRESE UN NUMERO DE TELEFONO",
     error_telefono_invalido : "NUMERO DE TELEFONO INVALIDO",
     error_celular_ingresado : "INGRESE UN NUMERO DE CELULAR",
     error_celular_invalido : "NUMERO DE CELULAR INVALIDO",
     error_correo_ingresado : "INGRESE UN CORREO ELECTRÓNICO",
     error_correo_invalido : "CORREO INVALIDO",
     error_contrasena_invalida : "CONTRASENA INVALIDA",
     error_perfil : "SELECCIONE UN PERFIL",
     error_unidad_kardex : "ERROR EN UNIDAD KARDEX",
     error_impuesto : "ERROR EN IMPUESTO",
     error_costo : "ERROR EN COSTO",
     error_medida : "ERROR EN MEDIDA, DEBE SELECCIONAR UNA MEDIDA PARA EL KARDEX",
     error_nombre_producto : "INGRESE UN NOMBRE VÁLIDO",
     error_grupo_producto : "SELECCIONE UN GRUPO PARA EL PRODUCTO",
     error_sub_grupo_producto : "ERROR EN SUB GRUPO DE PRODUCTO",
     error_seccion_producto : "ERROR EN SECCION DE PRODUCTO",
     error_linea_producto : "ERROR EN LINEA DE PRODUCTO",
     error_sub_linea_producto : "ERROR EN SUB LINEA DE PRODUCTO",
     error_presentacion_producto : "ERROR EN PRESENTACION DE PRODUCTO",
     error_medida_karde : "SELECCIONE UNA MEDIDA PARA EL KARDEX DEL PRODUCTO",
     error_saldo_inicial : "AGREGUE EL SALDO INICIAL PARA EL KARDEX",
     error_tipo_gasto : "ERROR EN TIPO DE GASTO",
     error_tipo_producto : "ERROR EN TIPO DE PRODUCTO",
     error_kardex_inicial : "ERROR EN KARDEX INICIAL",
     error_cantidad : "INGRESE UNA CANTIDAD VALIDA",
     error_costo_unitario : "INGRESE UN COSTO UNITARIO VALIDO",
     error_costo_total : "COSTO TOTAL NO SE PUEDE DETERMINAR",
     error_precio : "INGRESE UN PRECIO",
     error_producto : "ERROR EN EL PRODUCTO",
     error_producto_proveedor : "PROVEEDOR YA EXISTE PARA ESTE PRODUCTO",
     error_estacion : "ERROR EN LA ESTACIÓN",
     error_estacion_usuario : "EL USUARIO YA FUE ASIGNADO A LA ESTACIÓN",
     error_kardex : "ERROR KARDEX EXISTENTE",
     error_kardex_vacio : "ERROR KARDEX VACIO",
     error_kardex_vacio_mensaje : "INGRESA UN KARDEX",
     error_bodega : "ERROR EN BODEGA",
     error_bodega_cantidad : "LA CANTIDAD SUPERA A LA EXISTENTE",
     error_eliminar_bodega : "NO PUEDE ELIMINAR UNA BODEGA CON SALDO",
     error_agregar_recaudacion : "VALOR SUPERA EL MONTO DE COBRO DE LA FACTURA",
     error_agregar_dependiente : "ERROR AL AGREGAR EL DEPENDIENTE",
     error_identificacion : "INGRESE UNA IDENTIFICACIÓN",
     error_razon_social : "ERROR EN RAZON SOCIAL",
     error_direccion : "ERROR EN DIRECCIÓN",
     error_ubicacion : "ERROR EN PROVINCIA, CANTON O PARROQUIA",
     mensaje_kardex_inicial : "INICIALIZAR KARDEX CON SALDO 0",
     error_medida_kardex : "ERROR MEDIDA KARDEX",
     error_falta_datos : "DATOS INCOMPLETOS, FAVOR INGRESE TODOS LOS DATOS"
}

export const otras ={
    /**
     * OTRAS
     */
     credito : "CREDITO",
     debito : "DEBITO",
     identificacion_consumidor_final : "9999999999999",
     tipoContribuyenteNatural : "NATURAL",
     tipoContribuyenteJuridica : "JURIDICA",
     tipoContribuyentePublica : "PUBLICA",
     tablaAmortizacionFrancesa : "FRANCESA",
     tablaAmortizacionAlemana : "ALEMANA",
     amortizacion : "AMORTIZACION",
     periodicidad : "PERIODICIDAD",
     periodo : "PERIODO",
     operacionInicialKardex : 'INVENTARIO INICIAL',
     formasPagos : ["CHEQUES", "DEPOSITOS", "TRANSFERENCIAS", "TARJETA DE CREDITO", "TARJETA DE DEBITO", "COMPENSACIONES", "RETENCION VENTAS"],
     pregunta_eliminar_cheque : "Realmente quiere eliminar el cheque?",
     pregunta_eliminar_deposito : "Realmente quiere eliminar el deposito?",
     pregunta_eliminar_transferencia : "Realmente quiere eliminar la transferencia?",
     pregunta_eliminar_tarjeta_credito : "Realmente quiere eliminar la tarjeta de crédito?",
     pregunta_eliminar_tarjeta_debito : "Realmente quiere eliminar la tarjeta de debito?",
     pregunta_eliminar_compensacion : "Realmente quiere eliminar la compensacion?",
     pregunta_eliminar_retencion_venta : "Realmente quiere eliminar la retencion en la venta?",
}

export const codigos = {
    /**
     * CODIGOS DE ERROR
     */
     error_codigo_modelo_existente : "4001",
     error_codigo_modelo_no_existente : "4002",
     error_codigo_suscripcion_invalida : "4003",
     error_codigo_sesion_invalida : "4004",
     error_codigo_datos_invalidos : "4005",
     error_codigo_generico : "4000"
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
     modulo_estadisticas: "ESTADISTICAS",
     modulo_control: "CONTROL",
     modulo_auditoria: "AUDITORIA",
     modulo_tutoriales: "TUTORIALES"
}    

export const tabs = {
    /**
     * TABS
     */
     tab_auxiliar: "Dependiente",
     tab_calificacion_cliente: "Calificacion Cliente",
     tab_cliente: "Cliente",
     tab_estado_civil: "Estado Civil",
     tab_forma_pago: "Forma de Pago",
     tab_genero: "Genero",
     tab_grupo_cliente: "Grupo Cliente",
     tab_impuesto: "Impuesto",
     tab_origen_ingreso: "Origen de Ingreso",
     tab_plazo_credito: "Plazo de Credito",
     tab_retencion_cliente: "Retencion Cliente",
     tab_tipo_contribuyente: "Tipo de Contribuyente",
     tab_tipo_pago: "Tipo de Pago",
     tab_tipo_retencion: "Tipo de Retencion",
     tab_factura_compra: "Factura de Compra",
     tab_pago_compra: "Pago de Compra",
     tab_proveedor: "Proveedor",
     tab_grupo_proveedor: "Grupo Proveedor",
     tab_proveedor_bodega: "Proveedor Bodega",
     tab_proveedor_producto: "Proveedor Producto",
     tab_egreso: " Egreso",
     tab_factura: "Factura",
     tab_pedido: "Pedido",
     tab_proforma:  "Proforma",
     tab_dato_adicional: "Dato Adicional",
     tab_empresa: "Empresa",
     tab_exportacion: "Exportacion",
     tab_importacion: "Importacion",
     tab_ubicacion: "Ubicacion",
     tab_contabilizacion: "Contabilizacion",
     tab_cuenta: "Cuenta",
     tab_entrega: "Entrega",
     tab_transportista: "Transportista",
     tab_vehiculo_transporte: "Vehiculo de Transporte",
     tab_activo_fijo: "Activo Fijo",
     tab_bodega: "Bodegas",
     tab_kardex: "Kardex",
     tab_medida: "Medida",
     tab_producto: "Producto",
     tab_servicio:  "Servicio",
     tab_promocion: "Promocion",
     tab_saldo_inicial_inventario: "Saldo inicial",
     tab_equivalencia_medida: "Equivalencia Medida",
     tab_usuario: "Usuario",
     tab_estacion_usuario: "Estación Usuario",
     tab_establecimiento: "Establecimiento",
     tab_estacion: "Estación",
     tab_perfil: "Pefil",
     tab_permiso: "Permiso",
     tab_grupo_producto: "Grupo de Producto",
     tab_segmento: "Segmentos",
     tab_movimiento_contable: "Movimiento contable",
     tab_cuenta_contable: "Cuenta contable",
     tab_recaudacion: "Recaudacion",
     tab_transferencia_bodega: "Transferencia Bodega",
     tab_mapa_cliente: "Mapa Cliente",
     tab_indicadores: "Indicadores",
}
    
export const items = {
    /*** ITEMS PARA OPCIONES DEL MENU*/
    // CLIENTES
    item_cliente : "Clientes",
    item_segmento : "Segmentos",
    item_grupo_cliente : "Grupos de Clientes",
    item_forma_pago : "Formas de Pago",
    item_origen_ingreso : "Origen de Ingresos",
    item_plazo_credito : "Plazos de Crédito",
    item_calificacion_cliente : "Calificación de Clientes",

    //COMPRAS
    item_proveedor : "Proveedores",
    item_factura_compra : "Facturas de Compra",
    item_grupo_proveedor : "Grupos de Proveedores",

    //VENTAS
    item_factura : "Facturas",
    item_pedido : "Pedidos",
    item_proforma : "Proformas",
    item_egreso : "Egresos", 
    item_transportista : "Transportistas",
    item_vehiculo_transporte : "Vehiculos Transporte",

    //INVENTARIOS
    item_grupo_producto : "Grupos de Productos",
    item_producto : "Productos",
    item_kardex : "Kardex",
    item_promocion : "Promociones",
    item_proveedor_producto : "Proveedores de productos",
    item_transferencia_bodega : "Transferencias de Bodega",
    item_bodega : "Bodegas",
    item_medida : "Medidas",
    item_equivalencia_medida : "Equivalencia de Medidas",

    //CONTABILIDAD
    item_cuenta_contable : "Cuentas Contables",
    item_movimiento_contable : "Movimientos Contables",

    //ACCESOS
    item_usuario : "Usuarios",
    item_empresa : "Empresas",
    item_establecimiento : "Establecimientos",
    item_estacion : "Estaciones",
    item_perfil : "Perfiles",

    item_estacion_usuario : "Estación Usuario",
    item_permiso : "Permisos",

    //CONFIGURACION
    item_ubicacion : "Ubicación",
    item_estado_civil : "Estado Civil",
    item_impuesto : "Impuestos",
    item_tipo_pago : "Tipos de Pago",
    item_tipo_retencion : "Tipos de Retención",
    item_genero : "Generos",
    item_importacion : "Importaciones",
    item_exportacion : "Exportaciones",

    //ESTADISTICAS
    item_indicadores : "Dashboard",

    // OTROS NO UTILIZADOS
    item_servicio : "Servicios y Activos Fijos",
    item_grupo_servicio : "Grupo de Servicio",

     item_retencion_cliente : "Retencion de Cliente",
     item_tipo_contribuyente : "Tipo de Contribuyente",

     item_pago_compra : "Pago de Compra",
     item_proveedor_bodega : "Proveedor de Bodega",

     item_contabilizacion : "Contabilizacion",
     item_cuenta : "Cuenta",
     item_entrega : "Entrega",

     item_activo_fijo : "Activo Fijo",
     item_saldo_inicial_inventario : "Saldo Inicial Producto",
     item_recaudacion : "Recaudación",
     item_mapa_cliente : "Mapa Cliente"

}
    
export const icos = {
    /**
     * ICOS
     */
     ico_auxiliar : 'fa fa-file-text-o',
     ico_calificacion_cliente : 'fa fa-star-half-o',
     ico_cliente : 'fa fa-address-book',
     ico_estado_civil : 'fa fa-venus-mars',
     ico_forma_pago : 'fa fa-cc-mastercard',
     ico_genero : 'fa fa-mars-stroke',
     ico_grupo_cliente : 'fa fa-users',
     ico_impuesto : 'fa fa-university',
     ico_origen_ingreso : 'fa fa-briefcase',
     ico_plazo_credito : 'fa fa-calendar',
     ico_retencion_cliente : 'fa fa-file-text-o',
     ico_tipo_contribuyente : 'fa fa-file-text-o',
     ico_tipo_pago : 'fa fa-ticket',
     ico_tipo_retencion : 'fa fa-retweet',
     ico_factura_compra : 'fa fa-cart-arrow-down',
     ico_pago_compra : 'fa fa-file-text-o',
     ico_proveedor : 'fa fa-truck',
     ico_grupo_proveedor : 'fa fa-suitcase',
     ico_egreso : 'fa fa-file-text-o',
     ico_factura : 'fa fa-clipboard',
     ico_pedido : 'fa fa-file-text-o',
     ico_proforma : 'fa fa-file-text-o',
     ico_dato_adicional : 'fa fa-table',
     ico_empresa : 'fa fa-building',
     ico_exportacion : 'fa fa-download',
     ico_importacion : 'fa fa-upload',
     ico_ubicacion : 'fa fa-globe',
     ico_contabilizacion : 'fa fa-file-text-o',
     ico_cuenta : 'fa fa-file-text-o',
     ico_entrega : 'fa fa-file-text-o',
     ico_transportista : 'fa fa-id-card',
     ico_vehiculo_transporte : 'fa fa-truck',
     ico_activo_fijo : 'fa fa-file-text-o',
     ico_bodega : 'fa fa-archive',
     ico_kardex : 'fa fa-table',
     ico_medida : 'fa fa-medium',
     ico_producto : 'fa fa-shopping-basket',
     ico_servicio : 'fa fa-child',
     ico_proveedor_bodega : 'fa fa-bus',
     ico_equivalencia_medida : 'fa fa-exchange',
     ico_usuario : 'fa fa-user',
     ico_estacion_usuario : 'fa fa-street-view',
     ico_establecimiento : 'fa fa-home',
     ico_estacion : 'fa fa-laptop',
     ico_perfil : 'fa fa-database',
     ico_permiso : 'fa fa-check-square',
     ico_grupo_producto : 'fa fa-object-group',
     ico_segmento : 'fa fa-th-list',
     ico_movimiento_contable : 'fa fa-retweet',
     ico_cuenta_contable : 'fa fa-sort-amount-asc',
     ico_recaudacion :     'fa fa-file-text-o',
     ico_proveedor_producto : 'fa fa-bus',
     ico_transferencia_bodega : 'fa fa-handshake-o',
     ico_mapa_cliente : 'fa fa-map',
     ico_promocion : 'fa fa-product-hunt',
     ico_indicadores : 'fa fa-bar-chart',
}

export const exito = "EXITO";
export const error = "Error";
export const exito_swal = 'success';
export const error_swal = 'error';
export const warning_swal = 'warning';
export const warning = "WARNING";
export const si_seguro = "SI, ESTOY SEGURO";
export const error_formulario = "FORMULARIO INCOMPLETO"

//CAMPOS PARA CONSULTAS DINAMICAS
export const descripcion = "descripcion";
export const abreviatura = "abreviatura";

export const credencialUsuario = "admin";
export const credencialPassword = "admin";
export const credencial = credencialUsuario + ":" + credencialPassword;
export const headers = new HttpHeaders({"Content-Type" : "application/json", "Authorization" : "Basic "+btoa(credencial)});
export const options = {headers: headers};
export const headersCargarArchivo = new HttpHeaders({"Authorization" : "Basic "+btoa(credencial)});
export const optionsCargarArchivo = {headers: headersCargarArchivo};
export const optionsGenerarArchivo = {headers: headers, responseType: "blob" as "json" };

export function validarSesion(sesionService : SesionService, router: Router) : Sesion{
    let sesion: Sesion = sesionService.getSesion();
    sesionService.validar(sesion).subscribe({
        next: res => {
            sesion = res.resultado as Sesion;
            return sesion;
        },
        error: err => {
            if(err.error.codigo == codigos.error_codigo_sesion_invalida){
                sesionService.cerrarSesion();
                router.navigate(['/index']);
            }
            if(err.error.codigo == codigos.error_codigo_modelo_no_existente){
                sesionService.cerrarSesion();
                router.navigate(['/index']);
            }
        }
    });
    return sesion;
}

export function tab_activo(tabService: TabService){
    for(let i=0; i < tabService.tabs.length; i++){
        if(tabService.tabs[i].active){
        return i;
        }
    }
}

export const imagenes = {
    avatar_usuario : "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxITEhUTExMWExUXFRgYGRcYGBcYGRcYGCAYGhkZFxsYHigjGh8mHxgXITEjJSkrLy4uFx8zODMtNygtLisBCgoKDg0OGxAQGy0mICYvLS8tMjUvLS0tLS0uLS0tNS8tNS8rLy0tLS0tLS0tLS0tLS0tMC0tLS01Ly0vLy01Lf/AABEIAMwAzAMBIgACEQEDEQH/xAAcAAEAAgMBAQEAAAAAAAAAAAAABgcDBAUCAQj/xABHEAABAgQDBAYHBAcGBwEAAAABAhEAAyExBEFRBRJhcQYHIjKBkRNCUqGxwfAUI3LRM0NigpLh8RckU3OiwhUlNGOy0uIW/8QAGgEAAgMBAQAAAAAAAAAAAAAAAAQBAwUCBv/EADQRAAICAQEEBgkEAwEAAAAAAAABAgMEERIhMVEFFEFhcYETIjJCkaHB0fAVUnKxM2LhI//aAAwDAQACEQMRAD8AvGEIQAIQhAAhCEACEIQAIQhAAhGLE4hEtO8tQSnUlhwEcLH9NcFKUUGbvqF9wFTa1FKZx3GuU/ZWpxOyEPaaRIoRD1dYmF9VE1dA5SkMneLAEve3wjZk9PMEpW7vqTVnKSBlc5Z/wmLHjWr3WVrJpfvIk8I0tnbWkTw8qalfI18rxuxS009GXJprVCEIRBIhCEACEIQAIQhAAhCEACEIQAIQhAAhCEACEI8zFhIKlEAAEkmgAFyTlAB9WoAEkgAByTQAamK/2103nTZpw2z5fpFW9IKvqU5AftGNLb21J21J/wBkwrehSXUveLKHtHhoGMTno9sCThJe5KTUtvKNVKPE/KHFCFC2rFrLsXLx+wk5zvezW9Iri+fh9yPYTobOnFEzHYhUwgfok0SOG95uwBOsSXBbCw0oES5KEhRBPZFWIIvoQPKMe1+kOGwxAmzUpUfVuptSBYREdodZQ3inDyt6jBSnvqQMmej+TVFHIu4Ld8EDlj0cXv8AiyfpkIFkpFXsL6xq4zY2HmjdXJQoX7ovQPTgB5RXU3rExAB/RObMklKbcXWb2o5vlHR2V08nGs6WgI1cpU7HKtSWoLDW8T1S+O/6gsyiT2fob+2egMtTqwq1YdbGg7pcg5VFgKHKONhOkm0MBMEvGoMyU7ekzrmlY7zaGvKJlsnpPh55CUq3FGyV0Jyp+UdPG4OXNQUTEhaTkQ/KIV8o+pctV8/Jg6Iy9emWj7uHmjHszaMrESxMlK3knP5GNuKn2jgcRsjECdJKpklVK2a4Qts9C0WXsjaSMRKTNQaKFswcwWzEV3UKCU4vWL/NGWUXubcJrSS/NUbsIQhcZEIQgAQhCABCEIAEIQgAQhCABCEIAEQTrM6RGWkYWUxXMHaY1Sk2DDNXHKJ0S0Vb0cQMbtaZPPaRLO+DX1aS28QDXS2cN4kVq7JcIrXz7BPMlLZVceMnp5dpMehHR8YTDpBA9Ksb0w8ck8gGEavTjpYMIjclFKp6si53AfWIFzoPGJHtLGpkylzVOyEksA5OgAiitr7QXPmqWHKlGpueT5DRKfM524tTvsc58CrLtWPWq6+JzcVOUtalrJUtRJUTckx5CizD65wWhrmug+ceY3VwPPvXXebEqalFe8r3D8/q9ozy8QpdSbesaAcBpyH840BGwlL940HqijfJPMxy0jqMmbyMYp92SneV7RFuIBoOZ0yiedC+lCkBMrEzQtJLJmmwOSd49+9wGGtYr9E71UgN47gzq9Vnn5adPB4au+s/vKy0CRZPDM3FHdW+uM46P/o5j2yhLWL+xc+PwaJ0tUtYdKgR55iK06MzV7NxysPOV93MoLsa9hQfyprwpNeiG0vSyd0klSGDm6k+qqpc2IdgC1I4XWtswKkIxAoqWoAsPVVbyPxjMx/Vm6ZcHu8+w1Mj1oK+HFb/AC7UTuEcfojtMYjCSpjud3dVrvJoXYCuds47EJyi4ycX2DsJKUVJdohCEcnQhCEACEIQAIQhAAhCEACEIQAc7pHPMvCz1ggESlsSQGLECp4xDup/DASZ0zMzAl+CQD/uiTdNpe9gcQK/o8uBBPhSON1TEfYlMAPvlOz1O6i7m9rNRuJLkN2LLxQlZvyodyZtdY01P2dKFFgpYoHJVu1anhFUYyce6kboswueZ5ZBh8TZHWgUhMkqUEh1cyaUAz+EVqqYpT+jG4jNavmcvwivOH8COlSZndIS1taNJUtr30056R4jZWhKbX4ivgnLmYwEE5Ropma1oeQY9y0k0+v5x4Me0K+svH8olkI6OGIFu0RmaJHiPgmp1jofaEpZS1OcqOT+BAy455EMY4qJ5yyzNhyFh4xkl4hi4qrNavlr9c4plDUvjNInnQPaEz7UApkIWlQCTVaj3t5R1oQwAAetbzjpHhBNws6X7UtXmA494ir+ggUrGylNvVLrUzUSqiAfgK+Dtb0/uqezGMbMWxcmu42sJ7dLT7yDdUWIfDzZfszH/iHLhE9iuuqNTnFab6WAt61vdnFixXmrS+X52FuE9aI/naIQhCo2IQhAAhCEACEIQAIQhAAhCEAGltrC+lw86Wz78taWrcgtat4h/VJNAkzpT9pMzeI0cAf7YnsV3gwcDtYy2IlYmxoEuXZmGSg2V4boe1VOvz+Anetm2Fnk/M7PWNs9MzDiYoA+iWFVJAY0O81SLUDcxFYzApRG64GSili3/bQKJGT565ReeLwyZiFIWHSoMYq/amz1SZipbM3rGpUDYpGeQc9nIDehjCu9XZF86n1tvmRZWCCe8b5XUrxF/CnF4wTEZM3ANT8RsOQ8ax08UtKFEVUvMCqsu+qyeWWYescvFE+uQP2E5c/zNY04NsyppI01t9WjzH0wi8WYEZpQSKllH3f/AFGCN3Z+D31B3NbC54fXxiJPRHUE29xNeq+WqbiVTG7MuWakZqoAMkhnt78rH2xP9HImrvuy1HPQ6VjS6KbJGHw6Usyj2lXoTkxAZo4fWbjz6GXhZZeZPmAFIYnc5Gzq3a8DGBY/T5Gi4fRHoq11fH1fH6s89U+FKcKuYf1kwkXsKZ3q8TeNDYOzE4aRLkpruJYnVVyb5l434Xvnt2OSGKK/R1xi+QhCEVFwhCEACEIQAIQhAAhCEACEI0NtbXlYWX6SaphYAVKjoBEpOT0REpKK1ZuzJgSCVEACpJoAOMQTrExuEmy5afTD0qVJWnc7RAOpFnuM9BHKSMdteaVpUZOFCmDkMG0A76s9BrEz2L0QwmHIUmXvzB+sWSpROrGgPIQ4oQx2nJ+tyX1EnOeRFqK9Xm/oje6P4tc2Qha0KQpmIUGJb1vG8Yekewxipe6FGWsWWlnbNJN2PCN/FY2VLf0kxKGBV2lAUFzWIltDrEkJKkykqmGyTYE8rge/4xVXCyU9qtF1k64Q2bGQjbWypuFJQZfokuwXff8Awn6PwHGOENz2QdarVyHztE4xnT9ZBCpUoj2CCoCjdpVnerJBORarbGxth4XaEpS91Uia/aCTRWit1RJbJnYNGqr51x1sWnfx/PmZEqIWS0qevdw/PkVtNIFE/mfE/lTnHz7OpnIaLVk9XEtFprn2lJrm7MaUb+lDr7V6FyZMmZNnTlbqEOyQA5e3jQczpSOlnVN6I4fR9qWsirkIJLAEk0AFSeTRavQHoYZLYjEAb7AoRV5fFX7XDKIZsTpQMMd6XhpW+zBRBKs7qfjkBQAcYmezOsTepNkgGjlBokZlT0H4QSeEc5jvlHZgt3zOsKNEZbU5b/DcT1RYWfhrFVStq+i2ovEY6UtIqmW6S0u26Rkey9nqokRYmz9uSJzbqwCbJV2T4A38Iz7T2ZKxCDLnIC0nW44gioPKMumfom1Ncd3ea91btScJcHr3eZ7wGOlzkBcpYWkhwRx1FxyMbEVttHo9itnKM/AqKpV1oNSw9oetzFamJX0W6UycYjsndmgOqWb5OU+0HN+URZRotuD1j814hVkay2LFpL5PwO9CEIXGRCEIAEIQgAQhCABCEIAMWLxKZaFTFlkpSVE6AVNrxXOz5Mza+IVMmb6MIg0S4qadkU8zerPp0esXGKmrk4CV3pygVsRRL0cPwUqrd2JfsrAIkSkSkd1CQOeprDcX6Gva958O5c/MTmvTWbHux4975eRnkykISEpAQlIoAAAAPhED6ZdPxLeVhFBS6hUxnSj8L0UfMc4x9YXSVXaw0ohKGaYsi59lGvMDxoSKymEZeZufyhrDw1L17Ph9xTNznH/zr+P2MuLx02aoqmLUsm5JcmPEtarJo+lzzP5Rhj2Fmwz0uY19EluMbaberOhhghFT21DL1U8yPlXiDaT9Ftrrl4hCyex3V2CQk+4MWNdL1rDpZCe9U+yPmco3ZchcxhMJSm4lpFTxAy/Eo+cUW1qSaYxVY4tOP54l/AxX3WvtA7qMOlTP21AGpFkggZPVyw5xJui21UzMIlZUHljdWd4Ft32lMA7MXtWjisVd0r2j6efMUO0SbUCQkUG8c6DOmlL5OHS/Tb+w1829eg3e8RiOrs5KmB7qXopVuSEiqjy50uMeGw6bllH2iOwOSbr9w1pG+rEpQXJJU1M1nkLIHl4iNictdyMWuGm9nRw0ti/a3tTVelBaWOXaPJ47myOmapakyqz0ggFjSWM+2e+eAcaFmEQ2dPJ/SHcSf1aXdX4iKn3DRrR4OKLbo+7TklPePNrfT1qV5UKa9YajkOD9UvTA42XORvy1BST7jmCMjwMQbph0YXIWcdgiZa0uqYkOXepUkV8QzViPdGtrrwkzesj1pQq4pVRNEniS/ha3MJiUTUJmIO8hQBB1B5/CM2cZY09VvT+fczThOGVDSW5r5d6OX0V6RS8ZK300Wmi05g6jgco7UVtj5B2ZtBM1HZw04spAsNXegYlxWjmwiyEl6iKr64xalD2Xw+xdj2SknGftLj9/M+whCFxgQhCABCEIAEIRobdxfosPOmezLURa7UvS7RKWr0REnotWRHoir7VtHFYpnSj7tB92ZOQfxiUdJ9p/Z8NMmCim3UMAe2qiaG9Y4fVZhd3B75FZkxSrNQMBzsfOPPWTjiiXLQB3io1qBusLZ96xpq9i7OKnkKHYt3wEYScMZzfF7/iVli0rUTMmqZ8zVRzo3wDDVrxz5ixZIYcb/wAo3MWFK7SjT2jnwGvIf00iB6o8T9UjchwMGfExx7Q+rcY8wEdlSNuQQlmB3v8AV4Cyed9I3MOkqB3jupeodh++u5P9BpHPSoJvU6D5n5CPE6epVzQWAoByEVuOpappHcmbeUiUqRJWpKFd9gEhQ0FHSNauc7xy0qDOWb/S/K6jz+Eam99ZQKnvWCNaXAJWuXE3TiTkd39o38NPCvwjGJ7d2mqjc8hGtUx7BSP2jxt5Z+MdbKOdpszSwTWwPrGpPIXPh4xmGJSju0OZ9Y8z6vIV45RrJ3lmnmfr3CN2RLly6mp1PyH150jmWh3HuPeFwkyYxV2E+/wHzPvN7M6vsakJVhge6N9PIkBXvI861eK7lLXMt2U+0dOH1x4xIuhk9EvEy92u8SlSzaosKVqBanEi6WVHbraY9iS2LE0TXpxsz7Rg5iR3kjfSeKa00cOPGNXq52p6fBIBLql/dl6mnd9xESdQcMbGIL1ffdYrG4YUCZm8kVZnIz8K+8xmwe1RKPLR/Q05rZvjLnqn/aJ3CEIVGxCEIAEIQgARGusWdu4Cb+1upyzI1iSxCetpbYNI1mp+BMX4y1uiu8oynpTJ9x2uhMsJwMgAu6AfOukQ/rQxrYiXLCCtfogQMu0VZCpNPqsTnoxL3cJIGkpHwiDdYs3+9MkEq9ElwKUJU2+t33X9UN45MY2/Ib8RbJ3YyXgQaZJJJVNVvEZAhk8FEUH4U+6NWcp7CmVGHgPmax0xglKuxYUySB+yKeZYfEhh0ioAV+2X3f3RdfkA/CsbCmkYjg2ctEgkOaDU58tY9lDUA/8Ab8kxuYghJqTveG9+SBy94jRmrPIafnrHabZw0omNUeYQjsrEIQiQPrx6Q2ceI+xAGwmao0SIzykpSXV21aZDm/z8o0/SnKkfAfAe+OXE7Ujorxblu8ckDu+Ovj7rRu7Gm/3mSVkqUJqGQmyai5FyK6nUxyZEsmndB07yh+XNhHa2clEpaN6h3kjdSe0a+uqlHFqDTeypsSS0L62202XhED2MFJ23ihZJlu2rhBHP1onYiCbOUTt2fdhJytZF68fq8YePwn/F/wBo3snjD+S/pk8hCELDQhCEACEIQAIgnW9/0sv/ADePsq/OJ3EF63U/3WWdJw/8VQzh/wCaIrm/4JeBLNhD+7yf8tFuQ0iHdOEA4kUKz6NPZyFVVU/ZD+LtUBniabIH3Er/AC0fARBusHEL+0BCEOfRA7yyfRpcqBpmWv4AvaO8bfc/M5yd1K8iNYopA3lkNxfcfUC8w0uXNGIYPHNxGJKnI7A9pXfPL2fBzkNI+TpgBdzNmZqJ7KeTUHIWyOmkveWfaIubJSPgI2YQMOc+RiXMA7o8Tcxj3Tc/15axnUlKb9o6m3gM+Zblr5lylzC4Hifr3CLkyhrUwGPQQY3fsyUBzU/X19NGNElS7Bk6n64wbSDYZqR93Y2txI7vaOuX1y8zGuQTx+AiU9SHHQxwj0EPavwj16IxOpzozHHuWY8x8gA2hiiKJ7Oqs+cb+x5BMxBfd7aTvGqjUVSMuZ845CFNa8d3YSEekQZhc76aUa4qp6eb+F4qs3RZdVvki9REE2Mx23iau0rjT9HS31rE8EQPYav+d4un6vn/AId6+6sYGP7M/wCP1R6LI9qv+X0ZPIQhCw0IQhAAhCEACIT1soJwaTkJqX8iKRNoinWbKCsAsn1VIPvbTjF+K9Lo+IvlLWmXgSHZf6GV/lo+AiuusuYTikoBJ+6R2E3Ud5fePwvnxBnPRXFibhJCxQejAbQpofhHQm4SWoupCVFilykE7poRXI6R1XZ6G1trmRbV6apJPkUScOB3yKeokskfiV8hU5tR8KiVndQH4AMBqWsPxFza2V8HZsj/AAZf8Cfy4mCNmyRaVLHJCRYuMta84c/UV+0S/TH+4pKRscDtTC50enic/wAtbRlNezLTbwAqfn7+NrqOBlf4SP4U672mtecEYGULS0CoNEpFQGBtkKco5fSGvFHS6O04MpMYJKT2/vJnsiw56eOeRvGviprndPbV7Ce6Mg+v0AAL3mNnSf8ACl/wJ03dNKcqR5TsyQLSZYvZCc6HLME+cSukF2oh9HPgpFCTZde0d45ITroTryc8qRmlbOUosRn3E0AJ9o2B4VVyi9kbNkAgiTLBDsQhNHd8uJ8zH1Oz5IDCVLArTcS3a72WeesS+kuUTldF85FFTkoRSi1P3U90H5nzP4bRqmStamub7osnJ1Gw+Ji/RsyQLSZYo3cTYu4txPnH1GzpIoJUsVeiE3rW16nzMC6SS90H0Y373yKCVg2p3lHS3hq1a2p4xk/4SsB1UewzL/DV9NYvkbOku/opbkAdxNgzC2TDyEelYGUXeWgu79lNXqXpmw8oP1PuD9L7z88KkneZIflXw5xu7HlFM+UVg7omIPByoNXwPlF8J2dJFBKlgM1EJsQARbQAeEel4CUbykGoNUpuBug2u1OUS+k01pskR6Laeu18jYiBbNUf+Oz7AeizuRuoNH8bRPYr/otME3bGMmJFEhSX4hSU5Uruwnj+zN/6/VD2T7Va/wBvoywIQhCo0IQhABhxeKRKQqZMUEoSHJNgIiGJ6ysIkEoTMXfIJc5MDkdSzcTSNnrF2VPxEhIlVSklSksd46Ecq0bMRUx2WsVV2RxofK/z4CNLExqrI7U3v5GZmZV1c9mC3cyd/wBqJI/QAH8ROjNQPnp845u3enKsTKXJXLSEqySSSKgitHNOVfCIjNwRTenDPx0rlGOXhVnL+b6RoRxKIvVIzZZmRJbLZI9k9JF4YNLWUgeoC6f3nueTedIkOE6fT6bwQRxBBNrtaxrxtpXEyWUljfTTnpHxy2bH3x1PFrnvaOYZdsNyZY2K6zFpomWhSmGrDXO/AO2psNcdZU9nKZY5Av4V958sjApUlSrD+unOPokK8rnLhWOep0LsOnm3vfqWFh+sHErruy0pd6g2fKtdPHLLYPT+Y1kAU7RBal2a5PC3HvRWrqJa/wBZx8WFGpr8PDhEPCq5ErOu04ssRfWLONEJQWFSaC9zVho1fHIOsDEMH9HdyrdIcaISTa3aV4DWuwVeArwHGPiQokM5MT1KrkR167myyD1gzqlkJHEHNm+uLt6sY/7QsQpTJQhne1SKM7lkC9S5L20rxYU+sDNLM7DQfGI6lVyJ69bzZZI6fTgGPo1KdywIS2gc8QHOlvWjVm9ZM+yUyyc1EEAVyrXTwzvFfEls2j7LQo2B+s4lYVK4oh51z4MsJHWFiKFQlpA4F1WyemepraPcnrAxKy+7LRLFyoFzpR2TTibZxXQd9T5+Uep61WUbZafzg6nVyQLOt5ssc9Yk1SgJctBqXJ3q8Ei7DU1OgtGLGdZMxIISlClEZA7qa3Ne0WowpxNhX6kqAY01Gf7384xBJiFhU8iXnX8yYz+nWMmfrBLDmiABwZSi9OArxj70d6Tqwu9uBKkqZ95wkN7IBvUvfidIYI+kkxY8avTZ03Fay7NdrV6lnJ6yVOPuklIureIyyFc3OnO8bUnrKlevKKRqFA+QID/XIVQUlnNsv5R7QVJ7QDHI6ctDFTwKX2Fy6QvXaX/sjbErEJeWasCUqDLS9t5OUdCKv6tNlz/Sif6MolkF1qvMewD1Ize3OLQjGyao1z2YvU2sa2VlalJaCNTFbMkzC65aSdWY+Yrr5mNuEUptcC9pPiR+Z0Nwh9QjxLc2NIwYroRh1AgLmId6ggmtMxpTjEnhFivsXvMqePW/dRBf7NJAtNV4pSdamz5e/wAPH9mqHczt7mimV2VYVoGytnPYRZ1y79xX1Kj9pB19AtJiWZgN0jMULG1yQGcnK50sR1eTVEfeywkPQAvnQUYPR1VvYtWxYQLLtXaDw6X2Fbp6vJoDb0tvZBU16OSHWWq5oGYDMeJnQCffsKOQ3iA+jt763bjFlwjrrtvM56jTyKuPV7iSe0UNeh0aiQc8t5R8MjmPQOeAyQgDPtOVMxDk3rq2vZsbLhE9etDqFRU03oBjD6qAPZCw5vdTcBlmPD0OrzEJDhKFqeg3mTzr86lss7XhE9ft7jn9Pp7yrJHV5iO9M3FFn3Qpg5yBI81F+AMZP/wGJWQFGWlLjspJYUzzURb4MKxZ8Ijr1pPUKSr53V/iWaX6JA1KjvGzuQKXNBpc3OXD9XE1JotAb1q7yqsWo0sNWjnJxcWXCDr1vMnqFOuuhXSOrdZ701AFGACrvVzTKvGzi5yJ6tnPangJ9lKMs6vU2ybnFgwjnrt3MnqNPIgyOreVTenEijgIAGb5nhyY6uM2H6ucKC6lTF0LA7oSCWqwHxiZwjl5dz946WJSvdIzJ6C4MKKylSlEM6lE7v4RYNYaR05XR/CptJQbXG9aufGp1N46cIrldZLjJlsaa48IoQhCKyw//9k="
}








