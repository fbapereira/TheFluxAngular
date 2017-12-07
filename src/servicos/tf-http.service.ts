import { Injectable, EventEmitter } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

import { observeOn } from 'rxjs/operator/observeOn';

@Injectable()
export class TFHTTPService {
    private URL_CONF = "http://localhost:64010"

    isWorking: EventEmitter<boolean> = new EventEmitter();

    constructor(private http: HttpClient) { }

    post(url: string, body: any): Observable<Object> {
        this.isWorking.emit(true);
        return this.http.post(this.URL_CONF + url, body)
            .map((obj: any) => {
                this.isWorking.emit(false);
                return obj;
            });
    }


    get(url: string): Observable<Object> {
        this.isWorking.emit(true);
        return this.http.get(this.URL_CONF + url)
        .map((obj: any) => {
            this.isWorking.emit(false);
            return obj;
        });
    }
}