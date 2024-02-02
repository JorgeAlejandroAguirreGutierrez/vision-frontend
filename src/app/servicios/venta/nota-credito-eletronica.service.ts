import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { urn, options, optionsGenerarArchivo } from '../../constantes';
import { environment } from '../../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class NotaCreditoElectronicaService {

  constructor(private http: HttpClient, private router: Router) { }

  enviar(notaCreditoVentaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoElectronica + urn.slash + notaCreditoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  imprimirPDF(notaCreditoVentaId: number) {
    this.http.get(environment.host + urn.ruta + urn.notaCreditoElectronica + urn.obtenerPDF + urn.slash + notaCreditoVentaId, optionsGenerarArchivo)
    .subscribe((blob: Blob) => {
      let link = document.createElement("a");
      if (link.download !== undefined) 
      {
          let url = URL.createObjectURL(blob);
          window.open(url);
      }
    });
  }
  enviarPDFYXML(notaCreditoVentaId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.notaCreditoElectronica + urn.enviarPDFYXML + urn.slash + notaCreditoVentaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }
}
