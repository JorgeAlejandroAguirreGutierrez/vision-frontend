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
export const error_producto_proveedor: string="PROVEEDOR YA EXISTE PARA ESTE PRODUCTO";
export const error_kardex: string='ERROR KARDEX EXISTENTE';
export const error_kardex_VACIO: string='ERROR KARDEX VACIO';
export const error_kardex_VACIO_MENSAJE: string='INGRESA UN KARDEX';
export const error_bodega: string='ERROR EN BODEGA';
export const error_bodega_cantidad: string='LA CANTIDAD SUPERA A LA EXISTENTE';
export const error_eliminar_bodega: string='NO PUEDE ELIMINAR UNA BODEGA CON SALDO';
export const error_agregar_recaudacion="VALOR SUPERA EL MONTO DE COBRO DE LA FACTURA";
export const error_agregar_dependiente='ERROR AL AGREGAR EL DEPENDIENTE';
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
export const tab_auxiliar='Dependiente';
export const tab_calificacion_cliente='Calificacion Cliente';
export const tab_celular='Celular';
export const tab_cliente='Cliente';
export const tab_correo='Correo';
export const tab_direccion='Direccion';
export const tab_estado_civil='Estado Civil';
export const tab_forma_pago='Forma de Pago';
export const tab_genero='Genero';
export const tab_grupo_cliente='Grupo Cliente';
export const tab_impuesto='Impuesto';
export const tab_origen_ingreso='Origen de Ingreso';
export const tab_plazo_credito='Plazo de Credito';
export const tab_retencion_cliente='Retencion Cliente';
export const tab_telefono='Telefono';
export const tab_tipo_contribuyente='Tipo de Contribuyente';
export const tab_tipo_pago='Tipo de Pago';
export const tab_tipo_retencion='Tipo de Retencion';
export const tab_factura_compra='Factura de Compra';
export const tab_pago_compra='Pago de Compra';
export const tab_proveedor='Proveedor';
export const tab_proveedor_bodega='Proveedor Bodega';
export const tab_proveedor_producto='Proveedor Producto';
export const tab_egreso='Egreso';
export const tab_factura='Factura';
export const tab_pedido='Pedido';
export const tab_proforma='Proforma';
export const tab_dato_adicional='Dato Adicional';
export const tab_empresa='Empresa';
export const tab_exportacion='Exportacion';
export const tab_importacion='Importacion';
export const tab_ubicacion='Ubicacion';
export const tab_contabilizacion='Contabilizacion';
export const tab_cuenta='Cuenta';
export const tab_entrega='Entrega';
export const tab_transportista='Transportista';
export const tab_vehiculo_transporte='Vehiculo de Transporte';
export const tab_activo_fijo='Activo Fijo';
export const tab_bodega='Bodegas';
export const tab_kardex='Kardex';
export const tab_medida='Medida';
export const tab_producto='Producto';
export const tab_servicio='Servicio';
export const tab_promocion='Promocion';
export const tab_saldo_inicial_inventario='Saldo inicial';
export const tab_tabla_equivalencia_medida='Tabla Equivalencia Medida';
export const tab_usuario='Usuario';
export const tab_establecimiento='Establecimiento';
export const tab_punto_venta='Punto de Venta';
export const tab_grupo_producto='Grupo de Producto';
export const tab_segmento='Segmentos';
export const tab_movimiento_contable="Movimiento contable";
export const tab_cuenta_contable='Cuenta contable';
export const tab_recaudacion='Recaudacion';
export const tab_transferencia_bodega='Transferencia Bodega';
export const tab_mapa_cliente = 'Mapa Cliente'
export const tab_promociones = 'Promocion'


/**********************************
 * CONSTANTES PARA NOMBRAR LOS ITEMS DEL SIDEBAR
 **********************************/
//PARA CREAR TABS
export const item_auxiliar='Auxiliar';
export const item_calificacion_cliente='Calificacion de Cliente';
export const item_celular='Celular';
export const item_cliente='Cliente';
export const item_correo='Correo';
export const item_direccion='Direccion';
export const item_estado_civil='Estado Civil';
export const item_forma_pago='Forma de Pago';
export const item_genero='Genero';
export const item_grupo_cliente='Grupo de Cliente';
export const item_impuesto='Impuesto';
export const item_origen_ingreso='Origen de Ingreso';
export const item_plazo_credito='Plazo de Crédito';
export const item_retencion_cliente='Retencion de Cliente';
export const item_telefono='Telefono';
export const item_tipo_contribuyente='Tipo de Contribuyente';
export const item_tipo_pago='Tipo de Pago';
export const item_tipo_retencion='Tipo de Retencion';
export const item_factura_compra='Factura de Compra';
export const item_pago_compra='Pago de Compra';
export const item_proveedor='Proveedor';
export const item_proveedor_bodega='Proveedor de Bodega';
export const item_egreso='Egreso';
export const item_factura='Factura';
export const item_pedido='Pedido';
export const item_proforma='Proforma';
export const item_dato_adicional='Dato Adicional';
export const item_empresa='Empresa';
export const item_exportacion='Exportacion';
export const item_importacion='Importacion';
export const item_ubicacion='Ubicacion';
export const item_contabilizacion='Contabilizacion';
export const item_cuenta='Cuenta';
export const item_entrega='Entrega';
export const item_transportista='Transportista';
export const item_vehiculo_transporte='Vehiculo Transporte';
export const item_activo_fijo='Activo Fijo';
export const item_bodega='Bodega';
export const item_kardex='Kardex';
export const item_medida='Medida';
export const item_producto='Producto';
export const item_servicio='Servicios y Activos Fijos';
export const item_promocion='Promocion';
export const item_saldo_inicial_inventario='Saldo Inicial Producto';
export const item_tabla_equivalencia_medida='Tabla Equivalencia Medida';
export const item_usuario='Usuario';
export const item_establecimiento='Establecimiento';
export const item_punto_venta='Punto de Venta';
export const item_grupo_producto='Grupo Producto';
export const item_grupo_servicio='Grupo de Servicio';
export const item_segmento='Segmento';
export const item_movimiento_contable='Movimiento Contable';
export const item_cuenta_contable='Cuenta Contable';
export const item_proveedor_producto='Proveedor del producto';
export const item_recaudacion='Recaudación';
export const item_transferencia_bodega='Transferencia Bodega';
export const item_mapa_cliente = 'Mapa Cliente'
export const item_promociones = 'Promocion'

/**********************************
 * CONSTANTES CON NOMBRES DE LOS ICONOS DEL SIDEBAR
 **********************************/
//PARA CREAR TABS
export const ico_auxiliar=        'fa fa-file-text-o';
export const ico_calificacion_cliente='fa fa-star-half-o';
export const ico_celular=         'fa fa-file-text-o';
export const ico_cliente=         'fa fa-address-book';
export const ico_correo=          'fa fa-file-text-o';
export const ico_direccion=       'fa fa-address-card';
export const ico_estado_civil=    'fa fa-venus-mars';
export const ico_forma_pago=      'fa fa-cc-mastercard';
export const ico_genero=          'fa fa-mars-stroke';
export const ico_grupo_cliente=   'fa fa-users';
export const ico_impuesto=        'fa fa-university';
export const ico_origen_ingreso=  'fa fa-briefcase';
export const ico_plazo_credito=   'fa fa-calendar';
export const ico_retencion_cliente='fa fa-file-text-o';
export const ico_telefono=        'fa fa-file-text-o';
export const ico_tipo_contribuyente='fa fa-file-text-o';
export const ico_tipo_pago=       'fa fa-ticket';
export const ico_tipo_retencion=  'fa fa-retweet';
export const ico_factura_compra=  'fa fa-file-text-o';
export const ico_pago_compra=     'fa fa-file-text-o';
export const ico_proveedor=       'fa fa-truck';
export const ico_egreso=          'fa fa-file-text-o';
export const ico_factura=         'fa fa-clipboard';
export const ico_pedido=          'fa fa-file-text-o';
export const ico_proforma=        'fa fa-file-text-o';
export const ico_dato_adicional=  'fa fa-table';
export const ico_empresa=         'fa fa-building';
export const ico_exportacion=     'fa fa-download';
export const ico_importacion=     'fa fa-upload';
export const ico_ubicacion=       'fa fa-globe';
export const ico_contabilizacion= 'fa fa-file-text-o';
export const ico_cuenta=          'fa fa-file-text-o';
export const ico_entrega=         'fa fa-file-text-o';
export const ico_transportista=   'fa fa-file-text-o';
export const ico_vehiculo_transporte='fa fa-file-text-o';
export const ico_activo_fijo=     'fa fa-file-text-o';
export const ico_bodega=          'fa fa-archive';
export const ico_kardex=          'fa fa-file-text-o';
export const ico_medida=          'fa fa-medium';
export const ico_producto=        'fa fa-shopping-basket';
export const ico_servicio=        'fa fa-child';
export const ico_promocion=       'fa fa-product-hunt';
export const ico_proveedor_bodega='fa fa-bus';
export const ico_tabla_equivalencia_medida='fa fa-exchange';
export const ico_usuario=         'fa fa-file-text-o';
export const ico_establecimiento= 'fa fa-file-text-o';
export const ico_punto_venta=     'fa fa-file-text-o';
export const ico_grupo_producto=  'fa fa-object-group';
export const ico_segmento=        'fa fa-th-list';
export const ico_movimiento_contable='fa fa-retweet';
export const ico_cuenta_contable= 'fa fa-sort-amount-asc';
export const ico_recaudacion=     'fa fa-file-text-o';
export const ico_proveedor_producto='fa fa-bus';
export const ico_transferencia_bodega='fa fa-handshake-o';
export const ico_mapa_cliente = 'fa fa-map';
export const ico_promociones = 'fa fa-product-hunt';

/*********************************
 * NOMBRES DEL TAB PRICIPAL
 *********************************/
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








