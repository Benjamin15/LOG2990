import { SceneImporterService } from './../../../../race-editor/scene-importer.service';
import { RendererRaceService } from './../renderer/renderer.service';
import { GameEngine } from './game-engine';
import { assert } from 'chai';

describe('Game Engine', () => {

    const gameEngine = new GameEngine(new RendererRaceService(), 'MyRace',
        new SceneImporterService(this.inject), 'amateur', 3);

    it('should be created', () => {
        assert(gameEngine);
    });
});
