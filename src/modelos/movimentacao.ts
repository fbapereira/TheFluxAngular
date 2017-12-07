import { Usuario } from "./usuario";
import { TipoMovimentacao } from "./tipo-movimentacao";
import { TipoPagamento } from "./tipo-pagamento";

export class Movimentacao {
    id: number;
    usuario: Usuario;
    tipoMovimentacao: TipoMovimentacao;
    tipoPagamento: TipoPagamento;
    isEntrada: Boolean;
    descricao: string;
    valor: number;
    data: any;
    repetir: number;

}