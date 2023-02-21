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
              base64: reader.result
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