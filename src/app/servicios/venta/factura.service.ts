import { EventEmitter, Injectable, Output } from '@angular/core';
import { Factura } from '../../modelos/venta/factura';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
import { FacturaLinea } from '../../modelos/venta/factura-linea';

@Injectable({
  providedIn: 'root'
})
export class FacturaService {

  constructor(private http: HttpClient) { }

  @Output() eventoRecaudacion = new EventEmitter<Factura>();

  enviarEventoRecaudacion(data: Factura) {
    this.eventoRecaudacion.emit(data);
  }

  @Output() eventoEntrega = new EventEmitter<number>();

  enviarEventoEntrega(data: number) {
    this.eventoEntrega.emit(data);
  }

  crear(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultarPorProcesoSRI(procesoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorProcesoSRI + urn.slash + procesoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresa(empresaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEmpresa + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorEmpresaYProcesoSRI(empresaId: number, procesoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorEmpresaYProcesoSRI + urn.slash + empresaId + urn.slash + procesoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  consultarPorCliente(clienteId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorCliente + urn.slash + clienteId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYProcesoSRI(clienteId: number, procesoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYProcesoSRI + urn.slash + clienteId + urn.slash + procesoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEmpresaYEstado(clienteId: number, empresaId: number, estado: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEmpresaYEstado + urn.slash + clienteId + urn.slash + empresaId + urn.slash + estado, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEmpresaYProcesoSRI(clienteId: number, empresaId: number, procesoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEmpresaYProcesoSRI + urn.slash + clienteId + urn.slash + empresaId + urn.slash + procesoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  consultarPorClienteYEstadoYProcesoSRI(clienteId: number, estado: string, procesoSRI: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.consultarPorClienteYEstadoYProcesoSRI + urn.slash + clienteId + urn.slash + estado + urn.slash + procesoSRI, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  obtener(facturaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura+ urn.slash + facturaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  validarIdentificacion(identificacion: string): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.factura + urn.validarIdentificacion + urn.slash + identificacion, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(factura: Factura): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.factura, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  recaudar(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.recaudar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  anular(factura: Factura): Observable<Respuesta> {
    return this.http.patch(environment.host + urn.ruta + urn.factura + urn.anular, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  buscar(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.buscar, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcular(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcular, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
  
  calcularLinea(facturaLinea: FacturaLinea): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcularLinea, facturaLinea, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }

  calcularRecaudacion(factura: Factura): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.factura + urn.calcularRecaudacion, factura, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(err);
      })
    );
  }
}