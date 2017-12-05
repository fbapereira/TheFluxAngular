import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
    selector: 'u2x-tf-dashboard',
    templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
    oUsuario: Usuario;
    constructor(private toasterService: ToasterService,
        private usuarioService: UsuarioService) {
        this.oUsuario = new Usuario();
    }

    btnLoginClick(usuario: Usuario) {
        if (!usuario.login) {
            this.toasterService.pop('success', 'Digite o [login].');
            return [];
        }

        if (!usuario.senha) {
            this.toasterService.pop('success', 'Digite a [senha].');
            return [];

        }

        this.usuarioService.Login(usuario)
            .catch((a, e) => {
                this.toasterService.pop('success', 'Não foi possivel realizar o login');
                return [];
            })
            .subscribe((usu: Usuario) => {
                if (!usu) {
                    this.toasterService.pop('success', 'O [usuario] ou [senha] inválidos');
                }
            });
    }
}

