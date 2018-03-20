import { Component, OnInit } from '@angular/core';
import { UpdateInformationService } from './update-information.service';
import { User } from './../../../../../../commun/models/User';

@Component({
    moduleId: module.id,
    templateUrl: './information.component.html',
    styleUrls: ['./information.component.css'],
})

export class InformationComponent implements OnInit {
    public user = new User('', '');
    public loading = false;
    public succes: string;

    constructor(private updateInformationService: UpdateInformationService) { }

    public ngOnInit() {
        this.user.email = localStorage.getItem('user');
    }

    public update() {
        this.loading = true;
        this.updateInformationService.update(this.user)
            .subscribe(result => {
                if (result === true) {
                    this.succes = 'Your information has been updated';
                    this.user.email = localStorage.getItem('user');
                } else {
                    this.succes = 'An error occurred, please try again';
                }
                this.loading = false;
            });
    }
}
