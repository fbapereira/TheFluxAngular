import { Instituicao } from "./instituicao";

export class Usuario {
    id: number;
    instituicao: Instituicao;
    login: string;
    senha: string;
    isAdmin: boolean;

}