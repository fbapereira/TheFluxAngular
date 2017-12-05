import { Injectable } from '@angular/core';

import { Response, Http } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { Usuario } from '../modelos/usuario';

import { Observable, BehaviorSubject } from 'rxjs/Rx';
import { HttpClient } from '@angular/common/http';
import { debounce } from 'rxjs/operator/debounce';
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import { TFHTTPService } from './tf-http.service';
import { Instituicao } from '../modelos/instituicao';

@Injectable()
export class LoginService {

    constructor(private http: TFHTTPService) {

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
}
