import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'home', loadChildren: () => import('./components/pages/home/home.module').then(m => m.HomeModule) }, { path: 'episodes', loadChildren: () => import('./components/pages/episodes/episodes.module').then(m => m.EpisodesModule) }, { path: 'not', loadChildren: () => import('./components/pages/notFound/not-found/not-found.module').then(m => m.NotFoundModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
