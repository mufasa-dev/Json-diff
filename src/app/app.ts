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

  private formatDiff(key: string, val1: any, val2: any): { left: string, right: string } {
    // Se for array de objetos
    if (Array.isArray(val1) && Array.isArray(val2)) {
      let leftArr = '';
      let rightArr = '';
      const maxLen = Math.max(val1.length, val2.length);
      for (let i = 0; i < maxLen; i++) {
        const item1 = val1[i];
        const item2 = val2[i];
        if (item1 && item2) {
          // Recursivo para objetos dentro do array
          if (JSON.stringify(item1) === JSON.stringify(item2)) {
            leftArr += `<div><pre>${JSON.stringify(item1, null, 2)}</pre></div>`;
            rightArr += `<div><pre>${JSON.stringify(item2, null, 2)}</pre></div>`;
          } else {
            leftArr += `<div style="background-color: #ffe9b6; color: #92400e;"><pre>${JSON.stringify(item1, null, 2)}</pre></div>`;
            rightArr += `<div style="background-color: #ffe9b6; color: #92400e;"><pre>${JSON.stringify(item2, null, 2)}</pre></div>`;
          }
        } else if (item1 && !item2) {
          leftArr += `<div style="background-color: #ffb6b6; color: #991b1b;"><pre>${JSON.stringify(item1, null, 2)}</pre></div>`;
        } else if (!item1 && item2) {
          rightArr += `<div style="background-color: #b6fcb6; color: #065f46;"><pre>${JSON.stringify(item2, null, 2)}</pre></div>`;
        }
      }
      return {
        left: `<div><pre>"${key}": [\n</pre><div class="pl-5">${leftArr}</div><pre>]</pre></div>`,
        right: `<div><pre>"${key}": [\n</pre><div class="pl-5">${rightArr}</div><pre>]</pre></div>`
      };
    }

    // Se for objeto
    if (typeof val1 === 'object' && typeof val2 === 'object' && val1 && val2) {
      const allKeys = Array.from(new Set([...Object.keys(val1), ...Object.keys(val2)]));
      let leftObj = '';
      let rightObj = '';
      for (const subKey of allKeys) {
        const subVal1 = val1[subKey];
        const subVal2 = val2[subKey];
        const diff = this.formatDiff(subKey, subVal1, subVal2);
        leftObj += diff.left;
        rightObj += diff.right;
      }
      return {
        left: `<div><pre>"${key}": {\n</pre><div class="pl-5">${leftObj}</div><pre>}</pre></div>`,
        right: `<div><pre>"${key}": {\n</pre><div class="pl-5">${rightObj}</div><pre>}</pre></div>`
      };
    }

    // Primitivos
    if (val1 === undefined) {
      return {
        left: `<div></div>`,
        right: `<div style="background-color: #b6fcb6; color: #065f46;"><pre>"${key}": ${JSON.stringify(val2, null, 2)}</pre></div>`
      };
    } else if (val2 === undefined) {
      return {
        left: `<div style="background-color: #ffb6b6; color: #991b1b;"><pre>"${key}": ${JSON.stringify(val1, null, 2)}</pre></div>`,
        right: `<div></div>`
      };
    } else if (JSON.stringify(val1) === JSON.stringify(val2)) {
      return {
        left: `<div><pre>"${key}": ${JSON.stringify(val1, null, 2)}</pre></div>`,
        right: `<div><pre>"${key}": ${JSON.stringify(val2, null, 2)}</pre></div>`
      };
    } else {
      return {
        left: `<div style="background-color: #ffe9b6; color: #92400e;"><pre>"${key}": ${JSON.stringify(val1, null, 2)}</pre></div>`,
        right: `<div style="background-color: #ffe9b6; color: #92400e;"><pre>"${key}": ${JSON.stringify(val2, null, 2)}</pre></div>`
      };
    }
  }

  public tryParse = (input: string) => {
    input = input.trim();

    try {
      return JSON.parse(input);
    } catch {}

    const exportRegex = /export\s+(?:const|default|class|let|var)\s+\w*\s*=\s*(\{[\s\S]*\});?$/m;
    const match = input.match(exportRegex);
    if (match) {
      try {
        return JSON.parse(
          JSON.stringify(eval(`(${match[1]})`)) // Avalia apenas o objeto
        );
      } catch {
        return null;
      }
    }

    try {
      return JSON.parse(JSON.stringify(eval(`(${input})`)));
    } catch {
      return null;
    }
  };

  public compareJsonLines(): void {
    let obj1 = this.tryParse(this.json1);
    let obj2 = this.tryParse(this.json2);
    if (!obj1 || !obj2) {
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
      const diff = this.formatDiff(key, val1, val2);
      result1 += diff.left;
      result2 += diff.right;
    }

    this.diffHtml1 = this.sanitizer.bypassSecurityTrustHtml(
      `<pre>{</pre><div class="pl-5">${result1}</div><pre>}</pre>`
    );
    this.diffHtml2 = this.sanitizer.bypassSecurityTrustHtml(
      `<pre>{</pre><div class="pl-5">${result2}</div><pre>}</pre>`
    );
    this.showResult = true;
  }
}
