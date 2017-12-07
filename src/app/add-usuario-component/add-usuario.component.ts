
import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { debounce } from 'rxjs/operator/debounce';

@Component({
    selector: 'u2x-tf-usuario',
    templateUrl: './add-usuario.component.html'
})
export class AddUsuarioComponent {
    oUsuario: Usuario;
    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private router: Router) {
        this.oUsuario = new Usuario();
    }

    btnAdd(usuario: Usuario): void {
         
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