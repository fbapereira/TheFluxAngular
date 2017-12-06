import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/src/client';
import { Usuario } from '../modelos/usuario';
import { Observable } from 'rxjs/Rx';
import { TFHTTPService } from './tf-http.service';
import { Instituicao } from '../modelos/instituicao';
import 'rxjs'

@Injectable()
export class UsuarioService {
    constructor(private http: TFHTTPService) { }

    private oUsuario: Usuario;
    public get usuario(): Usuario {
        if (this.oUsuario) {
            return this.oUsuario;
        }
        let sUsuario = sessionStorage.getItem('usuario');
        if (sUsuario && sUsuario != "undefined") {
            return JSON.parse(sUsuario);
        }
        return undefined;
    }

    public set usuario(usuario: Usuario) {
        this.oUsuario = usuario;
        sessionStorage.setItem('usuario', JSON.stringify(usuario));
    }

    Login(oUsuario: Usuario): Observable<any> {
        return this.http.post("/api/Login", oUsuario)
            .map((oBody: any) => {

                let oUsuario: Usuario = new Usuario;
                oUsuario.id = oBody.id;
                oUsuario.login = oBody.login;
                oUsuario.senha = oBody.senha;
                oUsuario.isAdmin = oBody.isAdmin;
                oUsuario.instituicao = new Instituicao();
                oUsuario.instituicao.id = oBody.id_instituicao;
                return oUsuario
            })
    }

    Get(idInstituicao): Observable<Usuario[]> {
        return this.http.get("/api/usuario/" + idInstituicao)
            .map((oBody: any) => {
                let lstUsuario: Usuario[] = [];
                oBody.forEach(element => {
                    let oUsuario: Usuario = new Usuario;
                    oUsuario.id = element.id;
                    oUsuario.login = element.login;
                    oUsuario.senha = element.senha;
                    oUsuario.isAdmin = element.isAdmin;
                    oUsuario.instituicao = new Instituicao();
                    oUsuario.instituicao.id = element.id_instituicao;
                    lstUsuario.push(oUsuario);
                });

                return lstUsuario;
            })
    }

    Add(oUsuario: Usuario): Observable<boolean> {
        let oUsuarioDif: any = oUsuario;
        oUsuarioDif.id_instituicao = oUsuario.instituicao.id;
        return this.http.post("/api/usuario", oUsuario)
            .map((oBody: any) => { return oBody })
    }

    Update(oUsuario: Usuario): Observable<boolean> {
        let oUsuarioDif: any = oUsuario;
        oUsuarioDif.id_instituicao = oUsuario.instituicao.id;
        return this.http.post("/api/UsuarioAtualiza", oUsuario)
            .map((oBody: any) => { return oBody })
    }
}