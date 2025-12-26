import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
    selector: 'app-assessment-report',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatTableModule,
        MatButtonModule,
        RouterModule
    ],
    templateUrl: './assessment-report.html',
    styleUrls: ['./assessment-report.scss']
})
export class AssessmentReport {
    assessmentId: string | null = null;

    // Mock Data
    assessmentDetails = {
        title: 'Introduction to Photosynthesis',
        subject: 'Biology',
        date: 'Dec 24, 2024',
        participants: 24,
        avgScore: 85,
        highestScore: 100,
        lowestScore: 65
    };

    displayedColumns: string[] = ['student', 'score', 'time', 'status'];
    studentResults = [
        { student: 'Alice Johnson', score: 95, time: '12m', status: 'Passed' },
        { student: 'Bob Smith', score: 82, time: '15m', status: 'Passed' },
        { student: 'Charlie Brown', score: 65, time: '18m', status: 'Failed' },
        { student: 'Diana Prince', score: 100, time: '10m', status: 'Passed' },
        { student: 'Evan Wright', score: 88, time: '14m', status: 'Passed' }
    ];

    constructor(private route: ActivatedRoute) {
        this.assessmentId = this.route.snapshot.paramMap.get('id');
        // In a real app, use this ID to fetch data
    }

    downloadPDF() {
        console.log('Downloading PDF for assessment:', this.assessmentId);
        // Implement PDF generation logic here
    }
}
