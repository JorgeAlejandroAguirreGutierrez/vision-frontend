import { TabService } from './servicios/comun/tab/tab.service';

export const tabs = {
    /**
     * TABS
     */
    //Clientes
    tab_cliente: "Cliente",
    tab_segmento: "Segmentos",
    tab_grupo_cliente: "Grupo Cliente",
    tab_forma_pago: "Forma Pago",
    tab_origen_ingreso: "Origen Ingreso",
    tab_plazo_credito: "Plazo Credito",
    tab_calificacion_cliente: "Calificacion Cliente",

    //Compras
    tab_proveedor: "Proveedor",
    tab_grupo_proveedor: "Grupo Proveedor",
    tab_factura_compra: "Factura Compra",
    tab_nota_credito_compra: "Nota Crédito",
    tab_nota_debito_compra: "Nota Débito",

    //Ventas
    tab_factura: "Factura",
    tab_pedido: "Pedido",
    tab_proforma: "Proforma",
    tab_egreso: " Egreso",
    tab_nota_credito: "Nota Crédito",
    tab_nota_debito: "Nota Débito",
    tab_guia_remision: "Guia Remision",
    tab_cierre_caja: "Cierre Caja",
    tab_transportista: "Transportistas",
    tab_vehiculo_transporte: "Vehiculos",

    // Inventarios
    tab_grupo_producto: "Grupo Producto",
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
    tab_cuenta_contable: "Cuenta Contable",
    tab_movimiento_contable: "Movimiento Contable",

    // Talento Humano
    // Financiero
    // Importaciones
    // Reportes
    tab_reporte_clientes: "Clientes",
    tab_reporte_compras: "Compras",
    tab_reporte_ventas: "Ventas",
    tab_reporte_inventarios: "Invetarios",
    tab_reporte_caja_bancos: "Caja Bancos",
    tab_reporte_cuentas_cobrar: "Cuentas Cobrar",
    tab_reporte_cuentas_pagar: "Cuentas Pagar",
    tab_reporte_activos_fijos: "Activos Fijos",
    tab_reporte_produccion: "Producción",
    tab_reporte_contabilidad: "Contabilidad",
    tab_reporte_talento_humano: "Talento Humano",
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
    tab_tipo_retencion: "Tipo Retencion",
    tab_regimen: "Regimen",
    tab_exportacion: "Exportacion",
    tab_importacion: "Importacion",

    // Estadisticas
    tab_indicadores: "Indicadores",

    // Otros
    tab_retencion_cliente: "Retencion Cliente",
    tab_contabilizacion: "Contabilizacion",
    tab_saldo_inicial_inventario: "Saldo inicial",
    tab_mapa_cliente: "Mapa Cliente",

}

export const items = {
    /*** ITEMS PARA OPCIONES DEL MENU Y PERMISOS, DEBE SER IGUAL A LA TABLA MENU_OPCION*/
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
    item_nota_credito: "Notas de Crédito",
    item_nota_debito: "Notas de Débito",
    item_guia_remision: "Guias de Remision",
    item_cierre_caja: "Cierre de Caja",
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
    item_reporte_inventarios: "Inventarios",
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
    ico_grupo_cliente: 'fa-solid fa-people-group',
    ico_cliente: 'fa-solid fa-person-walking-dashed-line-arrow-right',
    ico_segmento: 'fa-solid fa-users-viewfinder',
    ico_forma_pago: 'fa-brands fa-amazon-pay',
    ico_origen_ingreso: 'fa-solid fa-hand-holding-dollar',
    ico_plazo_credito: 'fa-solid fa-money-bill-transfer',
    ico_calificacion_cliente: 'fa-solid fa-medal',

    // Compras
    ico_grupo_proveedor: 'fa-solid fa-boxes-packing',
    ico_proveedor: 'fa-solid fa-truck-moving',
    ico_factura_compra: 'fa-solid fa-cart-arrow-down',
    ico_nota_credito_compra: 'fa-solid fa-reply',
    ico_nota_debito_compra: 'fa-solid fa-share',

    // Ventas
    ico_factura: 'fa-solid fa-receipt',
    ico_pedido: 'fa fa-file-text-o',
    ico_proforma: 'fa fa-file-text-o',
    ico_egreso: 'fa fa-file-text-o',
    ico_nota_credito: 'fa-solid fa-share',
    ico_nota_debito: 'fa-solid fa-reply',
    ico_guia_remision: 'fa-solid fa-clipboard',
    ico_cierre_caja: 'fa-solid fa-file-invoice-dollar',
    ico_transportista: 'fa-regular fa-id-card',
    ico_vehiculo_transporte: 'fa-solid fa-truck-front',

    // Inventarios
    ico_grupo_producto: 'fa-regular fa-object-group',
    ico_producto: 'fa-solid fa-cubes-stacked',
    ico_kardex: 'fa-solid fa-table',
    ico_promocion: 'fa-solid fa-gift',
    ico_proveedor_producto: 'fa fa-bus',
    ico_transferencia_bodega: 'fa fa-handshake-o',
    ico_bodega: 'fa-solid fa-warehouse',
    ico_medida: 'fa-solid fa-weight-scale',
    ico_equivalencia_medida: 'fa fa-exchange',

    // Caja Bancos
    ico_cuenta_propia: 'fa-regular fa-rectangle-list',
    ico_banco: 'fa-solid fa-building-columns',

    // Contabilidad
    ico_cuenta_contable: 'fa-solid fa-arrow-down-short-wide',
    ico_movimiento_contable: 'fa-solid fa-retweet',

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
    ico_usuario: 'fa-solid fa-user-gear',
    ico_empresa: 'fa-solid fa-building-user',
    ico_estacion_usuario: 'fa fa-street-view',
    ico_establecimiento: 'fa-solid fa-house-chimney-window',
    ico_estacion: 'fa-solid fa-house-laptop',
    ico_perfil: 'fa-regular fa-id-card',
    ico_permiso: 'fa-solid fa-user-check',

    // Configuración
    ico_ubicacion: 'fa-solid fa-map-location-dot',
    ico_estado_civil: 'fa-solid fa-venus-mars',
    ico_impuesto: 'fa-solid fa-money-bill-wheat',
    ico_secuencial: 'fa-solid fa-list-ol',
    ico_tipo_retencion: 'fa-regular fa-handshake',
    ico_regimen: 'fa-solid fa-fax',
    ico_exportacion: 'fa-solid fa-file-export',
    ico_importacion: 'fa-solid fa-file-import',

    // Estadisticas
    ico_indicadores: 'fa-solid fa-chart-column',

    // Otros
    ico_contabilizacion: 'fa fa-file-text-o',
    ico_proveedor_bodega: 'fa fa-bus',
    ico_mapa_cliente: 'fa fa-map',
}

export function tab_activo(tabService: TabService) {
    for (let i = 0; i < tabService.tabs.length; i++) {
        if (tabService.tabs[i].active) {
            return i;
        }
    }
}