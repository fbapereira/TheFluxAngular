import { Injectable } from '@angular/core';

import { Movimentacao } from '../modelos/movimentacao';
import { Observable } from 'rxjs';
import { TFHTTPService } from './tf-http.service';
import * as moment from 'moment';
import { observeOn } from 'rxjs/operators/observeOn';
import { Usuario } from '../modelos/usuario';
import { TipoMovimentacao } from '../modelos/tipo-movimentacao';
import { TipoPagamento } from '../modelos/tipo-pagamento';

@Injectable()
export class MovimentacaoService {
    constructor(private http: TFHTTPService) { }

    Obtem(oUsuario: Usuario): Observable<Movimentacao[]> {
        return this.http.post("/api/MovimentacaoPessoal_Obtem", oUsuario)
            .map((movimentacaos: any) => {
                let movimentacaosRetorno: Movimentacao[] = [];

                movimentacaos.forEach((movimentacao: any) => {
                    let movimentacaoRetorno: Movimentacao = new Movimentacao();
                    movimentacaoRetorno.data = movimentacao.data;
                    movimentacaoRetorno.descricao = movimentacao.descricao;
                    movimentacaoRetorno.id = movimentacao.id;
                    movimentacaoRetorno.isEntrada = movimentacao.isEntrada;
                    movimentacaoRetorno.tipoMovimentacao = new TipoMovimentacao();
                    movimentacaoRetorno.tipoMovimentacao.id = movimentacao.idTipoMovimentacao;
                    movimentacaoRetorno.tipoPagamento = new TipoPagamento();
                    movimentacaoRetorno.tipoPagamento.id = movimentacao.idTipoPagamento;
                    movimentacaoRetorno.usuario = new Usuario();
                    movimentacaoRetorno.usuario.id = movimentacao.idUsuario;
                    movimentacaoRetorno.valor = movimentacao.valor;
                    movimentacaosRetorno.push(movimentacaoRetorno);
                });

                return movimentacaosRetorno;
            });
    };

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