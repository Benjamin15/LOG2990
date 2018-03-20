import { StateOrthographicCamera } from './state-camera/state-orthoCamera';
import { StatePerspectiveCamera } from './state-camera/state-perspectiveCamera';
import { RendererRaceService } from './../renderer/renderer.service';
import { StateMirrorCamera } from './state-camera/state-mirrorCamera';
import { SceneRaceService } from './../scene/scene.service';
import { MirrorService } from './mirror_service';

const ZOOM_IN_FACTOR_PERSPECTIVE = -0.1;
const ZOOM_OUT_FACTOR_PERSPECTIVE = 0.1;
const ZOOM_IN_FACTOR_ORTHOGRAPHIC = 0.1;
const ZOOM_OUT_FACTOR_ORTHOGRAPHIC = -0.1;
const ZOOM_IN_MAX_PERSPECTIVE = -2;
const ZOOM_OUT_MAX_PERSPECTIVE = 5;
const ZOOM_IN_MAX_ORTHOGRAPHIC = 5;
const ZOOM_OUT_MAX_ORTHOGRAPHIC = -0.5;

export class Camera {
    public cameraPerspective: StatePerspectiveCamera;
    public cameraOrthogonal: StateOrthographicCamera;
    public cameraTarget: THREE.Object3D;
    public cameraMirror: StateMirrorCamera;
    public mirrorActivated: boolean;

    private zoomFactorPerspective = 0;
    private zoomFactorOrthogonal = 0;
    private isPerspective: boolean;
    private mirror: MirrorService;

    constructor(object: THREE.Object3D, scene: SceneRaceService) {
        this.isPerspective = true;
        this.cameraOrthogonal = new StateOrthographicCamera();
        this.cameraPerspective = new StatePerspectiveCamera();
        this.cameraMirror = new StateMirrorCamera();
        scene.add(this.cameraOrthogonal);
        this.cameraTarget = object;
        this.mirrorActivated = false;
        this.mirror = new MirrorService();
    }

    public update(): void {
        if (!this.isPerspective) {
            this.cameraOrthogonal.update(this.cameraTarget);
        }
    }

    public render(scene: SceneRaceService, renderer: RendererRaceService): void {
        if (!this.isPerspective) {
            this.resetMainView(renderer);
            this.cameraOrthogonal.render(renderer, scene);
        } else {
            if (this.mirrorActivated) {
                this.renderWithRetro(scene, renderer);
            } else {
                this.resetMainView(renderer);
                this.cameraPerspective.render(renderer, scene);
            }
        }
    }

    public apply(object: THREE.Object3D, scene: SceneRaceService): void {
        this.cameraTarget = object;
        if (!this.isPerspective) {
            this.cameraOrthogonal.apply(object, scene);
        } else {
            this.cameraPerspective.apply(object);
            this.cameraMirror.apply(object);
        }
    }

    public switch(scene: SceneRaceService): void {
        this.isPerspective = (this.isPerspective) ? false : true;
    }

    public zoomIn(): void {
        if (this.isPerspective && this.zoomFactorPerspective > ZOOM_IN_MAX_PERSPECTIVE) {
            this.zoomFactorPerspective += ZOOM_IN_FACTOR_PERSPECTIVE;
            this.cameraPerspective.translateZ(ZOOM_IN_FACTOR_PERSPECTIVE);
        } else if (!this.isPerspective && this.zoomFactorOrthogonal < ZOOM_IN_MAX_ORTHOGRAPHIC) {
            this.zoomFactorOrthogonal += ZOOM_IN_FACTOR_ORTHOGRAPHIC;
            this.cameraOrthogonal.zoom += ZOOM_IN_FACTOR_ORTHOGRAPHIC;
            this.cameraOrthogonal.updateProjectionMatrix();
        }
    }

    public zoomOut(): void {
        if (this.isPerspective && this.zoomFactorPerspective < ZOOM_OUT_MAX_PERSPECTIVE) {
            this.zoomFactorPerspective += ZOOM_OUT_FACTOR_PERSPECTIVE;
            this.cameraPerspective.translateZ(ZOOM_OUT_FACTOR_PERSPECTIVE);
        } else if (!this.isPerspective && this.zoomFactorOrthogonal > ZOOM_OUT_MAX_ORTHOGRAPHIC) {
            this.zoomFactorOrthogonal += ZOOM_OUT_FACTOR_ORTHOGRAPHIC;
            this.cameraOrthogonal.zoom += ZOOM_OUT_FACTOR_ORTHOGRAPHIC;
            this.cameraOrthogonal.updateProjectionMatrix();
        }
    }

    public renderWithRetro(scene: SceneRaceService, renderer: RendererRaceService): void {
        renderer.clear();
        this.mirror.render(this.cameraPerspective, this.cameraMirror, scene, renderer);

    }

    public resetMainView(renderer: RendererRaceService): void {
        renderer.clear();
        renderer.setViewport(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissor(0, 0, window.innerWidth, window.innerHeight);
        renderer.setScissorTest(true);
    }
}
