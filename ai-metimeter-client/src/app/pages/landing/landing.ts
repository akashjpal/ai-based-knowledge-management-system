import { Component } from '@angular/core';
import { LandingHero } from './landing-hero/landing-hero';
import { LandingFeatures } from './landing-features/landing-features';
import { LandingPricing } from './landing-pricing/landing-pricing';
@Component({
  selector: 'app-landing',
  imports: [LandingHero, LandingFeatures, LandingPricing],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {

}
