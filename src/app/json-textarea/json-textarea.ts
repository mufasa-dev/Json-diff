import { Component, Input, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-json-textarea',
  templateUrl: './json-textarea.html',
  styleUrl: '../app.scss'
})
export class JsonTextArea {
  @Input()  json: string = '';
}
