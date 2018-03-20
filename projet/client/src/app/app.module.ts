import { GameManager } from './pages/racing/game/game-manager';
import { SceneRaceService } from './pages/racing/game/scene/scene.service';
import { RendererRaceService } from './pages/racing/game/renderer/renderer.service';
import { RacingService } from './pages/racing/racing.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './pages/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';

import { CreatedPisteInformationComponent } from './pages/admin/piste/created-piste-information/created-piste-information.component';
import { AdminAuthenticationComponent } from './pages/admin/authentication/authentication.component';
import { DashboardAdminComponent } from './pages/admin/dashboard/dashboard.component';
import { RacingEditorComponent } from './race-editor/race-editor.component';
import { InformationComponent } from './pages/admin/information/information.component';
import { NavbarAdminComponent } from './pages/navbar/navbar-admin.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { CrosswordComponent } from './pages/crossword/game/crossword.component';
import { PisteListComponent } from './pages/admin/piste/list/list.component';
import { RaceListComponent } from './pages/racing/car-races-list/race-list/race-list.component';
import { PlayersComponent } from './pages/crossword/configuration/players/players.component';
import { RacingComponent } from './pages/racing/game/racing.component';
import { NavbarComponent } from './pages/navbar/navbar.component';
import { AppComponent } from './app.component';


import { PisteSpecificationService } from './pages/admin/piste/piste-specification.service';
import { UpdateInformationService } from './pages/admin/information/update-information.service';
import { AuthenticationService } from './pages/admin/authentication/authentication.service';
import { ObjectsHandlerService } from './race-editor/objects-handler.service';
import { SceneImporterService } from './race-editor/scene-importer.service';
import { RoadManagerService } from './pages/racing/game/roadManagerService';
import { CrosswordService } from './pages/crossword/services/crossword.service';
import { RendererService } from './race-editor/renderer.service';
import { RenderService } from './race-editor/render.service';
import { CameraService } from './race-editor/camera.service';
import { SceneService } from './race-editor/scene.service';

import { OrderByPipe } from './Pipe';
import { AuthGuard } from './pages/admin/authentication/authentication.guard';

import JoinCreateGameComponent from './pages/crossword/configuration/join-create-game/join-create-game.component';
import StyleGameComponent from './pages/crossword/configuration/style-game/style-game.component';
import FactoryComponent from './pages/crossword/configuration/factory.component';

@NgModule({
    declarations: [
        CreatedPisteInformationComponent,
        AdminAuthenticationComponent,
        DashboardAdminComponent,
        JoinCreateGameComponent,
        RacingEditorComponent,
        InformationComponent,
        NavbarAdminComponent,
        StyleGameComponent,
        DashboardComponent,
        CrosswordComponent,
        PisteListComponent,
        RaceListComponent,
        FactoryComponent,
        PlayersComponent,
        RacingComponent,
        NavbarComponent,
        AppComponent,
        OrderByPipe,
    ],

    imports: [
        BrowserAnimationsModule,
        AppRoutingModule,
        BrowserModule,
        FormsModule,
        HttpModule,
    ],

    providers: [
        PisteSpecificationService,
        UpdateInformationService,
        AuthenticationService,
        ObjectsHandlerService,
        SceneImporterService,
        RendererRaceService,
        RoadManagerService,
        GameManager,
        CrosswordService,
        SceneRaceService,
        RendererService,
        CameraService,
        RenderService,
        SceneService,
        AuthGuard,
        RacingService,
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
