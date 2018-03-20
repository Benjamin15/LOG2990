import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Piste } from './../../../../../../commun/models/Piste';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class PisteSpecificationService {

    constructor(private http: Http) { }

    public insert(newPiste: Piste): Promise<boolean> {
        const url = 'http://localhost:3000/piste/create';
        return this.http.post(url, newPiste).toPromise().then(response => {
            return (response.json()) ? true : false;
        });
    }

    public overwriteCircuit(name: string): Promise<boolean> {
        let string = name.replace(/\n/g, '');
        string = name.replace(/\\s/g, '');
        const url: string = 'http://localhost:3000/pisteScene/get/' + string;
        return this.http.get(url).toPromise().then(piste => {
            return piste.json();
        });
    }

    public updateInfos(oldPiste: Piste, newPiste: Piste): Observable<boolean> {
        return this.http.post('http://localhost:3000/pisteScene/update',
            { oldPisteName: oldPiste.name, piste: newPiste })
            .map((response: Response) => {
                if (response.json()) {
                    alert('mis a jour');
                    return true;
                } else {
                    alert('echec');
                    return false;
                }
            });
    }

    public listPiste(): Promise<Piste[]> {
        const url = 'http://localhost:3000/piste/get';
        return this.http.get(url).toPromise().then(pistes => {
            return pistes.json();
        });
    }

    public update(piste: Piste, oldPisteName: string): Observable<boolean> {
        const url = 'http://localhost:3000/pisteScene/update';
        return this.http.post(url, { oldPiste: oldPisteName, piste: piste })
            .map((value: Response) => {
                if (value.json()) {
                    return true;
                } else {
                    return false;
                }
            });
    }

    public delete(pisteToDelete: Piste): Promise<boolean> {
        const url = 'http://localhost:3000/piste/delete';
        return this.http.post(url, pisteToDelete).toPromise().then(response => {
            return (response.json()) ? true : false;
        });
    }
}
