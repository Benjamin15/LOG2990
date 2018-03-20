import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { User } from './../../../../../../commun/models/User';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/toPromise';

@Injectable()
export class AuthenticationService {

    constructor(private http: Http) { }

    public login(user: User): Observable<boolean> {
        const url = 'http://localhost:3000/authentication';
        return this.http.post(url, { user: user })
            .map((response: Response) => {
                if (response.json()) {
                    localStorage.setItem('user', user.email);
                    return true;
                } else {
                    return false;
                }
            });
    }

    public logout(): void {
        localStorage.removeItem('user');
    }
}
