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

  public showResult: boolean = false;
  public diffHtml1: string = '';
  public diffHtml2: string = '';

  public compareJsonLines(): void {
    const lines1 = this.json1.split('\n');
    const lines2 = this.json2.split('\n');
    const maxLength = Math.max(lines1.length, lines2.length);

    let result1 = '';
    let result2 = '';

    for (let i = 0; i < maxLength; i++) {
      const line1 = lines1[i] ?? '';
      const line2 = lines2[i] ?? '';
      if (line1 === line2) {
        result1 += `<div>${line1}</div>`;
        result2 += `<div>${line2}</div>`;
      } else {
        result1 += `<div style="background-color: #a5ffb0">${line1}</div>`;
        result2 += `<div style="background-color: #a5ffb0">${line2}</div>`;
      }
    }
    console.log(lines1);
    console.log(result2);
    this.diffHtml1 = result1;
    this.diffHtml2 = result2;
    this.showResult = true;
  }
}
