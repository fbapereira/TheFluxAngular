
import { Component, EventEmitter } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { window } from 'rxjs/operators/window';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable';
import { TipoPagamento } from '../../modelos/tipo-pagamento';
import { TipoPagamentoService } from '../../servicos/tipo-pagamento.service';
import { Instituicao } from '../../modelos/instituicao';

@Component({
    selector: 'u2x-tf-tipo-movimentacao',
    templateUrl: './tipo-pagamento.component.html'
})
export class TipoPagamentoComponent {
    nome: string;
    juros: number;

    oUsuario: Usuario;

    sBusca: string;
    bAtivos: boolean;

    tipoPagamento: TipoPagamento;
    tiposPagamento: TipoPagamento[] = [];
    tiposPagamentoFiltered: TipoPagamento[] = [];

    modalActions = new EventEmitter<MaterializeAction>();


    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private tipoPagamentoService: TipoPagamentoService,
        private router: Router) {
        this.oUsuario = this.usuarioService.usuario;
        this.Populate();
        this.bAtivos = true;
        this.sBusca = "";
    }

    OpenAddStatus(tipoPagamento: TipoPagamento): void {
        this.tipoPagamento = tipoPagamento;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    Alterar(tipoPagamento: TipoPagamento, is_ativo: boolean): void {
        this.tipoPagamento = tipoPagamento;
        this.tipoPagamento.is_ativo = is_ativo;

        let sOperacao: string = is_ativo ? "reativado" : "cancelado";

        this.tipoPagamentoService.Alter(this.tipoPagamento)
            .subscribe((e: boolean) => {
                this.Populate();
                this.toasterService.pop('success', 'O tipo de pagamento foi ' + sOperacao);
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });
    }

    AddStatus(): void {
        if (!this.nome) {
            this.toasterService.pop('success', 'Digite o [nome] do novo tipo de pagamento.');
            return;
        }


        this.tipoPagamento = new TipoPagamento();
        this.tipoPagamento.id_instituicao = this.oUsuario.instituicao.id;

        this.tipoPagamento.cobranca_Juros = this.juros;
        this.tipoPagamento.nome = this.nome;

        this.tipoPagamento.is_ativo = true;

        this.tipoPagamentoService.Add(this.tipoPagamento)
            .subscribe((e: boolean) => {
                this.Populate();
                this.toasterService.pop('success', 'Tipo de Pagamento adicionado com sucesso');
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });

    }

    Populate(): void {
        this.tipoPagamentoService.Get(this.oUsuario.instituicao.id)
            .subscribe((tiposPagamento: TipoPagamento[]) => {
                this.tiposPagamento = tiposPagamento;
                this.changeBusca();
            });
    }


    changeBusca(): void {
        this.tiposPagamentoFiltered = this.tiposPagamento.filter((a: TipoPagamento) => {
             
            //valida nome
            if ((this.sBusca || this.sBusca.length == 0) &&
                (a.nome.toUpperCase().indexOf(this.sBusca.toUpperCase()) == -1)) {
                return false;
            }
            //valida cancelado
            if (this.bAtivos && !a.is_ativo) {
                return false;
            }
            return true;
        });
    }
}