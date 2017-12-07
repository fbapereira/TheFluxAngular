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
    entrada: number;
    jurosEntrada: number;
    saida: number;
    jurosSaida: number;
    total: number;

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

    popular(): void {
        this.movimentacaoService.Obtem(this.oUsuario)
            .subscribe((movimentacaos: Movimentacao[]) => {
                this.movimentacaos = movimentacaos;
                //adicionar forma de pagamento
                movimentacaos.forEach((movimentacao: Movimentacao) => {
                    movimentacao.tipoPagamento = this.tipoPagamentos.filter((tipoPagamento: TipoPagamento) => {
                        return tipoPagamento.id == movimentacao.tipoPagamento.id;
                    })[0];
                })

                // calculo
                this.jurosEntrada = 0;
                this.entrada = 0;
                this.jurosSaida = 0;
                this.saida = 0;
                movimentacaos.forEach((movimentacao: Movimentacao) => {
                    if (movimentacao.isEntrada) {
                        this.jurosEntrada = this.jurosEntrada + (movimentacao.valor * (movimentacao.tipoPagamento.cobranca_Juros / 100))
                        this.entrada = this.entrada + movimentacao.valor;
                    } else {
                        this.jurosSaida = this.jurosSaida + (movimentacao.valor * (movimentacao.tipoPagamento.cobranca_Juros / 100))
                        this.saida = this.saida + movimentacao.valor;
                    }
                });
                this.total = this.entrada - this.saida - this.jurosEntrada - this.jurosSaida;

            });
    }
}

