import { Instituicao } from "./instituicao";

export class Pagamento {
    id: number;
    ano: number;
    mes: number;
    isPago: boolean;
    instituicao: Instituicao;
}
