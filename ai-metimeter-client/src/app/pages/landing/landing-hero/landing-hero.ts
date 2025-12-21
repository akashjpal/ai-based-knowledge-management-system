import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-landing-hero',
  imports: [MatButtonModule, RouterLink],
  templateUrl: './landing-hero.html',
  styleUrl: './landing-hero.scss',
})
export class LandingHero {

}
