export class Promocion {
  id: number;
  aplicacion: string;
  fecha_ini: Date;
  fecha_fin: Date;
  rango: boolean;
  rango_ini: number;
  rango_fin: number;
  cantidad_promo: number;
  precio_promo: number;
  descuento_promo:number;
  precio_ini: number;
  precio_fin: number;
  facturable:boolean;
  productos_id: number;
  medidas_id: number;
  grupo_productos_id: number;
  segmentos_id: number;
  producto_promo_id: number;
  medida_promo_id: number;
}