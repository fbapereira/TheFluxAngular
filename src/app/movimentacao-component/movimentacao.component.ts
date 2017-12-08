
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
@Component({
    selector: 'u2x-tf-movimentacao',
    templateUrl: './movimentacao.component.html'
})
export class MovimentacaoComponent {

    @Input()
    hasSearch: Boolean;

    @Input()
    lstMovimentacao: Movimentacao[];
    lstMovimentacaoFiltered: Movimentacao[];

    oUsuario: Usuario;
    id: number;
    targetMovimentacao: Movimentacao;
    modalActions = new EventEmitter<MaterializeAction>();
    tipoMovimentacaos: TipoMovimentacao[] = [];
    tipoPagamentos: TipoPagamento[] = [];
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


        this.tipoMovimentacaoService.Get(this.id)
            .subscribe((tipoMovimentacaos: TipoMovimentacao[]) => {
                this.tipoMovimentacaos = tipoMovimentacaos;
            });
        this.tipoPagamentoService.Get(this.id)
            .subscribe((tipoPagamento: TipoPagamento[]) => {
                this.tipoPagamentos = tipoPagamento;
            });
        this.usuarioService.Get(this.id)
            .subscribe((usuarios: Usuario[]) => {

                this.usuarios = usuarios;
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
    ngOnChanges(changes: SimpleChanges) {
        this.changeBusca();
    }

    GetTipoMovimentacao(id: number): string {
        return this.tipoMovimentacaos.filter((tipoMovimentacao: TipoMovimentacao) => {
            return tipoMovimentacao.id = id;
        })[0].descricao;
    }

    GetUsuario(id: number): string {
        return this.usuarios.filter((usuario: Usuario) => {
            return usuario.id = id;
        })[0].login;
    }


    getStyle(nNumber: number): string {
        return nNumber > 0 ? "green" : (nNumber == 0 ? "black" : "red");
    }

    sBusca: string = "";
    sMin: string;
    sMax: string;
    sUsuario: string;
    changeBusca(): void {
        if (!this.lstMovimentacao) return
        this.lstMovimentacaoFiltered = this.lstMovimentacao.filter((_mov: Movimentacao) => {

            //descricao 
            if (this.sBusca && this.sBusca != "" && _mov.descricao.toUpperCase().indexOf(this.sBusca.toUpperCase()) == -1) { return false }

            // valida min 
            if (this.sMin && this.sMin != "" && _mov.valor < Number(this.sMin)) { return false }

            // valida max
            if (this.sMax && this.sMax != "" && _mov.valor > Number(this.sMax)) { return false }

            return true;
        })

    }
}