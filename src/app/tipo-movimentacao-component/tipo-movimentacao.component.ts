
import { Component, EventEmitter } from '@angular/core';
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
@Component({
    selector: 'u2x-tf-tipo-movimentacao',
    templateUrl: './tipo-movimentacao.component.html'
})
export class TipoMovimentacaoComponent {
    novoTipo: string;
    sBusca: string;
    bAtivos: boolean;
    oUsuario: Usuario;
    tipoMovimentacao: TipoMovimentacao;
    tiposMovimentacao: TipoMovimentacao[] = [];
    tiposMovimentacaoFiltered: TipoMovimentacao[] = [];

    modalActions = new EventEmitter<MaterializeAction>();

    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private router: Router) {
        this.oUsuario = this.usuarioService.usuario;
        this.Populate();
        this.bAtivos = true;
        this.sBusca = "";
    }

    OpenAddStatus(tipoMovimentacao: TipoMovimentacao): void {
        this.tipoMovimentacao = tipoMovimentacao;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    ChangeAdmin(tipoMovimentacao: TipoMovimentacao, toCancelado: boolean): void {
        this.tipoMovimentacao = tipoMovimentacao;
        this.tipoMovimentacao.isCancelado = toCancelado;

        let sOperacao: string = toCancelado ? "reativado" : "cancelado";

        this.tipoMovimentacaoService.AlterStatus(this.tipoMovimentacao.id, toCancelado)
            .subscribe((e: boolean) => {
                this.Populate();
                this.toasterService.pop('success', 'O tipo de movimentação foi ' + sOperacao);
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });
    }

    AddStatus(novoTipo: string): void {
        if (!novoTipo) {
            this.toasterService.pop('success', 'Digite o [nome] do novo tipo de movimentação.');
            return;
        }

        this.tipoMovimentacao = new TipoMovimentacao();
        this.tipoMovimentacao.descricao = novoTipo;
        this.tipoMovimentacao.id_instituicao = this.oUsuario.instituicao.id;
        this.tipoMovimentacao.isCancelado = false;

        this.tipoMovimentacaoService.Add(this.tipoMovimentacao)
            .subscribe((e: boolean) => {
                this.Populate();
                this.toasterService.pop('success', 'Tipo de Movimentação adicionado com sucesso');
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });

    }

    changeBusca(): void {
        this.tiposMovimentacaoFiltered = this.tiposMovimentacao.filter((a: TipoMovimentacao) => {
             
            //valida nome
            if ((this.sBusca || this.sBusca.length == 0) &&
                (a.descricao.toUpperCase().indexOf(this.sBusca.toUpperCase()) == -1)) {
                return false;
            }
            //valida cancelado
            if (this.bAtivos && a.isCancelado) {
                return false;
            }
            return true;
        });
    }

    Populate(): void {
        this.tipoMovimentacaoService.Get(this.oUsuario.instituicao.id)
            .subscribe((tiposMovimentacao: TipoMovimentacao[]) => {
                this.tiposMovimentacao = tiposMovimentacao;
                this.tiposMovimentacaoFiltered = tiposMovimentacao.sort((a: TipoMovimentacao, b: TipoMovimentacao) => {
                    if (a.descricao < b.descricao) return -1;
                    if (a.descricao > b.descricao) return 1;
                    return 0;
                });
                this.changeBusca();
            });
    }
}