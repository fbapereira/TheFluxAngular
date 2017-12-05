import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LoginService } from '../servicos/login.service';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { TFHTTPService } from '../servicos/tf-http.service';
import { LoginComponent } from './login-component/login.component';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { RouterModule, Routes } from '@angular/router';
import { ToasterModule, ToasterService } from 'angular2-toaster';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from './dashboard-component/dashboard.component';
import { UsuarioService } from '../servicos/usuario.service';

@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ToasterModule, BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        // { path: '**', component: PageNotFoundComponent }
      ],
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [LoginService, HttpClient, TFHTTPService, UsuarioService],
  bootstrap: [AppComponent]
})

export class AppModule { }
