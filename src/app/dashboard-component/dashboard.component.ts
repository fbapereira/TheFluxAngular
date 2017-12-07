import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { UsuarioService } from '../../servicos/usuario.service';
import { MovimentacaoService } from '../../servicos/movimentacao.service';
import { Movimentacao } from '../../modelos/movimentacao';

@Component({
    selector: 'u2x-tf-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    oUsuario: Usuario;

    movimentacaos: Movimentacao[]
    entrada: number;
    saida: number;
    total: number;

    constructor(private toasterService: ToasterService,
        private movimentacaoService: MovimentacaoService,
        private usuarioService: UsuarioService) {
        this.oUsuario = this.usuarioService.usuario;

        this.movimentacaoService.Obtem(this.oUsuario)
            .subscribe((movimentacaos: Movimentacao[]) => {
                this.movimentacaos = movimentacaos;
                // calculo
                this.entrada = 0;
                this.saida = 0;
                movimentacaos.forEach((movimentacao: Movimentacao) => {
                    if (movimentacao.isEntrada) {
                        this.entrada = this.entrada + movimentacao.valor;
                    } else {
                        this.saida = this.saida + movimentacao.valor;
                    }
                });
                this.total = this.entrada - this.saida;
                debugger;
            });
    }


}

