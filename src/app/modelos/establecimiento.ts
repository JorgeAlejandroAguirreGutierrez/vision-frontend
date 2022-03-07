import { Ubicacion } from '../modelos/ubicacion';
import { Empresa } from '../modelos/empresa';

export class Establecimiento {
    id:number;
    codigo:string;
    direccion:string;
    empresa: Empresa;
    ubicacion: Ubicacion;
}
