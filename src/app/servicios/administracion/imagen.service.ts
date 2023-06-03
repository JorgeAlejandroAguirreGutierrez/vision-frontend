import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
  })

export class ImagenService {

    convertirBase64 = async ($event: any) => new Promise((resolve) => {
        try {
          const reader = new FileReader();
          reader.readAsDataURL($event);
          reader.onload = () => {
            resolve({
              base64: (<string>reader.result).split(',')[1],
              byteArray: new TextEncoder().encode((<string>reader.result).split(',')[1])
              //byteArray: new Uint8Array(reader.result as ArrayBuffer)
            })
          };
          reader.onerror = error => {
            resolve({
              base64: reader.result
            })
          };
        } catch (e) {
          return null;
        }
      }); 
}