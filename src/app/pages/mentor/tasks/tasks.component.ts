import { Component, HostListener, inject } from '@angular/core';
import { MentorHeaderComponent } from '../../../layouts/mentor/mentor-header/mentor-header.component';
import { ResponseHeader } from '../../../shared/model/responseHeader';
import { CommonModule } from '@angular/common';
import { TasksService } from '../services/tasks.service';
import { LocalTimePipe } from '../../../pipes/local-time.pipe';
import { DatePickerComponent } from '../component/date-picker/date-picker.component';
import { UtcDatePipe } from '../../../pipes/utc-date.pipe';
import { FormsModule } from '@angular/forms';

import { LocaltoutcPipe } from '../../../pipes/localtoutc.pipe';
import { ActivatedRoute, Router } from '@angular/router';
import { TruncatePipe } from '../../../pipes/truncate.pipe';
import { ToastrModule, ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [
    TruncatePipe,
    FormsModule,
    UtcDatePipe,
    MentorHeaderComponent,
    LocaltoutcPipe,
    CommonModule,
    LocalTimePipe,
    DatePickerComponent,
    ToastrModule,
  ],
  templateUrl: './tasks.component.html',
  styleUrl: './tasks.component.scss',
})
export class TasksComponent {
  toastr = inject(ToastrService);
  id: any;
  // cancel(task : HTMLTextAreaElement){
  //   let x = this.ed.title;
  //   task.value = ''
  //   this.ed.title = x;
  //   this.show('edit');
  // }
  isLoading: boolean = false;
  showElement = true;
  formatDate(date: string | Date): string {
    // Convert the date to ISO format (YYYY-MM-DD)
    return new Date(date).toString().substring(0, 10);
  }

  updateTitle(data: any, dat: any, end: any): void {
    this.errors = [];
    const dateObj = new Date();
    const date = new Date(dat.value);
    // Check if inputElement is not null and has a value

    let e: Date;
    let s: Date;
    let task = {
      taskId: this.ed.taskId,
      title: data.value,
      startTime: new Date(),
      endTime: new Date(),
      traineeId: this.ed.traineeId,
    };
    if (!dat.value) {
      this.errors.push('Set Start Date');
    } else {
      
      s = new Date(dat.value);
      const localDat = new Date();
      const timezoneOff = localDat.getTimezoneOffset();
      let convertedTime = new Date(s);
      // console.log(timezoneOff)
      convertedTime=  new Date(convertedTime.getTime() - timezoneOff*60000 )
      // console.log(convertedTime);
      task.startTime = convertedTime;
    }
    if (!end.value) {
      this.errors.push('Set End Date');
    } else {
      e = new Date(end.value);
      const localDat = new Date();
      const timezoneOff = localDat.getTimezoneOffset();
      let convertedTime = new Date(e);
      // console.log(timezoneOff)
      convertedTime=  new Date(convertedTime.getTime() - timezoneOff*60000 )
      // console.log(convertedTime);
      task.endTime = convertedTime;
      
    }
    if (dat.value && end.value) {
      this.serv.updTask(task).subscribe((d: ResponseHeader) => {
        if (d.isSuccess) {
          this.ed.title = data.value;
          this.ed.startTime = s;
          this.ed.endTime = e;

          this.show('edit');
          this.refreshRouterOutlet();
        } else {
          this.errors = [];

          for (const field in d.errors) {
            if (d.errors.hasOwnProperty(field)) {
              // Check if d.errors[field] is an array before using join
              if (Array.isArray(d.errors[field])) {
                this.errors.push(` ${d.errors[field].join(', ')}`);
              } else {
                this.errors.push(` ${d.errors[field]}`); // Directly push if not an array
              }
            }
          }
        }
      });
    }
  }
  err: any[] = [];
  errors: any = [];
  create(
    task: HTMLTextAreaElement,
    startTime: HTMLInputElement,
    endTime: HTMLInputElement
  ) {
    let start: Date | null = null;
    let st: Date | null = null;
    let end: Date | null = null;
    let en: Date | null = null;
    this.crError = [];
    let time: Date = new Date();
    let star = new Date(startTime.value);
    let endd = new Date(endTime.value);
    // Validate and convert input times if provided
    if (endTime.value) {
      if (endd < time) {
        this.crError.push('End Time Must Be in Future');
      }
      end = new Date(endTime.value);
      en =  new Date(endTime.value); // Convert to string without 'Z'
    } else {
      this.crError.push('End Time Is Requiered');
    }
    if (startTime.value) {
      start = new Date(startTime.value);
      st =  new Date(startTime.value); // Convert to string without 'Z' .replace('Z', '')
      console.log(st);

      // let meet = new Date(startTime.value);
      if (star < time) {
        this.crError.push('Start Time Must Be in Future');
      }
    } else {
      this.crError.push('Start Time Is Requiered');
    }
    if (startTime.value && endTime.value) {
      if (star > endd) {
        this.crError.push('End Time Must Be Greater Than Start Time');
      }
    }
    const localDat = new Date();
    const timezoneOff = localDat.getTimezoneOffset();
    let sconvertedTime = new Date(startTime.value);
    // console.log(timezoneOff)
    sconvertedTime=  new Date(sconvertedTime.getTime() - timezoneOff*60000 )
    // console.log(convertedTime);
    st = sconvertedTime;

    let econvertedTime = new Date(endTime.value);
    // console.log(timezoneOff)
    econvertedTime=  new Date(econvertedTime.getTime() - timezoneOff*60000 )
    // console.log(convertedTime);
    en = econvertedTime;
    // Prepare the base data for the task creation
    const baseData = {
      titles: this.taskNo,
      startTime: st,
      endTime: en,
      traineesIds: this.trainTask,
      campId: Number(localStorage.getItem('camp')),
    };

    // Check for missing trainees and tasks
    if (this.chars.length == 0) {
      this.crError.push('Please add at least one trainee');
    }
    if (this.taskNo.length == 0) {
      this.crError.push('Add at least one task');
    }

    // If there are any errors, add them to `this.crError`
    if (this.crError.length == 0) {
      console.log(baseData);
      this.serv.addTask(baseData).subscribe({
        next: ({ statusCode, data, message }) => {
          if (statusCode === 200) {
            this.toastr.success(message);
            this.refreshRouterOutlet();
          } else {
            console.log('error');
          }
        },
        error: (err) => {
          console.log(err);
        },
      });
    }
  }

  crError: any[] = [];
  del(id: any) {
    let data = {
      taskId: id,
    };

    this.serv.del(id).subscribe((d: ResponseHeader) => {
      if (d.isSuccess) {
        document.getElementById('D' + id)?.remove();
        this.refreshRouterOutlet();
      }
    });
  }
  taskNo: any[] = [];
  onKeydown(event: KeyboardEvent, task: any) {
    let v = task.value;

    // Check if the Enter key was pressed and the input is not just whitespace
    if (
      event.key === 'Enter' &&
      v.replace(/\s+/g, '') !== '' &&
      !event.shiftKey
    ) {
      event.preventDefault(); // Prevents default newline behavior in textarea or input
      this.taskNo.push(task.value);
      task.value = ''; // Clears the input
    }
  }

  en(event: KeyboardEvent, task: any, val: any) {
    // Check if the Enter key was pressed and the input is not just whitespace
    if (
      event.key === 'Enter' &&
      val.value.replace(/\s+/g, '') !== '' &&
      !event.shiftKey
    ) {
      event.preventDefault(); // Prevents default newline behavior
      this.enable('en' + task);
      this.taskNo[task] = val.value;
      val.value = ''; // Clears the input
    }
  }

  handleClick(event: Event) {
    const element = event.target as HTMLElement;
    if (element.id != 'names' && element.id != 'rel' && this.isShow) {
      this.show('names');
    }
    event.stopPropagation();
  }
  handle(event: Event) {
    event.stopPropagation();
  }
  removeGrandparent(id: any, ind: any) {
    const grandparent = this.getGrandparentElement(id);

    if (grandparent) {
      this.taskNo.splice(ind, 1);
    }
  }

  getGrandparentElement(id: any): HTMLElement {
    // Traverse the DOM to find the grandparent
    let element: any = document.getElementById(id);
    if (element) {
      // Traverse up two levels to find the grandparent
      element = element.parentElement?.parentElement;
    }
    return element;
  }
  chars: any[] = [];
  add(id: string, trainee: any, f: String, l: String) {
    let e = document.getElementById(id);
    e?.classList.toggle('hidden');
    let char = f[0].toUpperCase() + l[0].toUpperCase();
    if (e?.classList.contains('hidden')) {
      this.trainTask = this.trainTask.filter((item) => item !== trainee);
      this.chars = this.chars.filter((item) => item !== char);
    } else {
      if (!this.chars.includes('ALL')) {
        this.trainTask.push(trainee);
        this.chars.push(char);
      }
    }
  }
  getFullPath(route: ActivatedRoute): string {
    let path = route.snapshot.url.map((segment) => segment.path).join('/');

    // Recursively add paths from child routes if they exist
    if (route.firstChild) {
      path += '/' + this.getFullPath(route.firstChild);
    }
    return path;
  }
  refreshRouterOutlet() {
    this.router
      .navigateByUrl('/mentor/blank', { skipLocationChange: true })
      .then(() => {
        this.router.navigate([
          'mentor/' + this.getFullPath(this.activatedRoute),
        ]);
      });
  }
  constructor(
    private serv: TasksService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    if (localStorage.getItem('camp')) {
      this.get(localStorage.getItem('camp'));
      this.train(localStorage.getItem('camp'));
      this.assig();
      this.id = 1;
    } else {
      this.tasks = null;
      this.id = null;
    }
  }
  trainTask: any[] = [];
  tasks: any = {};
  assign: any;
  assig() {
    this.serv
      .getAssign(localStorage.getItem('camp'))
      .subscribe((d: ResponseHeader) => {
        this.assign = d.data;
      });
  }
  trainee: any;
  selArr = false;
  show(id: string) {
    this.err = [];
    this.crError = [];
    this.errors = [];
    document.getElementById(id)?.classList.toggle('hidden');
    if (id == 'names') {
      this.isShow = !this.isShow;
    }
    if (id == 'select') {
      this.selArr = !this.selArr;
    }
    if (id == 'add') {
      document.getElementById('names')?.classList.add('hidden');
      this.isShow = false;
    }
  }
  get(id: any) {
    this.isLoading = true;
    if (id != null) {
      this.serv.getData(id).subscribe((d: ResponseHeader) => {
        this.tasks = d.data;

        this.isLoading = false;
      });
    }
  }
  train(id: any) {
    this.isLoading = true;
    if (id != null) {
      this.serv.trainees(id).subscribe((d: ResponseHeader) => {
        this.trainee = d.data;
        this.isLoading = false;
      });
    }
  }
  isShow = false;
  enable(id: any) {
    document.getElementById(id)?.removeAttribute('disabled');
  }
  ed = {
    traineeId: 'string',
    taskId: 0,
    firstName: 'string',
    middleName: 'string',
    lastName: 'string',
    photoUrl: null,
    title: 'string',
    startTime: new Date(),
    endTime: new Date(),
  };
  edSt = '';
  edEn = '';
  edit(data: any) {
    this.ed = data;
    this.ed.taskId = data.id;
    this.ed.title = data.title;
    this.ed.startTime = data.startTime
    this.ed.endTime = data.endTime
    this.edSt = data.startTime.slice(0,16)
    this.edEn =  data.endTime.slice(0,16)
    console.log(this.edEn)
    // this.ed = {
    //   "taskId": data.taskId,
    //   "title":  data.title,
    //   "startTime":  data.startTime,
    //   "endTime":  data.endTime,
    //   "traineeId":  data.traineeId
    // }
    let x = document.getElementById('edTitle') as HTMLTextAreaElement | null;
    if (x) {
      x.value = this.ed.title;
    }
    this.show('edit');
  }
  gen() {
    this.chars = [];
    this.chars.push('ALL');
    this.trainTask = [];
    if (document.getElementById('gen')?.classList.contains('hidden')) {
      this.trainee.forEach((e: any) => {
        this.trainTask.push(e.id);
        document.getElementById(`n${e.id}`)?.classList.remove('hidden');
      });
    } else {
      this.chars = [];
      this.trainTask = [];
      this.trainee.forEach((e: any) => {
        document.getElementById(`n${e.id}`)?.classList.add('hidden');
      });
    }

    this.show('gen');
  }
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Check if the click was outside the dropdown and the related button
    if (!target.closest('.relative')) {
      const dropdowns = document.querySelectorAll('.dropdown');
      dropdowns.forEach((dropdown) => dropdown.classList.add('hidden'));
    }
    if (!target.closest('.selBut')) {
      document.querySelector('#select')?.classList.add('hidden');
      this.selArr = false;
    }
  }
  getStat(start: any, end: any) {
    let d = new Date();
    
    start = new Date(start);

    end = new Date(end);
    start.setSeconds(0);
    start.setMilliseconds(0);
    end.setSeconds(0);
    end.setMilliseconds(0);
    const localDat = new Date();
    const timezoneOff = localDat.getTimezoneOffset();
    let sconvertedTime = new Date(start);
    // console.log(timezoneOff)
    sconvertedTime=  new Date(sconvertedTime.getTime() + timezoneOff*60000 )
    // console.log(convertedTime);
    start = sconvertedTime;

    let econvertedTime = new Date(end);
    // console.log(timezoneOff)
    econvertedTime=  new Date(econvertedTime.getTime() + timezoneOff*60000 )
    // console.log(convertedTime);
    end = econvertedTime;
    if (d.getTime() >= start.getTime() && d.getTime() <= end.getTime()) {
      return 1;
    } else if (d.getTime() < start.getTime()) {
      return 2;
    } else {
      return 0;
    }
  }
  selTrainee: any = 'all';
  selName: any = 'All';
  sel(trainee: any) {
    if (trainee != 'all') {
      this.selTrainee = trainee.id;
      this.selName = trainee.firstName + ' ' + trainee.middleName;
    } else {
      this.selTrainee = 'all';
      this.selName = 'All';
    }
  }
}
