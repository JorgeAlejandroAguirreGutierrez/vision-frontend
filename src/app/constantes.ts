'use strict';

import { TabService } from './componentes/services/tab.service';

export const exito_agregar_detalle_factura='SE AGREGO EL DETALLE';
export const exito_crear_factura='SE CREO LA FACTURA';
export const exito_actualizar_factura='SE ACTUALIZO LA FACTURA';
export const error_unidad_kardex: string='ERROR EN UNIDAD KARDEX';
export const error_impuesto: string='ERROR EN IMPUESTO';
export const error_costo: string='ERROR EN COSTO';
export const error_medida: string='ERROR EN MEDIDA, DEBE SELECCIONAR UNA MEDIDA PARA EL KARDEX';
export const error_nombre_producto: string='INGRESE UN NOMBRE VÁLIDO';
export const error_grupo_producto: string='SELECCIONE UN GRUPO PARA EL PRODUCTO';
export const error_sub_grupo_producto: string='ERROR EN SUB GRUPO DE PRODUCTO';
export const error_seccion_producto: string='ERROR EN SECCION DE PRODUCTO';
export const error_linea_producto: string='ERROR EN LINEA DE PRODUCTO';
export const error_sub_linea_producto: string='ERROR EN SUB LINEA DE PRODUCTO';
export const error_presentacion_producto: string='ERROR EN PRESENTACION DE PRODUCTO';
export const error_medida_kardex: string='SELECCIONE UNA MEDIDA PARA EL KARDEX DEL PRODUCTO';
export const error_saldo_inicial: string='AGREGUE EL SALDO INICIAL PARA EL KARDEX';
export const error_tipo_gasto: string='ERROR EN TIPO DE GASTO';
export const error_tipo_producto: string='ERROR EN TIPO DE PRODUCTO';
export const error_kardex_inicial: string='ERROR EN KARDEX INICIAL';
export const error_cantidad: string='INGRESE UNA CANTIDAD VÁLIDA';
export const error_costo_unitario: string='INGRESE UN COSTO UNITARIO VÁLIDO';
export const error_costo_total: string='COSTO TOTAL NO SE PUEDE DETERMINAR';
export const error_precio: string='INGRESE UN PRECIO';
export const error_producto: string='ERROR EN EL PRODUCTO';
export const error_kardex: string='ERROR KARDEX EXISTENTE';
export const error_kardex_VACIO: string='ERROR KARDEX VACIO';
export const error_kardex_VACIO_MENSAJE: string='INGRESA UN KARDEX';
export const error_bodega: string='ERROR EN BODEGA';
export const error_agregar_recaudacion="VALOR SUPERA EL MONTO DE COBRO DE LA FACTURA";
export const error_swal='error';
export const error='Error';
export const mensaje_kardex_inicial: string='Está seguro que quiere inicializar el kardex con saldo 0';
export const advertencia_swal='warning';
export const advertencia='Advertencia';
export const exito_swal='success';
export const exito='Exito';
export const si_seguro="SI, ESTOY SEGURO";
export const SI="SI";
export const NO="NO";
export const vacio="";
export const espacio=" ";
export const estadoActivo = "ACTIVO";
export const estadoInactivo = "INACTIVO";
export const estadoEliminado = "ELIMINADO";
export const recaudado="RECAUDADO";
export const norecaudado="NORECAUDADO";
export const identificacion_consumidor_final="9999999999999";
export const tipo_contribuyente_natural="NATURAL";
export const tipo_contribuyente_juridica="JURIDICA";
export const tipo_contribuyente_publica="PUBLICA";
export const tabla_amortizacion_francesa: string='FRANCESA';
export const tabla_amortizacion_alemana: string='ALEMANA';
export const modelo_amortizacion: string='MODELO_AMORTIZACION';
export const periodicidad: string='PERIODICIDAD';
export const periodo: string='PERIODO';
export const operacion_inicial_kardex: string='INVENTARIO INICIAL';
export const formas_pago: string[]=["CHEQUES", "DEPOSITOS", "TRANSFERENCIAS", "TARJETA DE CREDITO", "TARJETA DE DEBITO", "COMPENSACIONES", "RETENCION VENTAS"];
export const pregunta_eliminar_cheque="Realmente quiere eliminar el cheque?";
export const pregunta_eliminar_deposito="Realmente quiere eliminar el deposito?";
export const pregunta_eliminar_transferencia="Realmente quiere eliminar la transferencia?";
export const pregunta_eliminar_tarjeta_credito="Realmente quiere eliminar la tarjeta de crédito?";
export const pregunta_eliminar_tarjeta_debito="Realmente quiere eliminar la tarjeta de debito?";
export const pregunta_eliminar_compensacion="Realmente quiere eliminar la compensacion?";
export const pregunta_eliminar_retencion_venta="Realmente quiere eliminar la retencion en la venta?";

//CODIGOS DE ERROR
export const error_codigo_modelo_existente="4001";
export const error_codigo_modelo_no_existente="4002";
export const error_codigo_suscripcion_invalida="4003";
export const error_codigo_sesion_invalida="4004";
export const error_codigo_datos_invalidos="4005";
export const error_codigo_generico="4000";


//CAMPOS PARA CONSULTAS DINAMICAS
export const codigo="codigo";
export const descripcion="descripcion";
export const abreviatura="abreviatura";

/**********************************
 * CONSTANTES PARA NOMBRAR LOS TITULOS DE LOS TABS
 **********************************/
//PARA CREAR TABS
export const tab_crear_auxiliar='Dependientes';
export const tab_crear_calificacion_cliente='Calificaciones';
export const tab_crear_celular='Crear Celular';
export const tab_crear_cliente='Gestion Clientes';
export const tab_crear_correo='Crear Correo';
export const tab_crear_direccion='Crear Direccion';
export const tab_crear_estado_civil='Estados Civiles';
export const tab_crear_forma_pago='Formas de Pago';
export const tab_crear_genero='Crear Genero';
export const tab_crear_grupo_cliente='Grupo Clientes';
export const tab_crear_impuesto='Impuestos';
export const tab_crear_origen_ingreso='Origen de Ingresos';
export const tab_crear_plazo_credito='Plazos de Credito';
export const tab_crear_retencion_cliente='Crear Retencion Cliente';
export const tab_crear_telefono='Crear Telefono';
export const tab_crear_tipo_contribuyente='Crear Tipo de Contribuyente';
export const tab_crear_tipo_pago='Crear Tipo de Pago';
export const tab_crear_tipo_retencion='Crear Tipo de Retencion';
export const tab_crear_factura_compra='Crear Factura de Compra';
export const tab_crear_pago_compra='Crear Pago de Compra';
export const tab_crear_proveedor='Proveedores';
export const tab_crear_proveedor_bodega='Proveedor-Bodega';
export const tab_crear_proveedor_producto='Proveedor-Producto';
export const tab_crear_egreso='Crear Egreso';
export const tab_crear_factura='Facturar';
export const tab_crear_pedido='Crear Pedido';
export const tab_crear_proforma='Crear Proforma';
export const tab_crear_dato_adicional='Crear Dato Adicional';
export const tab_crear_empresa='Crear Empresa';
export const tab_crear_exportacion='Crear Exportacion';
export const tab_crear_importacion='Crear Importacion';
export const tab_crear_ubicacion='Crear Ubicacion';
export const tab_crear_contabilizacion='Crear Contabilizacion';
export const tab_crear_cuenta='Crear Cuenta';
export const tab_crear_entrega='Crear Entrega';
export const tab_crear_transportista='Crear Transportista';
export const tab_crear_vehiculo_transporte='Crear Vehiculo de Transporte';
export const tab_crear_activo_fijo='Crear Activo Fijo';
export const tab_crear_bodega='Bodegas';
export const tab_crear_kardex='Crear Kardex';
export const tab_crear_medida='Crear Medida';
export const tab_crear_producto='Productos';
export const tab_crear_servicio='Crear Servicio-AF';
export const tab_crear_promocion='Crear Promocion';
export const tab_crear_saldo_inicial_inventario='Saldo inicial';
export const tab_crear_tabla_equivalencia_medida='Equivalencias';
export const tab_crear_usuario='Crear Usuario';
export const tab_crear_establecimiento='Crear Establecimiento';
export const tab_crear_punto_venta='Crear Punto de Venta';
export const tab_crear_grupo_producto='Configurar Grupos';
export const tab_crear_segmento='Segmentos';
export const tab_crear_movimiento_contable="Movimientos contables";
export const tab_crear_cuenta_contable='Cuentas contables';
export const tab_crear_recaudacion='Recaudacion';
export const tab_crear_transferencia_bodega='Transferencia-bodega';



/**********************************
 * CONSTANTES PARA NOMBRAR LOS ITEMS DEL SIDEBAR
 **********************************/
//PARA CREAR TABS
export const item_crear_auxiliar='Crear Auxiliar';
export const item_crear_calificacion_cliente='Calificaciones';
export const item_crear_celular='Crear Celular';
export const item_crear_cliente='Clientes';
export const item_crear_correo='Crear Correo';
export const item_crear_direccion='Crear Direccion';
export const item_crear_estado_civil='Estados Civiles';
export const item_crear_forma_pago='Formas de Pago';
export const item_crear_genero='Generos';
export const item_crear_grupo_cliente='Grupos';
export const item_crear_impuesto='Crear Impuesto';
export const item_crear_origen_ingreso='Origen de los Ingresos';
export const item_crear_plazo_credito='Plazos de Crédito';
export const item_crear_retencion_cliente='Crear Retencion Cliente';
export const item_crear_telefono='Crear Telefono';
export const item_crear_tipo_contribuyente='Crear Tipo de Contribuyente';
export const item_crear_tipo_pago='Tipos de Pago';
export const item_crear_tipo_retencion='Crear Tipo de Retencion';
export const item_crear_factura_compra='Crear Factura de Compra';
export const item_crear_pago_compra='Crear Pago de Compra';
export const item_crear_proveedor='Proveedores';
export const item_crear_proveedor_bodega='Proveedores y Bodegas';
export const item_crear_egreso='Crear Egreso';
export const item_crear_factura='Facturar';
export const item_crear_pedido='Crear Pedido';
export const item_crear_proforma='Crear Proforma';
export const item_crear_dato_adicional='Crear Dato Adicional';
export const item_crear_empresa='Crear Empresa';
export const item_crear_exportacion='Crear Exportacion';
export const item_crear_importacion='Crear Importacion';
export const item_crear_ubicacion='Crear Ubicacion';
export const item_crear_contabilizacion='Crear Contabilizacion';
export const item_crear_cuenta='Crear Cuenta';
export const item_crear_entrega='Crear Entrega';
export const item_crear_transportista='Crear Transportista';
export const item_crear_vehiculo_transporte='Crear Vehiculo de Transporte';
export const item_crear_activo_fijo='Crear Activo Fijo';
export const item_crear_bodega='Bodegas';
export const item_crear_kardex='Crear Kardex';
export const item_crear_medida='Medidas';
export const item_crear_producto='Productos';
export const item_crear_servicio='Servicios y Activos Fijos';
export const item_crear_promocion='Crear Promocion';
export const item_crear_saldo_inicial_inventario='Saldo Inicial Producto';
export const item_crear_tabla_equivalencia_medida='Equivalencia Medidas';
export const item_crear_usuario='Crear Usuario';
export const item_crear_establecimiento='Crear Establecimiento';
export const item_crear_punto_venta='Crear Punto de Venta';
export const item_crear_grupo_producto='Configurar Grupos';
export const item_crear_grupo_servicio='Configurar Servicios';
export const item_crear_segmento='Segmentos';
export const item_crear_movimiento_contable='Movimientos Contables';
export const item_crear_cuenta_contable='Plan de cuentas';
export const item_crear_proveedor_producto='Proveedor del producto';
export const item_crear_recaudacion='Recaudación';
export const item_crear_transferencia_bodega='Transferencia Bodegas';

/**********************************
 * CONSTANTES CON NOMBRES DE LOS ICONOS DEL SIDEBAR
 **********************************/
//PARA CREAR TABS
export const ico_crear_auxiliar=        'fa fa-file-text-o';
export const ico_crear_calificacion_cliente='fa fa-star-half-o';
export const ico_crear_celular=         'fa fa-file-text-o';
export const ico_crear_cliente=         'fa fa-user-plus';
export const ico_crear_correo=          'fa fa-file-text-o';
export const ico_crear_direccion=       'fa fa-address-card';
export const ico_crear_estado_civil=    'fa fa-venus-mars';
export const ico_crear_forma_pago=      'fa fa-cc-mastercard';
export const ico_crear_genero=          'fa fa-mars-stroke';
export const ico_crear_grupo_cliente=   'fa fa-users';
export const ico_crear_impuesto=        'fa fa-file-text-o';
export const ico_crear_origen_ingreso=  'fa fa-briefcase';
export const ico_crear_plazo_credito=   'fa fa-credit-card';
export const ico_crear_retencion_cliente='fa fa-file-text-o';
export const ico_crear_telefono=        'fa fa-file-text-o';
export const ico_crear_tipo_contribuyente='fa fa-file-text-o';
export const ico_crear_tipo_pago=       'fa fa-ticket';
export const ico_crear_tipo_retencion=  'fa fa-file-text-o';
export const ico_crear_factura_compra=  'fa fa-file-text-o';
export const ico_crear_pago_compra=     'fa fa-file-text-o';
export const ico_crear_proveedor=       'fa fa-truck';
export const ico_crear_egreso=          'fa fa-file-text-o';
export const ico_crear_factura=         'fa fa-clipboard';
export const ico_crear_pedido=          'fa fa-file-text-o';
export const ico_crear_proforma=        'fa fa-file-text-o';
export const ico_crear_dato_adicional=  'fa fa-file-text-o';
export const ico_crear_empresa=         'fa fa-file-text-o';
export const ico_crear_exportacion=     'fa fa-file-text-o';
export const ico_crear_importacion=     'fa fa-file-text-o';
export const ico_crear_ubicacion=       'fa fa-file-text-o';
export const ico_crear_contabilizacion= 'fa fa-file-text-o';
export const ico_crear_cuenta=          'fa fa-file-text-o';
export const ico_crear_entrega=         'fa fa-file-text-o';
export const ico_crear_transportista=   'fa fa-file-text-o';
export const ico_crear_vehiculo_transporte='fa fa-file-text-o';
export const ico_crear_activo_fijo=     'fa fa-file-text-o';
export const ico_crear_bodega=          'fa fa-archive';
export const ico_crear_kardex=          'fa fa-file-text-o';
export const ico_crear_medida=          'fa fa-medium';
export const ico_crear_producto=        'fa fa-shopping-basket';
export const ico_crear_servicio=        'fa fa-child';
export const ico_crear_promocion=       'fa fa-product-hunt';
export const ico_crear_proveedor_bodega='fa fa-bus';
export const ico_crear_tabla_equivalencia_medida='fa fa-exchange';
export const ico_crear_usuario=         'fa fa-file-text-o';
export const ico_crear_establecimiento= 'fa fa-file-text-o';
export const ico_crear_punto_venta=     'fa fa-file-text-o';
export const ico_crear_grupo_producto=  'fa fa-object-group';
export const ico_crear_segmento=        'fa fa-th-list';
export const ico_crear_movimiento_contable='fa fa-retweet';
export const ico_crear_cuenta_contable= 'fa fa-sort-amount-asc';
export const ico_crear_recaudacion=     'fa fa-file-text-o';
export const ico_crear_proveedor_producto='fa fa-bus';
export const ico_crear_transferencia_bodega='fa fa-handshake-o';

/*********************************
 * CONSTANTES PARA OTROS COMPONENTES
 *********************************/
export const tab_mapa_cliente = 'Mapa Cliente'
export const item_mapa_cliente = 'Mapa Cliente'
export const ico_mapa_cliente = 'fa fa-map';
export const tab_promociones = 'Promociones'
export const item_promociones = 'Promociones/Combos'
export const ico_promociones = 'fa fa-product-hunt';

//NOMBRES DEL TAB PRICIPAL
export const modulo_clientes='CLIENTES';
export const modulo_compras='COMPRAS';
export const modulo_ventas='VENTAS';
export const modulo_inventarios='INVENTARIOS';
export const modulo_contabilidad='CONTABILIDAD';
export const modulo_financiero='FINANCIERO';
export const modulo_activos_fijos='ACTIVOS FIJOS';
export const modulo_talento_humano='TALENTO HUMANO';
export const modulo_produccion='PRODUCCION';
export const modulo_importacion='IMPORTACION';
export const modulo_configuracion='CONFIGURACION';
export const modulo_estadisticas='ESTADISTICAS';
export const modulo_control='CONTROL';
export const modulo_auditoria='AUDITORIA';
export const modulo_usuarios='USUARIOS';

export function tab_activo(tabService: TabService){
    for(let i=0; i<tabService.tabs.length; i++){
        if(tabService.tabs[i].active){
        return i;
        }
    }
}








