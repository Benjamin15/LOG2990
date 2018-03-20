import { Time } from './../../../../../../../commun/models/Time';
import { Component, OnInit } from '@angular/core';
import { PisteSpecificationService } from '../../../../pages/admin/piste/piste-specification.service';
import { Piste } from './../../../../../../../commun/models/Piste';

const CHECKED = 'checked';

@Component({
    selector: 'app-race-list',
    templateUrl: './race-list.component.html',
    styleUrls: ['./race-list.component.css']
})
export class RaceListComponent implements OnInit {
    public circuits: Array<Piste>;
    public selectedCircuit: Piste;
    public pistTurns: number;
    public difficulty: string;
    public check: Array<string>;
    public circuitbestTimes: Array<Array<Time>>;

    constructor(private pisteListService: PisteSpecificationService) {
        this.check = new Array<string>(5);
        this.clearCheckedList();
    }

    public async ngOnInit() {
        this.circuits = await this.pisteListService.listPiste();
        this.convertPicture();
    }

    public onSelect(piste: Piste): void {
        this.selectedCircuit = piste;
        this.getCircuitBestTimes(piste);
        this.averageAppreciation(piste);
    }

    private convertPicture(): void {
        this.circuits.forEach(piste => {
            piste.vignette = <string>JSON.parse(piste.vignette);
        });
    }

    private averageAppreciation(piste: Piste): void {
        let average = 0;
        if (piste.averageAppreciation !== null) {
            piste.averageAppreciation.forEach(appreciation => {
                average = parseInt(average.toString(), null) + parseInt(appreciation.toString(), null);
            });
            average = Math.round(average / piste.averageAppreciation.length);
        }
        this.clearCheckedList();
        this.checked(average);
    }

    public clearCheckedList(): void {
        for (let i = 0; i < this.check.length; i++) {
            this.check[i] = '';
        }
    }

    public checked(max: number): void {
        for (let i = 0; i < max; i++) {
            this.check[i] = CHECKED;
        }
    }

    public getCircuitBestTimes(piste: Piste): void {
        if (piste.bestTimes === null) {
            this.circuitbestTimes = new Array<Array<Time>>();
        } else {
            this.circuitbestTimes = <Array<Array<Time>>>JSON.parse(piste.bestTimes);
        }
    }
}
