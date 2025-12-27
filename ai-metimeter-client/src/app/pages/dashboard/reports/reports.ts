import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-reports',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatIconModule, MatButtonModule, MatListModule, MatProgressBarModule, RouterModule],
    templateUrl: './reports.html',
    styleUrls: ['./reports.scss']
})
export class Reports {
    recentActivity = [
        { title: 'Biology Quiz 101', score: '85%', date: '2 hours ago', icon: 'biotech' },
        { title: 'History Mid-Term', score: '92%', date: '1 day ago', icon: 'history_edu' },
        { title: 'Math Basics', score: '78%', date: '2 days ago', icon: 'calculate' }
    ];
}
