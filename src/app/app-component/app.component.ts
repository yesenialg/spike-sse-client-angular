import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ScoreService } from '../services/score.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  private scoreService = inject(ScoreService);
  public gameScore$ = this.scoreService.scores$;

  public stop(): void {
    this.scoreService.stop();
  }
  public start(): void {
    this.scoreService.start();
  }
}

