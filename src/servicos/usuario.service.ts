import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/src/client';
import { Usuario } from '../modelos/usuario';

@Injectable()
export class UsuarioService {
    constructor() { }

    private oUsuario: Usuario;
    public get usuario(): Usuario {
        if (!this.oUsuario) {
            this.oUsuario = JSON.parse(sessionStorage.getItem('usuario'));
        }
        return this.oUsuario;
    }

    public set usuario(usuario: Usuario) {
        this.oUsuario = usuario;
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }

}