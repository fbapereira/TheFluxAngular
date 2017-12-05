import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { LoginService } from '../../servicos/login.service';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';

@Component({
    selector: 'u2x-tf-Menu',
    templateUrl: './menu.component.html'
})
export class MenuComponent {

    constructor(
        private usuarioService: UsuarioService,
        private router: Router) {

    }

}