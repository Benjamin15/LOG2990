import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from './authentication.service';
import { routerTransition } from './../../../animations';
import { User } from './../../../../../../commun/models/User';

const EMPTY = '';

@Component({
    moduleId: module.id,
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss'],
    animations: [routerTransition()],
})

export class AdminAuthenticationComponent implements OnInit {
    public user = new User(EMPTY, EMPTY);
    public loading = false;
    public error = EMPTY;

    constructor(private router: Router,
        private authenticationService: AuthenticationService) { }

    public ngOnInit(): void {
        this.authenticationService.logout();
    }

    public login(): void {
        this.loading = true;
        this.authenticationService.login(this.user)
            .subscribe(result => {
                if (result === true) {
                    this.router.navigate(['/adminNavigation']);
                } else {
                    this.error = 'email or password is incorrect';
                    this.loading = false;
                    this.user.password = EMPTY;
                }
            });
    }
}
