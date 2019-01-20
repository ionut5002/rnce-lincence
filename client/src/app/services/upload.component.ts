import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

import { Observable, Subject, ReplaySubject, from, of, range } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { combineLatest } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { BlogService } from './blog.service';

@Component({
  selector: 'app-stop-training',
  templateUrl:'./upload.component.html' 
})
export class UploadFilesComponent {
    uploads: any[];
    uploadsNames: any[];
     
    allPercentage: Observable<any>;
    files: Observable<any>;
    urll;
  constructor(@Inject(MAT_DIALOG_DATA) public passedData: any, public storage: AngularFireStorage, private blogService: BlogService) {}

  importImages(event) {
    // reset the array 
    this.uploads = [];
    this.uploadsNames = [];
    const filelist = event.target.files;
    const allPercentage: Observable<number>[] = [];
    const randomKey = Math.random().toString(36).substring(2, 10);
    

    for (const file of filelist) {
        if (file.type === 'application/msword' ||
    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    file.type === 'application/pdf' || file.type === 'image/jpeg' ||
    file.type === 'image/jpg' || file.type === 'image/png') {
      const filenewname = randomKey + '-' + file['name']
      this.uploadsNames.push(filenewname);
      const path = filenewname;
      const ref = this.storage.ref(path);
      const task = this.storage.upload(path, file);
      const _percentage$ = task.percentageChanges();
      allPercentage.push(_percentage$);

      // create composed object with different information. ADAPT THIS ACCORDING YOUR NEED
      const uploadTrack = {
        fileName: file.name,
        percentage: _percentage$
      }
      

      // push each upload into the array
      this.uploads.push(uploadTrack);

      // for every upload do whatever you want in firestore with the uploaded file
      const _t = task.then((f) => {
        return f.ref.getDownloadURL().then((url) => {
          this.urll = url
        })
      })

    }}
    this.blogService.filenames.next(this.uploadsNames)
    this.allPercentage = combineLatest(allPercentage)
      .pipe(
      map((percentages) => {
        let result = 0;
        for (const percentage of percentages) {
          result = result + percentage;
        }
        return result / percentages.length;
      }),
      tap(console.log)
      );

  }
}
