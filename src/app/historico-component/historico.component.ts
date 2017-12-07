
import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { UsuarioService } from '../../servicos/usuario.service';
import { MovimentacaoService } from '../../servicos/movimentacao.service';
import { Movimentacao } from '../../modelos/movimentacao';

@Component({
    selector: 'u2x-tf-dashboard',
    templateUrl: './historico.component.html'
})
export class HistoricoComponent {
    oUsuario: Usuario;

    movimentacaos: Movimentacao[]

    constructor(private toasterService: ToasterService,
        private movimentacaoService: MovimentacaoService,
        private usuarioService: UsuarioService) {
        this.oUsuario = this.usuarioService.usuario;

        this.movimentacaoService.Obtem(this.oUsuario)
            .subscribe((movimentacaos: Movimentacao[]) => {
                this.movimentacaos = movimentacaos;
            });
    }
}

