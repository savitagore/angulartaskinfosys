import { Component, OnInit } from '@angular/core';
import { Rocket } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rockets',
  imports: [CommonModule],
  templateUrl: './rockets.component.html',
  styleUrl: './rockets.component.css',
})
export class RocketsComponent implements OnInit {
  rockets: Rocket[] = [];
  loading = false;
  error = '';

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllRockets().subscribe({
      next: (data) => {
        this.rockets = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load rockets.';
        this.loading = false;
      },
    });
  }
}
