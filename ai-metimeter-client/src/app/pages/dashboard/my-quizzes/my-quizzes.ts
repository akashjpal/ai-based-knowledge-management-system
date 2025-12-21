import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { RouterModule } from '@angular/router';

interface Quiz {
    id: string;
    title: string;
    subject: string;
    createdAt: string;
    questionsCount: number;
    status: 'Published' | 'Draft';
    thumbnailUrl?: string;
}

@Component({
    selector: 'app-my-quizzes',
    standalone: true,
    imports: [
        CommonModule,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatChipsModule,
        RouterModule
    ],
    templateUrl: './my-quizzes.html',
    styleUrl: './my-quizzes.scss'
})
export class MyQuizzes {
    quizzes: Quiz[] = [
        {
            id: '1',
            title: 'Introduction to Photosynthesis',
            subject: 'Biology',
            createdAt: '2024-12-20',
            questionsCount: 15,
            status: 'Published',
            thumbnailUrl: ''
        },
        {
            id: '2',
            title: 'World War II Timeline',
            subject: 'History',
            createdAt: '2024-12-18',
            questionsCount: 10,
            status: 'Draft',
        },
        {
            id: '3',
            title: 'Basic Algebra Concepts',
            subject: 'Mathematics',
            createdAt: '2024-12-15',
            questionsCount: 20,
            status: 'Published',
        }
    ];
}
