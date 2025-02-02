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
export class ReporteExistenciaService {

  constructor(private http: HttpClient) { }

  obtener(apodo: string, fechaCorte: string, empresaId: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.reporteExistencia + urn.obtener + urn.slash + apodo + urn.slash + fechaCorte + urn.slash + empresaId, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  pdf(apodo: string, fechaCorte: string, empresaId: number) {
    this.http.get(environment.host + urn.ruta + urn.reporteExistencia + urn.pdf + urn.slash + apodo + urn.slash + fechaCorte + urn.slash  + empresaId, optionsGenerarArchivo)
    .subscribe((blob: Blob) => {
      let link = document.createElement("a");
      if (link.download !== undefined) 
      {
          let url = URL.createObjectURL(blob);
          window.open(url);
      }
    });
  }

  excel(apodo: string, fechaCorte: string, empresaId: number) {
    this.http.get(environment.host + urn.ruta + urn.reporteExistencia + urn.excel + urn.slash + apodo + urn.slash + fechaCorte + urn.slash + empresaId, optionsGenerarArchivo)
    .subscribe((blob: Blob) => {
      const fileName = "reporteExistencia.xlsx";
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
}
