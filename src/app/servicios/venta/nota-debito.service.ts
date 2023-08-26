import { Injectable, EventEmitter, Output } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { NotaDebito } from 'src/app/modelos/venta/nota-debito';
import { NotaDebitoLinea } from 'src/app/modelos/venta/nota-debito-linea';

@Injectable({
  providedIn: 'root'
})
export class NotaDebitoService {

  constructor(private http: HttpClient) { }

  @Output() eventoRecaudacion = new EventEmitter<NotaDebito>();

  enviarEventoRecaudacion(data: NotaDebito) {
    this.eventoRecaudacion.emit(data);
  }

  crear(notaDebitoVenta: NotaDebito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito, notaDebitoVenta, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorEstadoSRI(estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEstadoSRI + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYEstadoSRI(empresaId: number, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorEmpresaYEstadoSRI + urn.slash + empresaId + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCliente(clienteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorCliente + urn.slash + clienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEstadoSRI(clienteId: number, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorClienteYEstadoSRI + urn.slash + clienteId + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEmpresaYEstadoSRI(empresaId: number,clienteId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorClienteYEmpresaYEstadoSRI + urn.slash + empresaId + urn.slash + clienteId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYProcesoEstadoSRI(clienteId: number, proceso: string, estadoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.consultarPorClienteYProcesoYEstadoSRI + urn.slash + clienteId + urn.slash + proceso + urn.slash + estadoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  obtener(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.validarIdentificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.notaDebito, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  recaudar(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebito + urn.recaudar, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.notaDebito + urn.anular, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  calcular(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito + urn.calcular, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  calcularLinea(notaDebitoLinea: NotaDebitoLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito + urn.calcularLinea, notaDebitoLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularRecaudacion(notaDebito: NotaDebito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.notaDebito + urn.calcularRecaudacion, notaDebito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  obtenerPorFactura(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaDebito + urn.obtenerPorFactura + urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}
