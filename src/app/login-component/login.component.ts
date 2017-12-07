import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
    selector: 'u2x-tf-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    oUsuario: Usuario;
    constructor(
        private toasterService: ToasterService,
        private usuarioService: UsuarioService,
        private router: Router
    ) {
        this.oUsuario = new Usuario();
        if (this.usuarioService.usuario) {
            this.executaLogin(this.usuarioService.usuario);
        }

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
        this.executaLogin(usuario);

    }

    executaLogin(usuario: Usuario): void {
        debugger;
        this.usuarioService.Login(usuario)
            .catch((a, e) => {
                this.toasterService.pop('success', 'Não foi possivel realizar o login');
                return [];
            })
            .subscribe((usu: Usuario) => {
                if (!usu) {
                    this.toasterService.pop('success', 'O [usuario] ou [senha] inválidos');
                }
                this.usuarioService.usuario = usu;
                this.router.navigate(['/dashboard']);
            });
    }
}

