import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Piste } from './../../../../commun/models/Piste';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class SceneImporterService {

    constructor(private http: Http) {
    }

    public getCircuitByName(name: string): Promise<Piste> {
        const url: string = 'http://localhost:3000/pisteScene/' + name;
        return this.http.get(url).toPromise().then(piste => {
            return piste.json();
        });
    }
}
