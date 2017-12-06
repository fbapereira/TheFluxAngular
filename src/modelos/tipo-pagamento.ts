import { Instituicao } from "./instituicao";

export class TipoPagamento {
    id: number;
    id_instituicao: number;
    nome: string;
    cobranca_Juros: number;
    is_ativo: boolean;

}