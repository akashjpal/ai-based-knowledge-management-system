import { Component } from '@angular/core';
import { LandingHero } from './landing-hero/landing-hero';
import { LandingFeatures } from './landing-features/landing-features';
@Component({
  selector: 'app-landing',
  imports: [LandingHero, LandingFeatures],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
