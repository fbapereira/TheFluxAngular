import { Usuario } from "./usuario";
import { TipoMovimentacao } from "./tipo-movimentacao";

export class Movimentacao {
    id: number;
    usuario: Usuario;
    tipoMovimentacao: TipoMovimentacao;
    isEntrada: Boolean;
    descricao: string;
    valor: number;
    data: String;

}