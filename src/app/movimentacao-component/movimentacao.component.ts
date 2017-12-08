
import { Component, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { window } from 'rxjs/operators/window';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable';
import { TipoMovimentacaoService } from '../../servicos/tipo-movimentacao.service';
import { TipoMovimentacao } from '../../modelos/tipo-movimentacao';
import { debounce } from 'rxjs/operator/debounce';
import { Movimentacao } from '../../modelos/movimentacao';
import { TipoPagamentoService } from '../../servicos/tipo-pagamento.service';
import { MovimentacaoService } from '../../servicos/movimentacao.service';
import { TipoPagamento } from '../../modelos/tipo-pagamento';
import * as moment from 'moment';
@Component({
    selector: 'u2x-tf-movimentacao',
    templateUrl: './movimentacao.component.html'
})
export class MovimentacaoComponent {

    @Input()
    hasSearch: Boolean;

    lstMovimentacao: Movimentacao[];
    lstMovimentacaoFiltered: Movimentacao[];

    oUsuario: Usuario;
    id: number;
    targetMovimentacao: Movimentacao;
    modalActions = new EventEmitter<MaterializeAction>();
    tipoMovimentacaos: TipoMovimentacao[] = [];
    tipoPagamentos: TipoPagamento[] = [];
    tipoGeral: String[] = ["Entrada", "Saída"];
    usuarios: Usuario[] = [];

    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private tipoPagamentoService: TipoPagamentoService,
        private movimentacaoService: MovimentacaoService,
        private router: Router) {

        this.oUsuario = this.usuarioService.usuario;
        this.id = this.usuarioService.usuario.instituicao.id;

        Observable.forkJoin(
            this.tipoMovimentacaoService.Get(this.id),
            this.tipoPagamentoService.Get(this.id),
            this.usuarioService.Get(this.id),
            this.movimentacaoService.Obtem(this.oUsuario, this.oUsuario.isAdmin))
            .subscribe((
                [tipoMovimentacaos,
                    tipoPagamento,
                    usuarios,
                    movimentacaos]) => {
                this.tipoMovimentacaos = tipoMovimentacaos;
                this.tipoPagamentos = tipoPagamento;
                this.usuarios = usuarios;
                this.lstMovimentacao = movimentacaos;
                this.changeBusca();
            });
    }


    ShowDetail(mov: Movimentacao): void {
        this.targetMovimentacao = mov;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    Cancel(mov: Movimentacao): void {

        this.movimentacaoService.Remove(mov)
            .subscribe((e: boolean) => {
                this.toasterService.pop('sucess', "Movimentação cancelada com sucesso");
                this.lstMovimentacao = this.lstMovimentacao.filter((_mov: Movimentacao) => { return _mov.id != mov.id })
                this.lstMovimentacaoFiltered = this.lstMovimentacaoFiltered.filter((_mov: Movimentacao) => { return _mov.id != mov.id })
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {

            });

    }


    GetTipoMovimentacao(id: number): string {
        let objs: any = this.tipoMovimentacaos.filter((tipoMovimentacao: TipoMovimentacao) => {
            return tipoMovimentacao.id == id;
        })
        if (objs && objs.length == 0) { return ""; }
        return objs[0].descricao;
    }

    GetUsuario(id: number): string {
        return this.usuarios.filter((usuario: Usuario) => {
            return usuario.id == id;
        })[0].login;
    }


    getStyle(nNumber: number): string {
        return nNumber > 0 ? "green" : (nNumber == 0 ? "black" : "red");
    }

    sBusca: string = "";
    sMin: string;
    sMax: string;
    dMin: any;
    dMax: any;
    sUsuario: string;
    sTipo: string = "0";
    stipoMovimentacaos: string = "0";
    sTipoPagamentos: string = "0";
    changeBusca(): void {
        if (!this.lstMovimentacao) return
        this.lstMovimentacaoFiltered = this.lstMovimentacao.filter((_mov: Movimentacao) => {
            debugger;
            //descricao 
            if (this.sBusca && this.sBusca != "" && _mov.descricao.toUpperCase().indexOf(this.sBusca.toUpperCase()) == -1) { return false }

            // valida min 
            if (this.sMin && this.sMin != "" && _mov.valor < Number(this.sMin)) { return false }

            // valida max
            if (this.sMax && this.sMax != "" && _mov.valor > Number(this.sMax)) { return false }

            //Tipo 
            if (this.sTipo == "Entrada" && !_mov.isEntrada) { return false; }
            if (this.sTipo == "Saída" && _mov.isEntrada) { return false; }

            //Tipo MOvimentacao
            if (Number(this.stipoMovimentacaos) != 0 && _mov.tipoMovimentacao.id != Number(this.stipoMovimentacaos)) { return false; }

            //Tipo pagamento
            if (Number(this.sTipoPagamentos) != 0 && _mov.tipoPagamento.id != Number(this.sTipoPagamentos)) { return false; }


            // valida min data
            if (this.dMin && this.dMin != "") {
                this.dMin = moment(this.dMin);

                let dData = moment(_mov.data);
                if (dData.isBefore(this.dMin)) { return false }
            }

            // valida max data
            if (this.dMax && this.dMax != "") {
                this.dMax = moment(this.dMax);

                let dData = moment(_mov.data);
                if (dData.isAfter(this.dMax)) { return false }
            }



            return true;
        })

        this.lstMovimentacaoFiltered.forEach((movimentacao: Movimentacao) => {
            movimentacao.tipoPagamento = this.tipoPagamentos.filter((tipoPagamento: TipoPagamento) => {
                return tipoPagamento.id == movimentacao.tipoPagamento.id;
            })[0];
        });
    }
}