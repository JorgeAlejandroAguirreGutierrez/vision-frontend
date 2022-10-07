import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Credito } from '../../modelos/recaudacion/credito';

@Injectable({
  providedIn: 'root'
})
export class CreditoService {

  constructor(private http: HttpClient) { }

  crear(credito: Credito): Observable<Respuesta> {
    return this.http.post(environment.host + urn.ruta + urn.credito, credito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  obtener(creditoId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.credito + '/' + creditoId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  consultar(): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.credito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }

  actualizar(credito: Credito): Observable<Respuesta> {
    return this.http.put(environment.host + urn.ruta + urn.credito, credito, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  eliminar(credito: Credito): Observable<Respuesta> {
    return this.http.delete(environment.host + urn.ruta + urn.credito + '/' + credito.id, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  construir(credito: Credito): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.credito+"/construir?saldo="+credito.saldo
    +"&periodicidad="+credito.periodicidad+"&periodicidad_numero="+credito.periodicidadNumero
    +"&periodicidad_total="+credito.periodicidadTotal+"&cuotas="+credito.cuotas
    +"&fecha_primera_cuota="+credito.fechaPrimeraCuota+"&tipo="+credito.tipo+"&sin_intereses="+credito.sinIntereses, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      }));
  }
}
