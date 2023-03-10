import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options } from '../../constantes';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotaCreditoElectronicaService {

  constructor(private http: HttpClient, private router: Router) { }

  enviar(notaCreditoVentaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoEletronica + urn.slash + notaCreditoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }
}
