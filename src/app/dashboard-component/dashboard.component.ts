import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { UsuarioService } from '../../servicos/usuario.service';
import { MovimentacaoService } from '../../servicos/movimentacao.service';
import { Movimentacao } from '../../modelos/movimentacao';
import { TipoPagamentoService } from '../../servicos/tipo-pagamento.service';
import { TipoPagamento } from '../../modelos/tipo-pagamento';
import { debuglog } from 'util';

@Component({
    selector: 'u2x-tf-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    oUsuario: Usuario;

    movimentacaos: Movimentacao[];
    tipoPagamentos: TipoPagamento[];

    entradaLiquida: number;
    entradaBruta: number;
    saidaLiquida: number;
    saidaBruta: number;

    constructor(private toasterService: ToasterService,
        private movimentacaoService: MovimentacaoService,
        private tipoPagamentoService: TipoPagamentoService,
        private usuarioService: UsuarioService) {
        this.oUsuario = this.usuarioService.usuario;

        this.movimentacaoService.hasChange
            .subscribe(() => {
                this.popular();
            })
        this.tipoPagamentoService.Get(this.oUsuario.instituicao.id)
            .subscribe((tipoPagamento: TipoPagamento[]) => {
                this.tipoPagamentos = tipoPagamento;
                this.popular();
            });
    }

    getStyle(nNumber: number): string {
        return nNumber > 0 ? "green" : (nNumber == 0 ? "black" : "red");
    }

    popular(): void {
        this.movimentacaoService.Obtem(this.oUsuario, this.oUsuario.isAdmin)
            .subscribe((movimentacaos: Movimentacao[]) => {
                this.movimentacaos = movimentacaos;
                //adicionar forma de pagamento
                movimentacaos.forEach((movimentacao: Movimentacao) => {
                    movimentacao.tipoPagamento = this.tipoPagamentos.filter((tipoPagamento: TipoPagamento) => {
                        return tipoPagamento.id == movimentacao.tipoPagamento.id;
                    })[0];
                })

                // calculo
                this.entradaLiquida = 0;
                this.entradaBruta = 0;
                this.saidaLiquida = 0;
                this.saidaBruta = 0;

                movimentacaos.forEach((movimentacao: Movimentacao) => {
                    if (movimentacao.isEntrada) {
                        this.entradaLiquida = this.entradaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_Juros + 100) / 100))
                        this.entradaBruta = this.entradaBruta + movimentacao.valor;
                    } else {
                        this.saidaLiquida = this.saidaLiquida + (movimentacao.valor * ((movimentacao.tipoPagamento.cobranca_Juros + 100) / 100))
                        this.saidaBruta = this.saidaBruta + movimentacao.valor;
                    }
                });
            });
    }
}

