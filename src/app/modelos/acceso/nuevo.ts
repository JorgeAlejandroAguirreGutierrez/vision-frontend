import { valores } from "../../constantes";

export class Nuevo {
  id: number;
  codigo: string;
  identificacion: string;
  razonSocial: string;
  nombreComercial: string;
  genero: string;
  apodo: string;
  obligado: string;
  direccion: string;
  especial: string;
  numeroResolucionEspecial: string;
  agenteRetencion: string;
  numeroAgenteRetencion: string;
  regimen: string;
  granContribuyente: string;
  artesanoCalificado: string;
  facturacionInterna: string;
  provincia: string;
  canton: string;
  parroquia: string;
  telefono: string;
  celular: string;
  correo: string;
  establecimientoSRI: string;
  estacionSRI: string;
  contrasenaCertificado: string;
  contrasenaSRI: string;
  secuencialFacturaVenta: number;
  secuencialFacturaInterna: number;  
  secuencialNotaDebito: number;
  secuencialNotaCredito: number;
  secuencialGuiaRemision: number;
  secuencialRetencion: number;

    constructor() {
      this.id = valores.cero;
      this.codigo = valores.vacio;
      this.identificacion = valores.vacio;
      this.razonSocial = valores.vacio;
      this.nombreComercial = valores.vacio;
      this.genero = valores.vacio;
      this.apodo = valores.vacio;
      this.obligado = valores.no;
      this.direccion = valores.vacio;
      this.especial = valores.no;
      this.numeroResolucionEspecial = valores.vacio;
      this.agenteRetencion = valores.no;
      this.numeroAgenteRetencion = valores.vacio;
      this.regimen = valores.vacio;
      this.granContribuyente = valores.no;
      this.artesanoCalificado = valores.no;
      this.facturacionInterna = valores.no;
      this.provincia = valores.vacio;
      this.canton = valores.vacio;
      this.parroquia = valores.vacio;
      this.telefono = valores.vacio;
      this.celular = valores.vacio;
      this.correo = valores.vacio;
      this.establecimientoSRI = valores.vacio;
      this.estacionSRI = valores.vacio;
      this.contrasenaCertificado = valores.vacio;
      this.contrasenaSRI = valores.vacio;
      this.secuencialFacturaVenta = valores.uno;
      this.secuencialFacturaInterna = valores.uno;
      this.secuencialNotaDebito = valores.uno;
      this.secuencialNotaCredito = valores.uno;
      this.secuencialGuiaRemision = valores.uno;
      this.secuencialRetencion = valores.uno;
    }    
}
