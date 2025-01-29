import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-communities',
  standalone: true,
  imports: [],
  templateUrl: './Communities.component.html',
  styleUrls: ['./Communities.component.scss'],
})
export class CommunitiesComponent {
  @Input() clientData: { id: string; name: string; logoUrl: string }[] = [];

  clientData1 = [
    {
      id: '9fdd1159-811d-41c0-70d1-08dd2f0970fb',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/f513ed20-2287-4292-bedf-cb575b2e33dc.jpg',
    },
    {
      id: 'e02b9bb3-f6d9-46a1-121c-08dd3193e92b',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/e06616ba-64d0-4fba-8acd-dfd4cac74e7e.png',
    },
    {
      id: '916680e4-0889-46ea-ec4f-08dd3cff5c81',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/a90f19dc-4474-4751-b01d-c61529bcfa8b.png',
    },
    {
      id: '18f4daab-9ac3-4410-1aef-08dd2b6e5dd7',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/d493d9cd-5213-43a4-8d78-f30d447865d7.png',
    },
    {
      id: '596fe2ab-f5d1-430f-70d3-08dd2f0970fb',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/77b90fef-2163-4d08-aaed-123b86798068.jpg',
    },
    {
      id: 'ac00f55a-0ff1-4431-eb16-08dd2b21baf8',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/65097527-79ba-4b97-b4f6-834c6003a30c.png',
    },
    {
      id: '1aa268f2-ca75-4d17-ae34-08dd37c8ea33',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/c42aadf5-2e72-4435-9d0e-ec1bf6af841f.jpg',
    },
    {
      id: '28a51f90-30e3-488d-f92b-08dd30084ca3',
      name: null,
      logoUrl:
        'https://psolve-001-site1.qtempurl.com/images/dbda9374-f17a-4822-883b-eabb907a9304.png',
    },
  ];
}
