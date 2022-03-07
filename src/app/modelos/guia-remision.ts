import { Direccion } from './direccion';
import { Transportista } from './transportista';
import { Factura } from './factura';

export class GuiaRemision {
    id: number;
    codigo: string;
    fecha: Date;
    numero: string;
    direccion: Direccion;
    telefono: string;
    celular: string;
    correo: string;
    referencia: string;
    estado: boolean;
    transportista: Transportista;
    factura: Factura;
    inhabilitar: boolean;

    constructor(){
        this.id=0;
        this.codigo="";
        this.fecha=new Date();
        this.numero="";
        this.direccion=new Direccion();
        this.telefono="";
        this.celular="";
        this.correo="";
        this.estado=false;
        this.transportista=new Transportista();
        this.factura=new Factura();
        this.inhabilitar=false;
    }

    normalizar(){
        if (this.direccion.ubicacion.id==0){
            this.direccion=new Direccion();
        }
    }
    des_normalizar(){
        this.direccion=new Direccion();
    }
}
