
import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { window } from 'rxjs/operators/window';
@Component({
    selector: 'u2x-tf-usuario',
    templateUrl: './usuario.component.html'
})
export class UsuarioComponent {
    usuarios: Usuario[] = [];

    constructor(
        private usuarioService: UsuarioService,
        private router: Router) {
        this.usuarioService.Get(1)
            .subscribe((usuarios: Usuario[]) => {
                this.usuarios = usuarios;

            })
    }

}