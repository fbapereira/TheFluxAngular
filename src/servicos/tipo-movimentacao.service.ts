import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/src/client';
import { TFHTTPService } from './tf-http.service';
import { TipoMovimentacao } from '../modelos/tipo-movimentacao';
import { Observable } from 'rxjs';

@Injectable()
export class TipoMovimentacaoService {
    constructor(private http: TFHTTPService) { }

    Add(oTipoMovimentacao: TipoMovimentacao): Observable<boolean> {
        return this.http.post("/api/TipoMovimentacao", oTipoMovimentacao)
            .map((oBody: boolean) => { return oBody })
    }


    Get(idInstituicao: number): Observable<TipoMovimentacao[]> {
        return this.http.get("/api/TipoMovimentacao/" + idInstituicao)
            .map((lstBody: any) => {
                let lstTipo: TipoMovimentacao[] = [];

                lstBody.forEach((oBody: any) => {
                    let oTipoMovimentacao: TipoMovimentacao = new TipoMovimentacao()

                    oTipoMovimentacao.id = oBody.id;
                    oTipoMovimentacao.descricao = oBody.descricao;
                    oTipoMovimentacao.id_instituicao = oBody.id_instituicao;
                    oTipoMovimentacao.isCancelado = oBody.is_canceled;

                    lstTipo.push(oTipoMovimentacao);

                });

                return lstTipo;
            })
    }


    AlterStatus(idTipoMovimentacao: number, toActive: boolean): Observable<boolean> {
        let oNumber: string = toActive ? "1" : "0";
        return this.http.get("/api/TipoMovimentacao/AlteraStatus/" + idTipoMovimentacao + "/" + oNumber)
            .map((oBody: boolean) => { return oBody })
    }

}