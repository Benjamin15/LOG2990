import { Component, OnInit } from '@angular/core';
import { PisteSpecificationService } from './../piste-specification.service';
import { Piste } from './../../../../../../../commun/models/Piste';

@Component({
    selector: 'app-listpiste',
    templateUrl: './list.component.html',
    styleUrls: ['./list.component.css']
})

export class PisteListComponent implements OnInit {
    public circuits: Promise<Piste[]>;
    public selectedCircuit: Piste;
    public pistTurns: number;
    constructor(private pisteService: PisteSpecificationService) { }

    public onSelect(piste: Piste): void {
        this.selectedCircuit = piste;
    }

    public update(selectedCircuit: Piste): void {
        const oldPisteName = this.selectedCircuit.name;
        this.pisteService.update(selectedCircuit, oldPisteName);
    }

    public ngOnInit(): void {
        this.circuits = this.pisteService.listPiste();
    }

    public deletePiste(circuitSelectionne): void {
        const pisteToDelete = new Piste(circuitSelectionne.name, circuitSelectionne.type, circuitSelectionne.description);
        this.pisteService.delete(pisteToDelete);
    }

    public initSaveAs(circuitName: string, circuitSelectionne): void {
        const pisteToSave = new Piste(circuitName, circuitSelectionne.type,
            circuitSelectionne.description, null, circuitSelectionne.circuit);
        this.pisteService.insert(pisteToSave);
    }
}
