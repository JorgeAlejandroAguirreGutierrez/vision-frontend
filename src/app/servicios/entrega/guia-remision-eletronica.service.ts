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
export class GuiaRemisionElectronicaService {

  constructor(private http: HttpClient, private router: Router) { }

  enviar(guiaRemisionId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.guiaRemisionElectronica + urn.slash + guiaRemisionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }

  obtenerPDF(guiaRemisionId: number) {
    this.http.get(environment.host + urn.ruta + urn.guiaRemisionElectronica + urn.obtenerPDF + urn.slash + guiaRemisionId, optionsGenerarArchivo)
    .subscribe((blob: Blob) => {
      const fileName = "guiaRemision.pdf";
      let link = document.createElement("a");
      if (link.download !== undefined) 
      {
          let url = URL.createObjectURL(blob);
          link.setAttribute("href", url);
          link.setAttribute("download", fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
      }
    });
  }

  enviarPDFYXML(guiaRemisionId: number): Observable<Respuesta> {
    return this.http.get(environment.host + urn.ruta + urn.guiaRemisionElectronica + urn.enviarPDFYXML + urn.slash + guiaRemisionId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(() => err);
      }));
  }
}
