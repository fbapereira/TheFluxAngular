import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { HttpClient } from '@angular/common/http/src/client';

@Injectable()
export class MovimentacaoPassoal{
    constructor(private http: HttpClient)
    {}

    
}