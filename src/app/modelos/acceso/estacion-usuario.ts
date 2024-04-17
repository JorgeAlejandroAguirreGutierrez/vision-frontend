import { Usuario } from "./usuario";
import { Estacion } from "./estacion";
import { valores } from "../../constantes";

export class EstacionUsuario {
    id:number;
    codigo:string;
    estado: string;
    usuario: Usuario;
    estacion: Estacion;

    constructor() {
        this.id=valores.cero;
        this.codigo=valores.vacio;
        this.estado=valores.estadoActivo;
        this.usuario=new Usuario();
        this.estacion=new Estacion();
    }
}
