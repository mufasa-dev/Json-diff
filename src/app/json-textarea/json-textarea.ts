import { Component, EventEmitter, Input, Output, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-json-textarea',
  templateUrl: './json-textarea.html',
  styleUrl: '../app.scss'
})
export class JsonTextArea {
  @Input()  json: string = '';
  @Output() jsonChange = new EventEmitter<string>();

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.jsonChange.emit(value);
  }
}
