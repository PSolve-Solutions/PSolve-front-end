import { Component, EventEmitter, Output } from '@angular/core';
@Component({
  selector: 'app-success-message',
  standalone: true,
  imports: [],
  templateUrl: './success-message.component.html',
  styleUrl: './success-message.component.scss',
})
export class SuccessMessageComponent {
  @Output() closeModal = new EventEmitter<boolean>();
  cancel() {
    this.closeModal.emit(true);
  }
}
