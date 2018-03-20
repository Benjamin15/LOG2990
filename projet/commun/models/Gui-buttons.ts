import { RenderService } from './../../client/src/app/race-editor/render.service';
import { Piste } from './Piste';


export class GuiButtons {
    public oldPiste: Piste;
    public name: string;
    public type: string;
    public description: string;
    public speedBonusCount: Array<number>;
    public obstacleAddNumber: Array<number>;


    constructor(private renderService: RenderService) {
        this.obstacleAddNumber = new Array<number>();
        this.speedBonusCount = new Array<number>();
        this.speedBonusCount[0] = 0;
        this.speedBonusCount[1] = 0;
        this.speedBonusCount[2] = 0;
    }

    public save(): void {
        this.renderService.saveCircuit();
    }

    public addSpeedBonuses(): void {
        this.obstacleAddNumber[2] = this.speedBonusCount[2];
        if (this.obstacleAddNumber[2] === 0) {
            this.obstacleAddNumber[2] = 1;
        } else if (this.obstacleAddNumber[2] === 1) {
            this.obstacleAddNumber[2] = 3;
        } else if (this.obstacleAddNumber[2] === 3) {
            this.obstacleAddNumber[2] = 5;
        } else if (this.obstacleAddNumber[2] === 5) {
            this.obstacleAddNumber[2] = 0;
        }
        this.renderService.generateRandomSpeedBonuses(this.obstacleAddNumber[2]);
        this.speedBonusCount[2] = this.obstacleAddNumber[2];
    }

    public addPuddles(): void {
        this.obstacleAddNumber[0] = this.speedBonusCount[0];
        if (this.obstacleAddNumber[0] === 0) {
            this.obstacleAddNumber[0] = 1;
        } else if (this.obstacleAddNumber[0] === 1) {
            this.obstacleAddNumber[0] = 3;
        } else if (this.obstacleAddNumber[0] === 3) {
            this.obstacleAddNumber[0] = 5;
        } else if (this.obstacleAddNumber[0] === 5) {
            this.obstacleAddNumber[0] = 0;
        }
        this.renderService.generatePuddle(this.obstacleAddNumber[0]);
        this.speedBonusCount[0] = this.obstacleAddNumber[0];
    }

    public addPotholes(): void {
        this.obstacleAddNumber[1] = this.speedBonusCount[1];
        if (this.obstacleAddNumber[1] === 0) {
            this.obstacleAddNumber[1] = 1;
        } else if (this.obstacleAddNumber[1] === 1) {
            this.obstacleAddNumber[1] = 3;
        } else if (this.obstacleAddNumber[1] === 3) {
            this.obstacleAddNumber[1] = 5;
        } else if (this.obstacleAddNumber[1] === 5) {
            this.obstacleAddNumber[1] = 0;
        }
        this.renderService.generateRandomPotholes(this.obstacleAddNumber[1]);
        this.speedBonusCount[1] = this.obstacleAddNumber[1];
    }

    public moveSpeedBonuses(): void {
        this.renderService.generateRandomSpeedBonuses(this.obstacleAddNumber[0]);
    }

    public movePotholes(): void {
        this.renderService.generateRandomSpeedBonuses(this.obstacleAddNumber[0]);
    }

    public movePuddles(): void {
        this.renderService.generateRandomSpeedBonuses(this.obstacleAddNumber[0]);
    }
}