import { Routes } from '@angular/router';
import { DashboardLayout } from './dashboard-layout/dashboard-layout';
import { MyQuizzes } from './my-quizzes/my-quizzes';

export const DASHBOARD_ROUTES: Routes = [
    {
        path: '',
        component: DashboardLayout,
        children: [
            { path: '', redirectTo: 'my-quizzes', pathMatch: 'full' },
            { path: 'my-quizzes', component: MyQuizzes },
        ]
    }
];
