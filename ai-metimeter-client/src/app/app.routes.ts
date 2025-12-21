import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing';
export const routes: Routes = [
    { path: '', component: Landing },
    {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.DASHBOARD_ROUTES)
    },
    { path: '**', redirectTo: '' }
];
