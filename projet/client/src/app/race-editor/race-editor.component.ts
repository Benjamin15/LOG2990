import { AfterViewInit, Component, ElementRef, Input, ViewChild, HostListener } from '@angular/core';
import { RenderService } from './render.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import 'rxjs/add/operator/switchMap';

@Component({
    moduleId: module.id,
    selector: 'app-race-editor-component',
    templateUrl: './race-editor.component.html',
    styleUrls: ['./race-editor.component.css']
})

export class RacingEditorComponent implements AfterViewInit {
    @ViewChild('container')
    private containerRef: ElementRef;

    @Input()
    public rotationSpeedX = 0.005;

    @Input()
    public rotationSpeedY = 0.01;

    constructor(private renderService: RenderService,
        private route: ActivatedRoute,
    ) { }

    private getcontainer(): HTMLDivElement {
        return this.containerRef.nativeElement;
    }

    @HostListener('window:resize', ['$event'])
    public onResize(): void {
        this.renderService.onResize();
    }

    @HostListener('click', ['$event'])
    public showCoords(event: MouseEvent): void {
        if (!this.renderService.circuitFinished) {
            this.renderService.showCoords(event);
        }
    }

    /*@HostListener('mousedown', ['$event'])
    public selectPoint(event: MouseEvent) {
      if (event.button == 1) {
        this.renderService.selectPoint(event);
      }
    }*/

    @HostListener('mousemove', ['$event'])
    public onDocumentMouseMove(event: MouseEvent): void {
        this.renderService.onDocumentMouseMove(event);
    }

    @HostListener('mouseup', ['$event'])
    public onDocumentMouseUp(event: MouseEvent): void {
        this.renderService.onDocumentMouseUp(event);
    }

    @HostListener('mousedown', ['$event'])
    public onDocumentMouseDown(event: MouseEvent): void {
        if (event.button === 1) {
            this.renderService.onDocumentMouseDown(event);
        }
        if (event.button === 2) {
            this.renderService.testRightClick(event);
        }
    }

    @HostListener('window:keydown', ['$event'])
    public saveCircuit(event: KeyboardEvent): void {
        if (event.keyCode === 77 && event.ctrlKey) {
            this.renderService.saveCircuit();
        } else if (event.keyCode === 67) {
            this.renderService.canMoveCamera = true;
        }
    }

    @HostListener('window:keyup', ['$event'])
    public stopCamera(event: KeyboardEvent): void {
        if (event.keyCode === 67) {
            this.renderService.canMoveCamera = false;
        }
    }

    public ngAfterViewInit(): void {
        this.renderService.initialize(this.getcontainer(), this.rotationSpeedX, this.rotationSpeedY);
        this.route.paramMap
            .switchMap((params: ParamMap) => this.renderService.importScene(params.get('name')))
            .subscribe((circuit) => {
            });
    }
}
