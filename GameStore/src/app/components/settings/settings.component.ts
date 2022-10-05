import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpEventType,
} from '@angular/common/http';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent implements OnInit {
  progress: number;
  message: string;
  img: string;
  @Output() public onUploadFinished = new EventEmitter();

  constructor(private http: HttpClient) {}

  ngOnInit() {}

  uploadFile = async (files: any) => {
    if (files.length === 0) {
      return;
    }
    let fileToUpload = <File>files[0];
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);

    let path = '';

    await this.http
      .post('https://localhost:44309/api/me', formData, {
        reportProgress: true,
        observe: 'events',
      })
      .subscribe({
        next: async (event) => {
          if (event.type === HttpEventType.UploadProgress) {
            // @ts-ignore
            this.progress = Math.round((100 * event.loaded) / event.total);
          } else if (event.type === HttpEventType.Response) {
            this.message = 'Upload success.';
            this.onUploadFinished.emit(event.body);
            console.log('Emmit body: ', event.body);
            // @ts-ignore
            path = event.body.path.trim();
            this.img = path;
            console.log('Path: ', path);
          }
        },
        error: (err: HttpErrorResponse) => console.log(err),
      });
  };
}
