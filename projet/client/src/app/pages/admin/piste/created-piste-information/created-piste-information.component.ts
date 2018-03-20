import { Component } from '@angular/core';
import { PisteSpecificationService } from './../piste-specification.service';
import { Piste } from '../../../../../../../commun/models/Piste';

@Component({
    selector: 'app-createdpisteinformation',
    templateUrl: './created-piste-information.component.html',
    styleUrls: ['./created-piste-information.component.css']
})

export class CreatedPisteInformationComponent {

    public name: string;
    public type: string;
    public description: string;

    constructor(private pisteSpecificationService: PisteSpecificationService) { }

    public init(name: string, type: string, description: string): void {
        this.pisteSpecificationService.insert(new Piste(name, type, description));
    }
}
