import { Component } from '@angular/core';
import { SpacexApiService } from '../../service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  launches: any[] = [];
  rockets = new Map<string, any>();
  view: 'past' | 'upcoming' = 'past';
  loading = false;
  error = '';
  displayed: any[] = [];

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loadLaunches();
  }

  toggleView(view: 'past' | 'upcoming') {
    console.log(' Toggling view to:', view);
    this.view = view;
    this.loadLaunches();
  }

  loadLaunches() {
    this.loading = true;
    this.error = '';
    this.launches = [];
    this.displayed = [];

    const apiCall =
      this.view === 'past'
        ? this.api.getPastLaunches()
        : this.api.getUpcomingLaunches();

    console.log('📡 Fetching launches for view:', this.view);

    apiCall.subscribe({
      next: (data) => {
        console.log(' Launches fetched:', data.length);
        this.launches = data || [];
        this.fetchAllRockets();
      },
      error: (err) => {
        this.error = 'Failed to load launches';
        this.loading = false;
        console.error(' Error loading launches:', err);
      },
    });
  }

  fetchAllRockets() {
    const rocketIds = Array.from(new Set(this.launches.map((l) => l.rocket)));
    console.log(' Fetching rockets for IDs:', rocketIds);

    if (!rocketIds.length) {
      console.warn(' No rocket IDs found.');
      this.displayed = [...this.launches];
      this.loading = false;
      return;
    }

    this.api.getRocketsByIds(rocketIds).subscribe({
      next: (rockets) => {
        rockets.forEach((r) => {
          if (r && r.id) {
            this.rockets.set(r.id, r);
          }
        });

        this.displayed = [...this.launches];
        console.log(' Displaying launches:', this.displayed.length);
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load rockets';
        this.loading = false;
        console.error(' Error loading rockets:', err);
      },
    });
  }
}
