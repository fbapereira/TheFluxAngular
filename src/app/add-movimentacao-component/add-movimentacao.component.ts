
import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { debounce } from 'rxjs/operator/debounce';
import { TipoMovimentacaoService } from '../../servicos/tipo-movimentacao.service';
import { TipoMovimentacao } from '../../modelos/tipo-movimentacao';
import { TipoPagamentoService } from '../../servicos/tipo-pagamento.service';
import { TipoPagamento } from '../../modelos/tipo-pagamento';
import { Movimentacao } from '../../modelos/movimentacao';
import { MovimentacaoService } from '../../servicos/movimentacao.service';
import { MomentModule } from 'angular2-moment/moment.module';
import * as moment from 'moment';

@Component({
    selector: 'u2x-tf-usuario',
    templateUrl: './add-movimentacao.component.html'
})
export class AddMovimentacaoComponent {
    oUsuario: Usuario;
    id: number;
    movimentacao: Movimentacao;
    tipoMovimentacaos: TipoMovimentacao[] = [];
    tipoPagamentos: TipoPagamento[] = [];


    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private tipoPagamentoService: TipoPagamentoService,
        private movimentacaoService: MovimentacaoService,
        private router: Router) {

        this.oUsuario = this.usuarioService.usuario;
        this.id = this.usuarioService.usuario.instituicao.id;
        this.LimpaMovimentacao();


        this.tipoMovimentacaoService.Get(this.id)
            .subscribe((tipoMovimentacaos: TipoMovimentacao[]) => {
                this.tipoMovimentacaos = tipoMovimentacaos.filter((tipoMovimentacao: TipoMovimentacao) => { return !tipoMovimentacao.isCancelado });
            });
        this.tipoPagamentoService.Get(this.id)
            .subscribe((tipoPagamento: TipoPagamento[]) => {
                 
                this.tipoPagamentos = tipoPagamento.filter((tipoPagamento: TipoPagamento) => { return tipoPagamento.is_ativo });
            });
    }

    btnAdd(): void {
        if (!this.movimentacao.tipoMovimentacao.id || this.movimentacao.tipoMovimentacao.id == 0) {
            this.toasterService.pop('success', 'Selecione o [Tipo de Movimentação].');
            return;
        }

        if (!this.movimentacao.tipoPagamento.id || this.movimentacao.tipoPagamento.id == 0) {
            this.toasterService.pop('success', 'Selecione o [Tipo de Pagamento].');
            return;
        }

        if (this.movimentacao.valor <= 0) {
            this.toasterService.pop('success', 'Valor deve ser maior que zero.');
            return;
        }

        if (this.movimentacao.repetir <= 0) {
            this.toasterService.pop('success', 'A movimentação deve acontecer pelo menos 1 vez.');
            return;
        }

        this.movimentacaoService.Add(this.movimentacao)
            .subscribe((e: boolean) => {
                this.router.navigate(["/dashboard"])
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {

            });
    }


    LimpaMovimentacao(): void {
        this.movimentacao = new Movimentacao();
        this.movimentacao.usuario = this.oUsuario;
        this.movimentacao.tipoMovimentacao = new TipoMovimentacao();
        this.movimentacao.tipoPagamento = new TipoPagamento();
        this.movimentacao.data = moment();
        this.movimentacao.repetir = 1;
        this.movimentacao.valor = 0.00;

    }
}