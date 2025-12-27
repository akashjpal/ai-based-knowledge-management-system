import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-landing-pricing',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './landing-pricing.html',
    styleUrl: './landing-pricing.scss'
})
export class LandingPricing {
    plans = [
        {
            name: 'Starter',
            price: '$0',
            period: '/month',
            description: 'Perfect for trying out our AI assessment tools.',
            features: ['5 AI Quizzes per month', 'Basic Analytics', 'PDF Export', 'Email Support'],
            highlight: false,
            cta: 'Get Started'
        },
        {
            name: 'Pro',
            price: '$29',
            period: '/month',
            description: 'For educators who need power and flexibility.',
            features: ['Unlimited AI Quizzes', 'Advanced Analytics', 'Custom Branding', 'Priority Support', 'Team Collaboration'],
            highlight: true,
            cta: 'Upgrade to Pro'
        },
        {
            name: 'Enterprise',
            price: 'Custom',
            period: '',
            description: 'Tailored solutions for large institutions.',
            features: ['SSO Integration', 'Dedicated Success Manager', 'SLA Guarantee', 'Custom AI Models', 'Audit Logs'],
            highlight: false,
            cta: 'Contact Sales'
        }
    ];
}
