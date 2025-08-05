import { Component, signal } from '@angular/core';
import { JsonTextArea } from './json-textarea/json-textarea';

@Component({
  selector: 'app-root',
  imports: [JsonTextArea],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  public json1 = "";
  public json2 = "";
}
