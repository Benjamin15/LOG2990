import { Component, Input, ViewContainerRef, ViewChild, ReflectiveInjector, ComponentFactoryResolver } from '@angular/core';
import { CrosswordComponent } from './../game/crossword.component';
import JoinCreateGameComponent from './join-create-game/join-create-game.component';
import StyleGameComponent from './style-game/style-game.component';

@Component({
    selector: 'app-factory-component',
    entryComponents: [StyleGameComponent, JoinCreateGameComponent, CrosswordComponent],
    template: `
    <body>
        <div #factoryComponentContainer></div>
    <body>
  `,
})

export default class FactoryComponent {
    public currentComponent = null;

    @ViewChild('factoryComponentContainer', { read: ViewContainerRef })
    public factoryComponentContainer: ViewContainerRef;

    @Input()
    set componentData(data: { component: any, inputs: any }) {
        if (!data) {
            return;
        }
        const inputProviders = Object.keys(data.inputs).map((inputName) => {
            return { provide: inputName, useValue: data.inputs[inputName] };
        });
        const resolvedInputs = ReflectiveInjector.resolve(inputProviders);
        const injector = ReflectiveInjector.fromResolvedProviders(resolvedInputs, this.factoryComponentContainer.parentInjector);
        const factory = this.resolver.resolveComponentFactory(data.component);
        const component = factory.create(injector);
        this.factoryComponentContainer.insert(component.hostView);
        if (this.currentComponent) {
            this.currentComponent.destroy();
        }
        this.currentComponent = component;
    }

    constructor(private resolver: ComponentFactoryResolver) { }
}
