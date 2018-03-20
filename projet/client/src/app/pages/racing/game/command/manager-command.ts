import { CommandManageRetro } from './manager-retro';
import { CommandZoomOut } from './zoom-out';
import { CommandZoomIn } from './zoom-in';
import { PlayerVirtual } from './../players/player-virtual';
import { Player } from './../players/player';
import { CommandSwitchHeadLights } from './switch-headLights';
import { CommandMovementForwardRight } from './movement-forward-right';
import { CommandMovementForwardLeft } from './movement-forward-left';
import { CommandMovementForward } from './movement-forward';
import { CommandMovementBreak } from './movement-break';
import { CommandSwitchCamera } from './switch-camera';
import { CommandSwitchNight } from './switch-night';
import { Command } from './command';
import { Key } from './../keyboard/key';

const LEFT = 65;
const RIGHT = 68;
const FORWARD = 87;
const SWITCH_NIGHT = 78;
const SWITCH_CAMERA = 67;
const SWITCH_HEADLIGHTS = 76;
const ZOOM_IN = 107;
const ZOOM_OUT = 109;
const MANAGE_RETRO = 82;
const SHIFT = 16;
const EQUAL = 187;
const DASH  = 189;

export class ManagerCommand {
    public key: Key;

    private antiBounceHeadlights: boolean;
    private antiBounceCamera: boolean;
    private antiBounceNight: boolean;
    private command: Command;

    constructor() {
        this.antiBounceHeadlights = true;
        this.antiBounceCamera = true;
        this.antiBounceNight = true;
        this.key = new Key();
    }

    public executeCommand(player: Player): void {
        this.updateCommand(player);
        if (this.command) {
            this.command.execute(player);
        }
    }

    public setIaHeadLights(playersVirtual: Array<PlayerVirtual>): void {
        for (let i = 0; i < playersVirtual.length; i++) {
            playersVirtual[i].car.setLightOn();
        }
    }

    private updateCommand(player: Player): void {
        this.updateCommandMovement();
        this.updateCommandConfiguration(player);
    }

    private updateCommandMovement(): void {

        if (this.key.isDown(FORWARD) && this.key.isDown(LEFT)) {
            this.command = new CommandMovementForwardLeft();
        } else if (this.key.isDown(FORWARD) && this.key.isDown(68)) {
            this.command = new CommandMovementForwardRight();
        } else if (this.key.isDown(FORWARD)) {
            this.command = new CommandMovementForward();
        } else if (this.key.isDown(RIGHT)) {
            this.command = new CommandMovementForwardRight();
        } else if (this.key.isDown(LEFT)) {
            this.command = new CommandMovementForwardLeft();
        } else {
            this.command = new CommandMovementBreak();
        }
    }

    private updateCamera(player: Player): void {
        if (this.key.isDown(SWITCH_CAMERA) && this.antiBounceCamera) {
            new CommandSwitchCamera().execute(player);
            this.antiBounceCamera = false;
        } else if (this.key.isDown(ZOOM_IN) || (this.key.isDown(SHIFT) && this.key.isDown(EQUAL))) {
            new CommandZoomIn().execute(player);
        } else if (this.key.isDown(ZOOM_OUT) || (this.key.isDown(SHIFT) && this.key.isDown(DASH))) {
            new CommandZoomOut().execute(player);
        } else if (this.key.isDown(MANAGE_RETRO) && this.antiBounceCamera) {
            new CommandManageRetro().execute(player);
            this.antiBounceCamera = false;
        } else if (!this.key.isDown(SWITCH_CAMERA) && !this.key.isDown(MANAGE_RETRO)) {
            this.antiBounceCamera = true;
        }
    }

    private updateHeadlights(player: Player): void {
        if (this.key.isDown(SWITCH_HEADLIGHTS) && this.antiBounceHeadlights) {
            new CommandSwitchHeadLights().execute(player);
            this.antiBounceHeadlights = false;
        } else if (!this.key.isDown(SWITCH_HEADLIGHTS)) {
            this.antiBounceHeadlights = true;
        }
    }

    private updateNightVision(player: Player): void {
        if (this.key.isDown(SWITCH_NIGHT) && this.antiBounceNight) {
            player.switchNightIsOn = true;
            new CommandSwitchNight().execute(player);
            this.antiBounceNight = false;
        } else if (!this.key.isDown(SWITCH_NIGHT)) {
            this.antiBounceNight = true;
        }
    }

    private updateCommandConfiguration(player: Player): void {
        this.updateCamera(player);
        this.updateNightVision(player);
        this.updateHeadlights(player);
    }
}
