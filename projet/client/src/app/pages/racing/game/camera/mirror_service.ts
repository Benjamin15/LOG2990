import { StatePerspectiveCamera } from './state-camera/state-perspectiveCamera';
import { RendererRaceService } from './../renderer/renderer.service';
import { StateMirrorCamera } from './state-camera/state-mirrorCamera';
import { SceneRaceService } from './../scene/scene.service';

export class MirrorService {

    public render(mainCamera: StatePerspectiveCamera, mirrorCamera: StateMirrorCamera,
        scene: SceneRaceService, renderer: RendererRaceService): void {
        this.setMainView(renderer);
        mainCamera.render(renderer, scene);
        this.setRetroView(renderer);
        mirrorCamera.render(renderer, scene);
    }

    public setMainView(renderer: RendererRaceService): void {
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(true);
    }

    public setRetroView(renderer: RendererRaceService): void {
        renderer.setViewport(400, 500, 500, 150);
        renderer.setScissor(400, 500, 500, 150);
        renderer.setScissorTest(true);
    }
}
