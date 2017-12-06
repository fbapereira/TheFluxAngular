
import { Component } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { debounce } from 'rxjs/operator/debounce';

@Component({
    selector: 'u2x-tf-usuario',
    templateUrl: './alterar-senha.component.html'
})
export class AlterarSenhaComponent { 
    oUsuario: Usuario;
    senha: string;

    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private router: Router) {
        this.oUsuario = this.usuarioService.usuario;
    }

    btnAlter(): void {

        if (!this.senha) {
            this.toasterService.pop('success', 'Digite a [senha].');
            return;

        }

        this.oUsuario.senha = this.senha;

        this.usuarioService.Update(this.oUsuario)
            .subscribe(() => {
                this.router.navigate(["/dashboard"])
            })
    }

}