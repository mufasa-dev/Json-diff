import { Component, ElementRef, EventEmitter, Input, Output, signal, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-json-textarea',
  templateUrl: './json-textarea.html',
  styleUrl: '../app.scss'
})
export class JsonTextArea {
  @Input()  json: string = '';
  @Output() jsonChange = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  onInput(event: Event) {
    const value = (event.target as HTMLTextAreaElement).value;
    this.jsonChange.emit(value);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        try {
          let text = reader.result as string;

          // Se for JS ou TS, extrai apenas o objeto exportado
          if (/\.(ts|js)$/i.test(file.name)) {
            const exportRegex =
              /export\s+(?:const|default|class|let|var)\s+\w+(?:\s*:\s*[\w<>,\s\[\]\?]+)?\s*=\s*(\{[\s\S]*\})\s*(?:;|$)/m;
            const match = text.match(exportRegex);

            if (!match) {
              throw new Error("No exported objects found in the file.");
            }

            text = match[1];

            // Converte o objeto JS/TS para um objeto real
            const obj = new Function(`return (${text})`)();

            // Emite como string JSON
            this.jsonChange.emit(JSON.stringify(obj, null, 2));
          } else {
            // JSON puro
            const obj = JSON.parse(text);
            this.jsonChange.emit(JSON.stringify(obj, null, 2));
          }

          if (this.fileInput) {
            this.fileInput.nativeElement.value = "";
          }
        } catch (err) {
          alert(`Invalid file: ${(err as Error).message}`);
        }
      };

      reader.readAsText(file);
    }
  }

}
