import { Component } from '@angular/core';
import { SpacexApiService } from '../../service/spacex-api.service';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Launch, Rocket } from '../../core/interface/interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  view: 'past' | 'upcoming' = 'past';
  launches: Launch[] = [];
  rockets = new Map<string, Rocket>();
  loading = false;
  error = '';
  pageSize = 10;
  currentPage = 1;
  sortKey: 'date' | 'name' = 'date';
  sortAsc = false;
  totalCount = 0;

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
    const fetch =
      this.view === 'past'
        ? this.api.getPast(
            this.pageSize,
            (this.currentPage - 1) * this.pageSize
          )
        : this.api.getUpcoming();

    fetch.subscribe({
      next: (data) => {
        this.launches = data;
        this.totalCount = data.length + (this.view === 'past' ? 0 : 0); // adapt if API supports count
        this.loadRockets();
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message;
        this.loading = false;
      },
    });
  }

  // Reactive Form
  filterForm = new FormGroup({
    year: new FormControl(''),
    status: new FormControl('all'),
  });

  applyFilters() {
    const { year, status } = this.filterForm.value;
    let filtered = [...this.launches];

    if (year)
      filtered = filtered.filter(
        (l) => new Date(l.date_utc).getFullYear().toString() === year
      );
    if (status !== 'all') {
      filtered = filtered.filter((l) =>
        status === 'success'
          ? l.success
          : status === 'failure'
          ? l.success === false
          : true
      );
    }

    filtered.sort((a, b) => {
      const key = this.sortKey === 'date' ? 'date_utc' : 'name';
      return this.sortAsc
        ? a[key].localeCompare(b[key])
        : b[key].localeCompare(a[key]);
    });

    this.displayed = filtered;
  }

  loadRockets() {
    const ids = [...new Set(this.launches.map((l) => l.rocket))].filter(
      (id) => !this.rockets.has(id)
    );

    if (ids.length) {
      forkJoin(ids.map((id) => this.api.getRocket(id))).subscribe({
        next: (rockets) => {
          rockets.forEach((r) => this.rockets.set(r.id, r));
          this.applyFilters();
        },
      });
    } else {
      this.applyFilters();
    }
  }
}
