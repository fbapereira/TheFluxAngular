
import { Component, EventEmitter } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { window } from 'rxjs/operators/window';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable';
@Component({
    selector: 'u2x-tf-usuario',
    templateUrl: './usuario.component.html'
})
export class UsuarioComponent {
    usuarios: Usuario[] = [];
    usuariosFiltered: Usuario[] = [];
    oUsuario: Usuario;
    senha: string;
    sBusca: string;
    modalActions = new EventEmitter<MaterializeAction>();
    constructor(
        private usuarioService: UsuarioService,
        private toasterService: ToasterService,
        private router: Router) {

        this.oUsuario = new Usuario();
        this.Populate();
    }

    Populate(): void {
         
        if (this.usuarioService.usuario.isAdmin) {
            this.usuarioService.Get(this.usuarioService.usuario.instituicao.id)
                .subscribe((usuarios: Usuario[]) => {
                    this.usuarios = usuarios;
                    this.usuariosFiltered = this.usuarios;
                });
        } else {
            this.usuarios = [];
            this.usuarios.push(this.usuarioService.usuario);
            this.usuariosFiltered = this.usuarios;
        }
    }

    ChangeAdmin(usuario: Usuario, toAdmin: boolean): void {
        this.oUsuario = usuario;
        this.oUsuario.isAdmin = toAdmin;

        let sComplemento: string = toAdmin ? "tornou se administrador" : "deixou de ser administrador";

        this.usuarioService.Update(this.oUsuario)
            .subscribe((e: boolean) => {
                this.toasterService.pop('success', 'O usuario [' + this.oUsuario.login + '] ' + sComplemento + ' com sucesso.');
                this.Populate();
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel realizar a operação.');
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });

    }


    changeBusca(): void {
        this.usuariosFiltered = this.usuarios.filter((a: Usuario) => {

            //valida nome
            if ((this.sBusca || this.sBusca.length == 0) &&
                (a.login.toUpperCase().indexOf(this.sBusca.toUpperCase()) == -1)) {
                return false;
            }

            return true;
        });
    }


    OpenChangePassword(usuario: Usuario): void {
        this.oUsuario = usuario;
        this.modalActions.emit({ action: "modal", params: ['open'] });
    }

    ChangePassword(): void {
        if (!this.senha || this.senha.length < 4) {
            this.toasterService.pop('success', 'Digite o uma nova [senha] para o usuário.');
            return;
        }
        this.oUsuario.senha = this.senha;
        this.usuarioService
            .Update(this.oUsuario)
            .subscribe((e: boolean) => {
                this.toasterService.pop('success', 'O usuario [' + this.oUsuario.login + '] trocou de senha');
            },
            (e: any) => {
                this.toasterService.pop('success', 'Não foi possivel trocar a senha do usuário');
            },
            () => {
                this.modalActions.emit({ action: "modal", params: ['close'] });
            });
    }


}