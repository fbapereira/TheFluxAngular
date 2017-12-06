
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

@Component({
    selector: 'u2x-tf-usuario',
    templateUrl: './add-movimentacao.component.html'
})
export class AddMovimentacaoComponent {
    oUsuario: Usuario;
    id: number;

    tipoMovimentacaos: TipoMovimentacao[] = [];
    tipoPagamentos: TipoPagamento[] = [];


    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private tipoMovimentacaoService: TipoMovimentacaoService,
        private tipoPagamentoService: TipoPagamentoService,
        private router: Router) {
        this.oUsuario = new Usuario();
        this.id = this.usuarioService.usuario.instituicao.id;

        this.tipoMovimentacaoService.Get(this.id)
            .subscribe((tipoMovimentacaos: TipoMovimentacao[]) => {
                this.tipoMovimentacaos = tipoMovimentacaos.filter((tipoMovimentacao: TipoMovimentacao) => { return !tipoMovimentacao.isCancelado });
            });
        this.tipoPagamentoService.Get(this.id)
            .subscribe((tipoPagamento: TipoPagamento[]) => {
                debugger;
                this.tipoPagamentos = tipoPagamento.filter((tipoPagamento: TipoPagamento) => { return tipoPagamento.is_ativo });
            });
    }

    btnAdd(usuario: Usuario): void {
        debugger;
        if (!usuario.login) {
            this.toasterService.pop('success', 'Digite o [login].');
            return;
        }

        if (!usuario.senha) {
            this.toasterService.pop('success', 'Digite a [senha].');
            return;

        }

        usuario.instituicao = this.usuarioService.usuario.instituicao;

        this.usuarioService.Add(usuario)
            .subscribe(() => {
                this.router.navigate(["/usuario"])
            })
    }

}