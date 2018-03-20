import { GuiButtons } from './../../../../commun/models/Gui-buttons';
import * as dat from 'dat-gui';

export class GuiInterface extends dat.GUI {

    constructor(public guiButtons?: GuiButtons) {
        super();
    }

    public initGUI(name: string, type: string, description: string): void {
        this.guiButtons.name = name;
        this.guiButtons.type = type;
        this.guiButtons.description = description;
    }

    public openGUI(): void {
        this.open();
    }

    public addGuiButtons(): void {
        this.add(this.guiButtons, 'name').name('Name').listen();
        this.add(this.guiButtons, 'type').name('Type').listen();
        this.add(this.guiButtons, 'description').name('Description').listen();
        this.add(this.guiButtons, 'save').name('Save').listen();
        this.add(this.guiButtons, 'addPuddles').name('blue puddle').listen();
        this.add(this.guiButtons, 'addSpeedBonuses').name('red speedbonus').listen();
        this.add(this.guiButtons, 'addPotholes').name('yellow pothole').listen();
        this.add(this.guiButtons, 'moveSpeedBonuses').name('Move speedBonus').listen();
        this.add(this.guiButtons, 'movePotholes').name('Move potholes').listen();
        this.add(this.guiButtons, 'movePuddles').name('Move puddles').listen();
    }
}
