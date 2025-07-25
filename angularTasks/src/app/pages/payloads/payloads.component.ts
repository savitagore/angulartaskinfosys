import { Component, OnInit } from '@angular/core';
import { Payload } from '../../core/interface/Interface';
import { SpacexApiService } from '../../core/service/spacex-api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payloads',
  imports: [CommonModule],
  templateUrl: './payloads.component.html',
  styleUrl: './payloads.component.css',
})
export class PayloadsComponent implements OnInit {
  payloads: Payload[] = [];
  loading = false;
  error = '';

  constructor(private api: SpacexApiService) {}

  ngOnInit(): void {
    this.loading = true;
    this.api.getAllPayloads().subscribe({
      next: (data) => {
        this.payloads = data;
        this.loading = false;
      },
      error: (_) => {
        this.error = 'Failed to load payloads.';
        this.loading = false;
      },
    });
  }
}
