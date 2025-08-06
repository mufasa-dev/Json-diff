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
          const text = reader.result as string;
          JSON.parse(text);
          this.jsonChange.emit(text);
          // Limpa o input file após o upload
          if (this.fileInput) {
            this.fileInput.nativeElement.value = '';
          }
        } catch {
          alert('Arquivo JSON inválido!');
        }
      };
      reader.readAsText(file);
    }
  }
}
