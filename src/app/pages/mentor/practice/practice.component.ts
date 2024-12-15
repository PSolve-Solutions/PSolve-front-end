import { Component, HostListener } from '@angular/core';
import { PracticeService } from '../services/practice.service';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
import { UtcToLocalPipe } from '../../../pipes/utc-to-local.pipe';
import { LocalTimePipe } from '../../../pipes/local-time.pipe';
import { FormsModule } from '@angular/forms';
import { UtcDatePipe } from '../../../pipes/utc-date.pipe';
import { MentorHeaderComponent } from '../../../layouts/mentor/mentor-header/mentor-header.component';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [
    MentorHeaderComponent,
    FormsModule,
    CommonModule,
    UtcToLocalPipe,
    LocalTimePipe,
    UtcDatePipe,
  ],
  templateUrl: './practice.component.html',
  styleUrl: './practice.component.scss',
})
export class PracticeComponent {
  isLoading: boolean = false;
  private utc = new UtcDatePipe();
  dateEd: any;
  titleEd: any;
  linkEd: any;
  notesEd: any;
  statusEd: any = 1;
  timeEd: any;
  idEd: any;
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Check if the click was outside the dropdown and the related button
    if (!target.closest('.relative') && !target.closest('.dropdown')) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach((dropdown) => dropdown.classList.add('hidden'));
    }
  }

  upd(ind: any, item: any) {
    item.state = this.stand[ind].state;

    let i = {
      practiceId: item.id,
      title: item.title,
      meetingLink: item.meetingLink,
      note: item.note,
      time: item.time,
      state: item.state != 1 ? 1 : 2,
    };

    this.serv.upd(i).subscribe((d: ResponseHeader) => {
      if (d.isSuccess) {
        if (this.stand[ind].state == 1) {
          this.stand[ind].state = 2;
        } else {
          this.stand[ind].state = 1;
        }
      }
    });
  }
  del(id: any) {
    this.serv.del(id).subscribe((d: ResponseHeader) => {
      if (d.isSuccess) {
        document.getElementById('d' + id)?.remove();
      }
    });
  }
  edit(data: any) {
    this.dateEd = data.time;
    this.titleEd = data.title;
    this.linkEd = data.meetingLink;
    this.notesEd = data.note;
    this.statusEd = data.state;
    this.idEd = data.id;
    this.show('edit');
  }
  edi(id: any) {
    let i = {
      practiceId: id,
      title: this.titleEd,
      meetingLink: this.linkEd,
      note: this.notesEd,
      time: this.dateEd,
      state: this.statusEd,
    };

    this.edError = [];
    if (this.dateEd) {
      this.serv.upd(i).subscribe((d: ResponseHeader) => {
        if (d.isSuccess) {
          this.get(localStorage.getItem('camp'));
          this.show('edit');
        } else {
          for (const field in d.errors) {
            if (d.errors.hasOwnProperty(field)) {
              // Check if d.errors[field] is an array before using join
              if (Array.isArray(d.errors[field])) {
                this.edError.push(` ${d.errors[field].join(', ')}`);
              } else {
                this.edError.push(` ${d.errors[field]}`); // Directly push if not an array
              }
            }
          }
        }
      });
    } else {
      this.edError.push('Enter a valid date');
    }
  }
  edError: any[] = [];
  isShow: boolean = false;
  date: any = ''; // Initialize as empty string
  link: any = ''; // Initialize as empty string
  title: any = ''; // Initialize as empty string
  notes: any = '';
  constructor(private serv: PracticeService) {
    if (localStorage.getItem('camp')) {
      this.get(localStorage.getItem('camp'));
    } else {
      this.stand = null;
    }
    this.date = ''; // Initialize as empty string
    this.link = ''; // Initialize as empty string
    this.title = ''; // Initialize as empty string
    this.notes = '';
  }
  stand: any;

  get(id: any) {
    this.isLoading = true;
    if (id != null) {
      this.serv.getData(id).subscribe((d: ResponseHeader) => {
        this.stand = d.data;
        this.isLoading = false;
      });
    } else {
      this.isLoading = false;
    }
  }
  show(id: string) {
    this.edError = [];
    this.error = false;
    this.err = [];
    document.getElementById(id)?.classList.toggle('hidden');
    if (id == 'add') {
      document.getElementById('focus')?.focus();
    }
  }
  handleClick(event: Event) {
    event.stopPropagation();
  }
  stat: number = 1;
  status() {
    if (this.stat == 1) {
      this.stat++;
    } else {
      this.stat--;
    }
  }
  statEd() {
    if (this.statusEd == 1) {
      this.statusEd++;
    } else {
      this.statusEd--;
    }
  }
  error: boolean = false;
  err: any[] = [];
  success: boolean = false;
  create(date: any, state: any, link: any, notes: any, title: any) {
    const data = {
      title: this.title,
      meetingLink: this.link,
      note: this.notes,
      time: this.date,
      campId: Number(localStorage.getItem('camp')),
    };

    this.err = [];
    this.success = false;
    if (this.date == '') {
      this.err.push(`enter a valid Date`);
      this.error = true;
    }
    if (this.title == '') {
      this.err.push(`Title must not be empty`);
      this.error = true;
    }
    if (this.link == '') {
      this.err.push(`Link must not be empty`);
      this.error = true;
    }
    let time: Date = new Date();
    let meet = new Date(this.date);
    if (meet < time) {
      this.err.push('Date Must Be in Future');
    } else if (this.link && this.title && this.date) {
      this.serv.addPractice(data).subscribe((d: ResponseHeader) => {
        if (!d.isSuccess) {
          // this.err.push('Date Must Be in Future');
          this.error = true;
          for (const field in d.errors) {
            if (d.errors.hasOwnProperty(field)) {
              // Check if d.errors[field] is an array before using join
              if (Array.isArray(d.errors[field])) {
                this.err.push(` ${d.errors[field].join(', ')}`);
              } else {
                this.err.push(` ${d.errors[field]}`); // Directly push if not an array
              }
            }
          }
        } else {
          this.date = ''; // Initialize as empty string
          this.link = ''; // Initialize as empty string
          this.title = ''; // Initialize as empty string
          this.notes = '';
          this.error = false;
          this.success = true;
          //  window.location.reload();
          this.show('add');
          this.get(localStorage.getItem('camp'));
        }
      });
    }
  }
  copyToClipboard(value: string) {
    // Create a temporary textarea element to use the Clipboard API
    const textarea = document.createElement('textarea');
    textarea.value = value;
    document.body.appendChild(textarea);
    textarea.select();
    if (!navigator.clipboard) {
      document.execCommand('copy');
      alert('Text copied to clipboard!');
    } else {
      navigator.clipboard
        .writeText(value)
        .then(function () {
          alert('copied'); // success
        })
        .catch(function () {
          alert('not copied'); // error
        });
    }

    document.body.removeChild(textarea);

    // Optionally, you can show a success message or alert
  }
}
