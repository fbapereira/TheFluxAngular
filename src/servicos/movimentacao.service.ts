import { Injectable, EventEmitter } from '@angular/core';

import { Movimentacao } from '../modelos/movimentacao';
import { Observable } from 'rxjs';
import { TFHTTPService } from './tf-http.service';
import * as moment from 'moment';
import { observeOn } from 'rxjs/operators/observeOn';
import { Usuario } from '../modelos/usuario';
import { TipoMovimentacao } from '../modelos/tipo-movimentacao';
import { TipoPagamento } from '../modelos/tipo-pagamento';
import { Instituicao } from '../modelos/instituicao';

@Injectable()
export class MovimentacaoService {
    constructor(private http: TFHTTPService) { }
    hasChange: EventEmitter<boolean> = new EventEmitter();


    Obtem(oUsuario: Usuario, is_Admin: boolean): Observable<Movimentacao[]> {

        let obs: Observable<any>;
        if (is_Admin) {
            let obj: any = oUsuario;
            obj.id_instituicao = oUsuario.instituicao.id;
            obs = this.http.post("/api/MovimentacaoInstitucional_Obtem", obj)
        }
        else {
            obs = this.http.post("/api/MovimentacaoPessoal_Obtem", oUsuario)
        }

        return obs.map((movimentacaos: any) => {
            let movimentacaosRetorno: Movimentacao[] = [];

            if (!movimentacaos) { return []; }
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

                //fix calc 
                if (!movimentacaoRetorno.isEntrada) {
                    movimentacaoRetorno.valor = movimentacaoRetorno.valor * -1;
                }

                movimentacaosRetorno.push(movimentacaoRetorno);
            });

            movimentacaosRetorno = movimentacaosRetorno.sort((a: Movimentacao, b: Movimentacao) => {
                let dtA: any = moment(a.data);
                let dtB: any = moment(b.data);
                if (dtA.isAfter(dtB))
                    return 1;
                if (dtA.isBefore(dtB))
                    return -1;
                return 0;
            })
            return movimentacaosRetorno;
        });
    };

    Add(oTipoMovimentacao: Movimentacao): Observable<boolean> {
        let obj: any = oTipoMovimentacao;

        obj.idTipoMovimentacao = oTipoMovimentacao.tipoMovimentacao.id;
        obj.idTipoPagamento = oTipoMovimentacao.tipoPagamento.id;
        obj.idUsuario = oTipoMovimentacao.usuario.id;

        let movimentacaos: Movimentacao[] = [];

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

        let _that: any = this;
        return Observable.create(function (observer) {
            Observable.forkJoin(serviceArray)
                .flatMap((a: any) => {
                    _that.hasChange.emit(true);
                    return a;
                })
                .subscribe(() => {
                    observer.next(true);
                    observer.complete();
                });
        })
    }

    Remove(oMovimentacao: Movimentacao): Observable<any> {
        let that: any = this;
        return Observable.create(function (observer) {

            that.http.post("/api/Movimentacao_Deletar", oMovimentacao)
                .subscribe(() => {
                    that.hasChange.emit(true);
                    observer.next(true);
                    observer.complete();
                });
        });
    }
}