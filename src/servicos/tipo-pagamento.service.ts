import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/src/client';
import { TFHTTPService } from './tf-http.service';
import { Observable } from 'rxjs';
import { TipoPagamento } from '../modelos/tipo-pagamento';
import { Instituicao } from '../modelos/instituicao';

@Injectable()
export class TipoPagamentoService {
    constructor(private http: TFHTTPService) { }

    Add(oTipoPagamento: TipoPagamento): Observable<boolean> {
        return this.http.post("/api/TipoPagamento_Adicionar", oTipoPagamento)
            .map((oBody: boolean) => { return oBody })
    }


    Get(idInstituicao: number): Observable<TipoPagamento[]> {
        let oTipoPagamento: TipoPagamento = new TipoPagamento();
        oTipoPagamento.id_instituicao = idInstituicao;

        return this.http.post("/api/TipoPagamento_Obtem", oTipoPagamento)
            .map((lstBody: any) => {
                let lstTipo: TipoPagamento[] = [];

                lstBody.forEach((oBody: any) => {
                    let oTipoPagamento: TipoPagamento = new TipoPagamento()

                    oTipoPagamento.id = oBody.id;
                    oTipoPagamento.cobranca_Juros = oBody.cobranca_juros;
                    oTipoPagamento.id_instituicao = oBody.id_instituicao;
                    oTipoPagamento.is_ativo = oBody.is_ativo;
                    oTipoPagamento.nome = oBody.nome;

                    lstTipo.push(oTipoPagamento);

                });

                return lstTipo;
            })
    }


    Alter(oTipoPagamento: TipoPagamento): Observable<boolean> {
        return this.http.post("/api/TipoPagamento_Alterar", oTipoPagamento)
            .map((oBody: boolean) => { return oBody })
    }

}