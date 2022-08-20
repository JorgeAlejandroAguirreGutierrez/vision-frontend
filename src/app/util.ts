'use strict';
import {HttpHeaders} from '@angular/common/http';
import { SesionService } from './servicios/sesion.service';
import * as constantes from './constantes';
import { Router } from '@angular/router';
import { Sesion } from './modelos/sesion';

export const host='http://localhost:8000/api';
export const ruta: string='/sicecuador';
export const dependiente: string='/dependiente';
export const plazoCredito: string='/plazoCredito';
export const datoAdicional: string='/datoAdicional';
export const impuesto: string='/impuesto';
export const retencionCliente: string='/retencionCliente';
export const grupoCliente: string='/grupoCliente';
export const tipoContribuyente: string='/tipoContribuyente';
export const transportista: string='/transportista';
export const ubicacion: string='/ubicacion';
export const vehiculoTransporte: string='/vehiculoTransporte';
export const empresa: string='/empresa';
export const parametro: string='/parametro';
export const usuario: string = '/usuario';
export const perfil: string = '/perfil';
export const sesion: string = '/sesion';
export const validar: string = '/validar';
export const establecimiento: string = '/establecimiento';
export const puntoVenta: string = '/puntoVenta';
export const origenIngreso: string = '/origenIngreso';
export const genero: string = '/genero';
export const estadoCivil: string = '/estadoCivil';
export const calificacionCliente: string = '/calificacionCliente';
export const tipoPago: string = '/tipoPago';
export const formaPago: string = '/formaPago';
export const cliente: string = '/cliente';
export const factura: string = '/factura';
export const facturaDetalle: string = '/facturaDetalle';
export const tipoRetencion: string = '/tipoRetencion';
export const servicio: string='/servicio';
export const caracteristica: string='/caracteristica';
export const bien: string = '/bien';
export const activoFijo: string = '/activoFijo';
export const tipo: string = '/tipo';
export const consultarTipo: string = '/consultarTipo';
export const producto: string = '/producto';
export const medida: string = '/medida';
export const buscar: string = '/buscar';
export const calcular: string = '/calcular';
export const calcularTotales: string = '/calcularTotales';
export const calcularFacturaDetalleTemp: string = '/calcularFacturaDetalleTemp';
export const identificacion: string = '/identificacion';
export const razonSocial: string = '/razonSocial';
export const codigo: string = '/codigo';
export const importar: string = '/importar';
export const impuestoPorcentaje: string = '/porcentaje';
export const secuencia: string = '/secuencia';
export const nombre: string = '/nombre';
export const banco: string= '/banco';
export const cuentaPropia: string= '/cuentaPropia';
export const franquiciaTarjeta: string= '/franquiciaTarjeta';
export const existencias: string= '/existencias';
export const bodega: string= '/bodega';
export const operadorTarjeta: string= '/operadorTarjeta';
export const tipoComprobante: string= "/tipoComprobante";
export const recaudacion: string= "/recaudacion";
export const credito: string= "/credito";
export const amortizacion: string= "/amortizacion";
export const entrega: string= "/entrega";
export const grupoProducto: string = "/grupoProducto";
export const proveedor: string = "/proveedor";
export const productoProveedor: string = "/productoProveedor";
export const consultarGrupos: string = "/consultarGrupos";
export const consultarSubgrupos: string = "/consultarSubgrupos";
export const consultarSecciones: string = "/consultarSecciones";
export const consultarLineas: string = "/consultarlineas";
export const consultarSublineas: string = "/consultarSublineas";
export const consultarPresentaciones: string = "/consultarPresentaciones";
export const consultarMovimientoContable: string = "/consultarMovimientoContable";
export const consultarProveedor: string = "/consultarProveedor";
export const cuentaContable:string= "/cuentaContable";
export const presentacionProducto: string = "/presentacionProducto";
export const obtenerGrupoProducto: string = "/obtenerGrupoProducto";
export const categoriaProducto: string = "/categoriaProducto";
export const afectacionContable: string = "/afectacionContable";
export const tipoGasto: string = "/tipoGasto";
export const modelo: string= "/modelo";
export const medidaPrecio: string= "/medidaPrecio";
export const movimientoContable: string= "/movimientoContable";
export const precio: string= "/precio";
export const segmento: string= "/segmento";
export const saldoInicialInventario: string= "/saldoInicialInventario";
export const kardex: string= "/kardex";
export const equivalenciaMedida: string= "/tablaEquivalenciaMedida";
export const buscarEquivalenciaMedida:string="/buscarMedidasEquivalentes"
export const personalizado:string="/personalizado"
export const generar: string= "/generar";
export const pdf: string= "/pdf";
export const estadoEliminado: string = "ELIMINADO"

export const credencialUsuario='admin';
export const credencialPassword='admin';
export const credencial=credencialUsuario+':'+credencialPassword;
export const headers= new HttpHeaders({'Content-Type':'application/json', 'Authorization': 'Basic '+btoa(credencial)});
export const options = {headers: headers};
export const headersCargarArchivo= new HttpHeaders({'Authorization': 'Basic '+btoa(credencial)});
export const optionsCargarArchivo = {headers: headersCargarArchivo};
export const optionsGenerarArchivo = {headers: headers, responseType: 'blob' as 'json' };

export function validarSesion(sesionService: SesionService, router: Router): Sesion{
    let sesion: Sesion=sesionService.getSesion();
    sesionService.validar(sesion).subscribe({
        next: res => {
            sesion=res.resultado as Sesion;
            return sesion;
        },
        error: err => {
            if(err.error.codigo==constantes.error_codigo_sesion_invalida){
                sesionService.cerrarSesion();
                router.navigate(['/index']);
            }
            if(err.error.codigo==constantes.error_codigo_modelo_no_existente){
                sesionService.cerrarSesion();
                router.navigate(['/index']);
            }
        }
    });
    return sesion;
}
