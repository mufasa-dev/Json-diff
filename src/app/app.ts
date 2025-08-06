import { Component, signal } from '@angular/core';
import { JsonTextArea } from './json-textarea/json-textarea';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
  public diffHtml1: SafeHtml = '';
  public diffHtml2: SafeHtml = '';

  constructor(private sanitizer: DomSanitizer) {}

  public compareJsonLines(): void {
    let obj1: any, obj2: any;
    try {
      obj1 = JSON.parse(this.json1);
      obj2 = JSON.parse(this.json2);
    } catch (e) {
      this.diffHtml1 = 'JSON inválido';
      this.diffHtml2 = 'JSON inválido';
      this.showResult = true;
      return;
    }

    const allKeys = Array.from(new Set([...Object.keys(obj1), ...Object.keys(obj2)]));
    let result1 = '';
    let result2 = '';

    for (const key of allKeys) {
      const val1 = obj1[key];
      const val2 = obj2[key];
      if (val1 === undefined) {
        // Adicionado
        result1 += `<div></div>`;
        result2 += `<div style="background-color: #b6fcb6">"${key}": ${JSON.stringify(val2)}</div>`;
      } else if (val2 === undefined) {
        // Removido
        result1 += `<div style="background-color: #ffb6b6">"${key}": ${JSON.stringify(val1)}</div>`;
        result2 += `<div></div>`;
      } else if (JSON.stringify(val1) === JSON.stringify(val2)) {
        // Igual
        result1 += `<div>"${key}": ${JSON.stringify(val1)}</div>`;
        result2 += `<div>"${key}": ${JSON.stringify(val2)}</div>`;
      } else {
        // Modificado
        result1 += `<div style="background-color: #ffe9b6">"${key}": ${JSON.stringify(val1)}</div>`;
        result2 += `<div style="background-color: #ffe9b6">"${key}": ${JSON.stringify(val2)}</div>`;
      }
    }

    this.diffHtml1 = this.sanitizer.bypassSecurityTrustHtml(result1);
    this.diffHtml2 = this.sanitizer.bypassSecurityTrustHtml(result2);
    this.showResult = true;
  }
}
