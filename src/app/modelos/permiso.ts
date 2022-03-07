import { Perfil } from '../modelos/perfil';

export class Permiso {
  codigo: string;
  modulo: string;
  operacion: string;
  habilitado: boolean;
  perfil: Perfil;
}
