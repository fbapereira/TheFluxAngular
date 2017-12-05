import { Injectable } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class TFHTTPService {
    private URL_CONF = "http://localhost:64010"

    constructor(private http: HttpClient) { }

    post(url: string, body: any): Observable<Object> {
        return this.http.post(this.URL_CONF + url, body);
    }

}