import { Injectable } from '@angular/core';
import { Respuesta } from '../../respuesta';
import { urn, options, optionsGenerarArchivo } from '../../constantes';
import {HttpClient} from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReporteKardexService {

  constructor(private http: HttpClient) { }

  pdf(apodo: string, fechaInicio: string, fechaFinal: string, empresaId: number) {
    this.http.get(environment.host + urn.ruta + urn.reporteKardex + urn.pdf + urn.slash + apodo + urn.slash + fechaInicio + urn.slash + fechaFinal + urn.slash + empresaId, optionsGenerarArchivo)
    .subscribe((blob: Blob) => {
      const fileName = "reporteKardex.pdf";
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

  obtener(apodo: string, fechaInicio: string, fechaFinal: string, empresaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.reporteKardex + urn.obtener + urn.slash + apodo + urn.slash + fechaInicio + urn.slash + fechaFinal + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }
}
