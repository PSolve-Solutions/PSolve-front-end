import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  inject,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { StaffLeaderService } from '../../services/staff-leader.service';
import { RolesService } from '../../services/roles.service';
import { AuthService } from '../../../../authentication/services/auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dropdown-roles',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dropdown-roles.component.html',
  styleUrl: './dropdown-roles.component.scss',
})
export class DropdownRolesComponent implements OnInit {
  @Output() staffRequested = new EventEmitter<string>();
  @Input() selectedStaffId: string = '';
  dashboardService = inject(DashboardService);
  toastr = inject(ToastrService);
  authService = inject(AuthService);
  staffLeaderService = inject(StaffLeaderService);
  rolesService = inject(RolesService);
  elementRef = inject(ElementRef);
  roles: any[] = [];
  allCamps: any[] = [];
  roleInfo!: { userId: string; role: string; campId: number };
  filteredRoles: any[] = [];
  selectedRole: any | null = null;
  dropdownOpen: boolean = false;
  dropdownCampForT: boolean = false;
  dropdownCampForH: boolean = false;

  ngOnInit() {
    this.fetchAllRoles();
    this.fetchAllCamps();
  }

  fetchAllRoles(): void {
    this.dashboardService.roles().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.roles = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  fetchAllCamps(): void {
    this.dashboardService.getAllCamps().subscribe({
      next: ({ statusCode, data }) => {
        if (statusCode === 200) {
          this.allCamps = data;
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onSearch(value: string) {
    this.filteredRoles = this.roles.filter((role) =>
      role.name.toLowerCase().includes(value.toLowerCase())
    );
  }
  selectRole(role: any) {
    this.selectedRole = role;
    if (this.selectedRole.name === 'Trainee') {
      this.dropdownOpen = true;
      this.dropdownCampForT = true;
      this.dropdownCampForH = false;
    } else if (this.selectedRole.name === 'Head_Of_Camp') {
      this.dropdownOpen = true;
      this.dropdownCampForT = false;
      this.dropdownCampForH = true;
    } else {
      this.dropdownCampForH = false;
      this.dropdownCampForT = false;
      this.dropdownOpen = false;
      const roleInfo = {
        userId: this.selectedStaffId,
        role: this.selectedRole.name,
      };
      this.saveNewRoles(roleInfo);
    }
  }

  selectCamp(camp: any): void {
    const roleInfo = {
      userId: this.selectedStaffId,
      role: this.selectedRole.name,
      campId: camp.id,
    };
    this.saveNewRoles(roleInfo);
    this.dropdownOpen = false;
  }

  saveNewRoles(roleInfo: any): void {
    this.rolesService.assignToRole(roleInfo).subscribe({
      next: ({ statusCode, message }) => {
        if (statusCode === 200) {
          if (this.authService.currentUser().id === roleInfo.userId) {
            this.authService.updateUserRoles(roleInfo.role, 'add');
          }
          this.staffRequested.emit(this.selectedStaffId);
          this.toastr.success(message);
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addNewRole(roleName: string): void {
    this.rolesService.addNewRole(roleName).subscribe({
      next: ({ statusCode, data }) => {
        const roleInfo = {
          userId: this.selectedStaffId,
          role: roleName,
        };
        this.saveNewRoles(roleInfo);
        if (statusCode === 200) {
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  deleteRole(roleName: string) {
    this.rolesService.removeRoleFromSystem(roleName).subscribe({
      next: ({ statusCode, data }) => {
        this.fetchAllRoles();
        if (statusCode === 200) {
        } else {
          console.log('error');
        }
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  onDropdownFocus() {
    this.dropdownOpen = true;
  }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement: HTMLElement): void {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside && this.dropdownOpen) {
      this.dropdownOpen = false;
    }
  }
  closeDropdown(): void {}
}
