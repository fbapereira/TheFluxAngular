import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
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
import { MenuComponent } from './menu-component/menu.component';
import { UsuarioComponent } from './usuario-component/usuario.component';
import { AddUsuarioComponent } from './add-usuario-component/add-usuario.component';
import { MaterializeModule } from "angular2-materialize";
import { TipoMovimentacaoComponent } from './tipo-movimentacao-component/tipo-movimentacao.component';
import { TipoMovimentacaoService } from '../servicos/tipo-movimentacao.service';
import { AddMovimentacaoComponent } from './add-movimentacao-component/add-movimentacao.component';
import { AlterarSenhaComponent } from './alterar-senha-component/alterar-senha.component';
import { TipoPagamentoComponent } from './tipo-pagamento-component/tipo-pagamento.component';
import { TipoPagamentoService } from '../servicos/tipo-pagamento.service';
import { MovimentacaoService } from '../servicos/movimentacao.service';
import {MomentModule} from 'angular2-moment/moment.module';
@NgModule({
  declarations: [
    LoginComponent,
    DashboardComponent,
    AppComponent,
    MenuComponent,
    AddUsuarioComponent,
    UsuarioComponent,
    TipoMovimentacaoComponent,
    AddMovimentacaoComponent,
    AlterarSenhaComponent,
    TipoPagamentoComponent
  ],
  imports: [
    BrowserModule,
    MomentModule,
    MaterializeModule,
    HttpClientModule,
    FormsModule,
    ToasterModule, BrowserAnimationsModule,
    RouterModule.forRoot(
      [
        { path: 'login', component: LoginComponent },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'usuario', component: UsuarioComponent },
        { path: 'tipo-movimentacao', component: TipoMovimentacaoComponent },
        { path: 'tipo-pagamento', component: TipoPagamentoComponent },
        { path: 'add-movimentacao', component: AddMovimentacaoComponent },
        { path: 'add-usuario', component: AddUsuarioComponent },
        { path: 'alter-senha', component: AlterarSenhaComponent },
        { path: '', redirectTo: '/login', pathMatch: 'full' },
        // { path: '**', component: PageNotFoundComponent }
      ],
      { enableTracing: true } // <-- debugging purposes only
    )
  ],
  providers: [HttpClient, TFHTTPService, UsuarioService, TipoMovimentacaoService, TipoPagamentoService, MovimentacaoService],
  bootstrap: [AppComponent]
})

export class AppModule { }
