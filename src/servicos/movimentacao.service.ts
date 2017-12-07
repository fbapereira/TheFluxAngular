import { Injectable } from '@angular/core';

import { Movimentacao } from '../modelos/movimentacao';
import { Observable } from 'rxjs';
import { TFHTTPService } from './tf-http.service';
import * as moment from 'moment';
import { observeOn } from 'rxjs/operators/observeOn';

@Injectable()
export class MovimentacaoService {
    constructor(private http: TFHTTPService) { }

    Add(oTipoMovimentacao: Movimentacao): Observable<boolean> {
        let obj: any = oTipoMovimentacao;

        obj.idTipoMovimentacao = oTipoMovimentacao.tipoMovimentacao.id;
        obj.idTipoPagamento = oTipoMovimentacao.tipoPagamento.id;
        obj.idUsuario = oTipoMovimentacao.usuario.id;

        let movimentacaos: Movimentacao[] = [];
        debugger;
        for (var _i = 0; _i < oTipoMovimentacao.repetir; _i++) {
            let sendData: any = new Movimentacao();

            sendData.isEntrada = obj.isEntrada;
            sendData.idUsuario = obj.idUsuario;
            sendData.idTipoMovimentacao = obj.idTipoMovimentacao;
            sendData.idTipoPagamento = obj.idTipoPagamento;
            sendData.descricao = obj.descricao;
            sendData.valor = obj.valor;

            sendData.data = moment(oTipoMovimentacao.data).add(_i, "M");
            movimentacaos.push(sendData);
        }

        let serviceArray: Observable<any>[] = [];
        movimentacaos.forEach((mov: Movimentacao) => {
            serviceArray.push(this.http.post("/api/MovimentacaoPessoal_Adicionar", mov));
        })

        return Observable.create(function (observer) {
            Observable.forkJoin(serviceArray).subscribe(() => {
                observer.next(true);
                observer.complete();
            });
        })
    }
}