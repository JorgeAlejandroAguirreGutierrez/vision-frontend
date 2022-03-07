import { Permiso } from '../modelos/permiso';

export class Perfil {
    id: number;
    codigo: string;
    descripcion: string;
    abreviatura: string;
    permisos: Permiso[];

    constructor() {
        this.permisos=[];
    }
}
