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
export class ReporteCajaService {

  constructor(private http: HttpClient) { }

  obtener(apodo: string, fechaInicio: string, fechaFinal: string, empresaId: number, 
    billete100: number, billete50: number, billete20: number, billete10: number, billete5: number, billete2: number, billete1: number,
    moneda1: number, moneda050: number, moneda025: number, moneda010: number, moneda005: number, moneda001: number): Observable<Respuesta> {
    return this.http.get<Respuesta>(environment.host + urn.ruta + urn.reporteCaja + urn.obtener + urn.slash + apodo + urn.slash + fechaInicio + urn.slash + fechaFinal + urn.slash + empresaId
      + urn.slash + billete100 + urn.slash + billete50 + urn.slash + billete20 + urn.slash + billete10 + urn.slash + billete5 + urn.slash + billete2 + urn.slash + billete1
      + urn.slash + moneda1 + urn.slash + moneda050 + urn.slash + moneda025 + urn.slash + moneda010 + urn.slash + moneda005 + urn.slash + moneda001, options).pipe(
      map(response => response as Respuesta),
      catchError(err => {
        return throwError(()=>err);
      })
    );
  }

  pdf(apodo: string, fechaInicio: string, fechaFinal: string, empresaId: number, 
  billete100: number, billete50: number, billete20: number, billete10: number, billete5: number, billete2: number, billete1: number,
  moneda1: number, moneda050: number, moneda025: number, moneda010: number, moneda005: number, moneda001: number) {
    this.http.get(environment.host + urn.ruta + urn.reporteCaja + urn.pdf + urn.slash + apodo + urn.slash + fechaInicio + urn.slash + fechaFinal + urn.slash + empresaId
      + urn.slash + billete100 + urn.slash + billete50 + urn.slash + billete20 + urn.slash + billete10 + urn.slash + billete5 + urn.slash + billete2 + urn.slash + billete1
      + urn.slash + moneda1 + urn.slash + moneda050 + urn.slash + moneda025 + urn.slash + moneda010 + urn.slash + moneda005 + urn.slash + moneda001, optionsGenerarArchivo)
    .subscribe((blob: Blob) => {
      const fileName = "reporteCaja.pdf";
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

  excel(apodo: string, fechaInicio: string, fechaFinal: string, empresaId: number, 
    billete100: number, billete50: number, billete20: number, billete10: number, billete5: number, billete2: number, billete1: number,
    moneda1: number, moneda050: number, moneda025: number, moneda010: number, moneda005: number, moneda001: number) {
      this.http.get(environment.host + urn.ruta + urn.reporteCaja + urn.excel + urn.slash + apodo + urn.slash + fechaInicio + urn.slash + fechaFinal + urn.slash + empresaId
        + urn.slash + billete100 + urn.slash + billete50 + urn.slash + billete20 + urn.slash + billete10 + urn.slash + billete5 + urn.slash + billete2 + urn.slash + billete1
        + urn.slash + moneda1 + urn.slash + moneda050 + urn.slash + moneda025 + urn.slash + moneda010 + urn.slash + moneda005 + urn.slash + moneda001, optionsGenerarArchivo)
      .subscribe((blob: Blob) => {
        const fileName = "reporteCaja.xlsx";
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
