import { Component, inject, OnInit } from '@angular/core';
import { SheetsService } from '../../../Services/sheets.service';
import { Matrial, Sheet } from '../../../model/trinee-sheets';
import { CommonModule } from '@angular/common';
import { FormatDatePipe } from '../../../Pipes/formatte-Date.pipe';
declare var $: any;

@Component({
  selector: 'app-sheets',
  standalone: true,
  imports: [CommonModule, FormatDatePipe],
  templateUrl: './sheets.component.html',
  styleUrls: ['./sheets.component.scss'],
})
export class SheetsComponent implements OnInit {
  // Inject services and dependencies
  private _sheetService = inject(SheetsService);

  // Arrays to hold sheets and materials data
  sheetMatrial: Matrial[] = [];
  sheets: Sheet[] = [];
  matrialName: string = '';
  isLoading: boolean = true;
  loadingSheet: boolean = false;

  // Lifecycle hook that runs after the component initializes
  ngOnInit(): void {
    this.loadSheets(); // Load sheets when the component initializes
  }

  // Fetches all sheets from the service
  loadSheets(): void {
    this._sheetService.getAllSheets().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.isLoading = false;
          this.sheets = data; // Update sheets array with fetched data
        }
      },
    });
  }

  // Fetches material data for a specific sheet by ID and sets the material name
  updateMatrial(id: any, matrialName: string): void {
    this.loadingSheet = true;
    this.activeCard(id);
    this.matrialName = matrialName; // Set the name of the selected material
    this._sheetService.getMaterialsInSheet(id).subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.sheetMatrial = data; // Update sheetMatrial array with fetched data
          this.loadingSheet = false;
        }
      },
      error: (err) => console.error('Error loading material:', err), // Handle errors
    });
  }

  // Opens a material link in a new tab
  public openLinkMatrial(url: string): void {
    window.open(url, '_blank'); // Open the URL in a new browser tab
  }
  activeCard(id: any): void {
    $(`.content`).removeClass('border-card');
    $(`.btn`).removeClass('border-btn');
    $(`#${id} .content`).addClass('border-card');
    $(`#${id}.btn`).addClass('border-btn');
  }
  openLink(url: string): void {
    window.open(url, '_blank');
  }
}
