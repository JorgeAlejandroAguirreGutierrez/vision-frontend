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
     estacion: "/puntoVenta",
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
     servicio: "/servicio",
     caracteristica: "/caracteristica",
     bien: "/bien",
     activoFijo: "/activoFijo",
     tipo: "/tipo",
     consultarTipo: "/consultarTipo",
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
     ivaBien: "/ivaBien",
     ivaServicio: "/ivaServicio",
     rentaBien: "/rentaBien",
     rentaServicio: "/rentaServicio",
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
     vacio : "",
     espacio : " ",
     activo : "ACTIVO",
     inactivo : "INACTIVO",
     abierto : "ABIERTO",
     cerrado : "CERRADO",
     pendiente : "PENDIENTE",
     norecaudado : "NO RECAUDADO",
     recaudado : "RECAUDADO",
     emitida : "EMITIDA",
     anulada: "ANULADA",
     facturada: "FACTURADA",
     nofacturada: "NO FACTURADA",
     si : "SI",
     no : "NO",
     latCiudad: -1.6705413480437092,
     lngCiudad: -78.64974203645144
}

export const preguntas = [
    /**
     * Preguntas de seguridad para usuarios
     */
    { pregunta: '¿Cúal es el nombre de tu mascota?' },
    { pregunta: '¿Cúal es el apellido de tu Abuela materna?' },
    { pregunta: '¿Cúal es el nombre de tu equipo preferido?' },
    { pregunta: '¿Cúal es tu marca de vehículo preferido?' },
]
    
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
     si : "SI",
     no : "NO"
}

export const otras ={
    /**
     * OTRAS
     */
     estadoEliminado : "ELIMINADO",
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
     modulo_contabilidad: "CONTABILIDAD",
     modulo_financiero: "FINANCIERO",
     modulo_activos_fijos: "ACTIVOS FIJOS",
     modulo_talento_humano: "TALENTO HUMANO",
     modulo_produccion: "PRODUCCION",
     modulo_importacion: "IMPORTACION",
     modulo_configuracion: "CONFIGURACION",
     modulo_estadisticas: "ESTADISTICAS",
     modulo_control: "CONTROL",
     modulo_auditoria: "AUDITORIA",
     modulo_usuarios: "USUARIOS",
     modulo_accesos: "ACCESOS"
}    

export const tabs = {
    /**
     * TABS
     */
     tab_auxiliar: "Dependiente",
     tab_calificacion_cliente: "Calificacion Cliente",
     tab_celular: "Celular",
     tab_cliente: "Cliente",
     tab_correo: "Correo",
     tab_direccion: "Direccion",
     tab_estado_civil: "Estado Civil",
     tab_forma_pago: "Forma de Pago",
     tab_genero: "Genero",
     tab_grupo_cliente: "Grupo Cliente",
     tab_impuesto: "Impuesto",
     tab_origen_ingreso: "Origen de Ingreso",
     tab_plazo_credito: "Plazo de Credito",
     tab_retencion_cliente: "Retencion Cliente",
     tab_telefono: "Telefono",
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
     tab_promociones: "Promocion",
     tab_indicadores: "Indicadores",
}
    
export const items = {
    /**
     * ITEMS
     */
     item_auxiliar : "Auxiliar",
     item_calificacion_cliente : "Calificacion de Cliente",
     item_celular : "Celular",
     item_cliente : "Cliente",
     item_correo : "Correo",
     item_direccion : "Direccion",
     item_estado_civil : "Estado Civil",
     item_forma_pago : "Forma de Pago",
     item_genero : "Genero",
     item_grupo_cliente : "Grupo de Cliente",
     item_impuesto : "Impuesto",
     item_origen_ingreso : "Origen de Ingreso",
     item_plazo_credito : "Plazo de Crédito",
     item_retencion_cliente : "Retencion de Cliente",
     item_telefono : "Telefono",
     item_tipo_contribuyente : "Tipo de Contribuyente",
     item_tipo_pago : "Tipo de Pago",
     item_tipo_retencion : "Tipo de Retencion",
     item_factura_compra : "Factura de Compra",
     item_pago_compra : "Pago de Compra",
     item_proveedor : "Proveedor",
     item_grupo_proveedor : "Grupo Proveedor",
     item_proveedor_bodega : "Proveedor de Bodega",
     item_egreso : "Egreso", 
     item_factura : "Factura",
     item_pedido : "Pedido",
     item_proforma : "Proforma",
     item_empresa : "Empresa",
     item_exportacion : "Exportacion",
     item_importacion : "Importacion",
     item_ubicacion : "Ubicacion",
     item_contabilizacion : "Contabilizacion",
     item_cuenta : "Cuenta",
     item_entrega : "Entrega",
     item_transportista : "Transportista",
     item_vehiculo_transporte : "Vehiculo Transporte",
     item_activo_fijo : "Activo Fijo",
     item_bodega : "Bodega",
     item_kardex : "Kardex",
     item_medida : "Medida",
     item_producto : "Producto",
     item_servicio : "Servicios y Activos Fijos",
     item_promocion : "Promocion",
     item_saldo_inicial_inventario : "Saldo Inicial Producto",
     item_equivalencia_medida : "Equivalencia Medida",
     item_usuario : "Usuario",
     item_estacion_usuario : "Estación Usuario",
     item_establecimiento : "Establecimiento",
     item_estacion : "Estación",
     item_perfil : "Perfil",
     item_permiso : "Permiso",
     item_grupo_producto : "Grupo Producto",
     item_grupo_servicio : "Grupo de Servicio",
     item_segmento : "Segmento",
     item_movimiento_contable : "Movimiento Contable",
     item_cuenta_contable : "Cuenta Contable",
     item_proveedor_producto : "Proveedor del producto",
     item_recaudacion : "Recaudación",
     item_transferencia_bodega : "Transferencia Bodega",
     item_mapa_cliente : "Mapa Cliente",
     item_promociones : "Promocion",
     item_indicadores : "Dashboard"
}
    
export const icos = {
    /**
     * ICOS
     */
     ico_auxiliar : 'fa fa-file-text-o',
     ico_calificacion_cliente : 'fa fa-star-half-o',
     ico_celular : 'fa fa-file-text-o',
     ico_cliente : 'fa fa-address-book',
     ico_correo : 'fa fa-file-text-o',
     ico_direccion : 'fa fa-address-card',
     ico_estado_civil : 'fa fa-venus-mars',
     ico_forma_pago : 'fa fa-cc-mastercard',
     ico_genero : 'fa fa-mars-stroke',
     ico_grupo_cliente : 'fa fa-users',
     ico_impuesto : 'fa fa-university',
     ico_origen_ingreso : 'fa fa-briefcase',
     ico_plazo_credito : 'fa fa-calendar',
     ico_retencion_cliente : 'fa fa-file-text-o',
     ico_telefono : 'fa fa-file-text-o',
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
     ico_promocion : 'fa fa-product-hunt',
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
     ico_promociones : 'fa fa-product-hunt',
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








