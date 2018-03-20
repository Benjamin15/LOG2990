import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreatedPisteInformationComponent } from './admin/piste/created-piste-information/created-piste-information.component';
import { AdminAuthenticationComponent } from './admin/authentication/authentication.component';
import { DashboardAdminComponent } from './admin/dashboard/dashboard.component';
import { RacingEditorComponent } from '../race-editor/race-editor.component';
import { InformationComponent } from './admin/information/information.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RaceListComponent } from './racing/car-races-list/race-list/race-list.component';
import { PlayersComponent } from './crossword/configuration/players/players.component';
import { RacingComponent } from './racing/game/racing.component';
import { AuthGuard } from './admin/authentication/authentication.guard';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminAuthenticationComponent,
        pathMatch: 'full'
    },
    {
        path: '',
        component: DashboardComponent,
        pathMatch: 'full'
    },
    {
        path: 'crossword',
        component: PlayersComponent,
        pathMatch: 'full'
    },
    {
        path: 'racing/:name/:turn/:difficulty',
        component: RacingComponent,
        pathMatch: 'full'
    },
    {
        path: 'adminNavigation',
        canActivate: [AuthGuard],
        component: DashboardAdminComponent,
        pathMatch: 'full'
    },
    {
        path: 'editor/:name',
        canActivate: [AuthGuard],
        component: RacingEditorComponent,
    },
    {
        path: 'raceList',
        component: RaceListComponent,
    },
    {
        path: 'information',
        canActivate: [AuthGuard],
        component: InformationComponent,
        pathMatch: 'full'
    },
    {
        path: 'editor',
        canActivate: [AuthGuard],
        component: RacingEditorComponent,
        pathMatch: 'full'
    },
    {
        path: 'race',
        component: RacingComponent,
        pathMatch: 'full'
    },
    {
        path: 'createPistes',
        canActivate: [AuthGuard],
        component: CreatedPisteInformationComponent,
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
