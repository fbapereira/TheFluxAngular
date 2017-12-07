
import { Component, EventEmitter, Input } from '@angular/core';
import { Usuario } from '../../modelos/usuario';
import { ToasterService } from 'angular2-toaster';
import { RouterModule, Router } from '@angular/router';
import { UsuarioService } from '../../servicos/usuario.service';
import { window } from 'rxjs/operators/window';
import { MaterializeAction } from 'angular2-materialize';
import { Observable } from 'rxjs/Observable';
import { TipoMovimentacaoService } from '../../servicos/tipo-movimentacao.service';
import { TipoMovimentacao } from '../../modelos/tipo-movimentacao';
import { debounce } from 'rxjs/operator/debounce';
import { Movimentacao } from '../../modelos/movimentacao';
@Component({
    selector: 'u2x-tf-movimentacao',
    templateUrl: './movimentacao.component.html'
})
export class MovimentacaoComponent {


    @Input()
    lstMovimentacao: Movimentacao[];

}