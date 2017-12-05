import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { LoginService } from '../../servicos/login.service';
import { ToasterService } from 'angular2-toaster';
//import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'u2x-tf-login',
    templateUrl: './login.component.html'
})
export class LoginComponent {
    oUsuario: Usuario;
    constructor(private LoginService: LoginService,
        private toasterService: ToasterService,
        //     private router: Router
    ) {
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

        this.LoginService.Login(usuario)
            .catch((a, e) => {
                this.toasterService.pop('success', 'Não foi possivel realizar o login');
                return [];
            })
            .subscribe((usu: Usuario) => {
                if (!usu) {
                    this.toasterService.pop('success', 'O [usuario] ou [senha] inválidos');
                }
                //this.router.navigate(['/dashboard']);
            });
    }
}

