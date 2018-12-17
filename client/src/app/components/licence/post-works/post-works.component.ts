
import { Component, OnInit } from '@angular/core';
import { LicenceService } from '../../../services/licence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';
import { map } from 'rxjs/operators';
import { Http } from '@angular/http';

@Component({
  selector: 'app-post-works',
  templateUrl: './post-works.component.html',
  styleUrls: ['./post-works.component.css']
})
export class PostWorksComponent implements OnInit {

  emailList;
  uploadready = false;
  email;
  allusers;
  upl = [];
  filesToUpload = [];
  options;
  message;
  messageClass;
  foundLicence = false;
  processing = false;
  licence;
  currentUrl;
  licencePosts;
  enabledComments = [];
  username;
  role;
  randomKey;
  links = [];
  constructor(
    private licenceService: LicenceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location,
    private http: Http
  ) { }

  // Function to delete licences
  uploadPostWorks() {
    this.getNewNotification();
    this.UploadEmailNote();
    this.upload();
    this.processing = true;
    const uploadData = {
      id: this.currentUrl.id,
      pathPost: this.upl
    };
    // Function for DELETE request
    this.licenceService.uploadPostWorks(uploadData).subscribe(data => {
      // Check if delete request worked
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error bootstrap class
        this.message = data.message; // Return error message
      } else {
        this.messageClass = 'alert alert-success'; // Return bootstrap success class
        this.message = data.message; // Return success message
        // After two second timeout, route to licence page
        setTimeout(() => {
          this.router.navigate(['/licence']); // Route users to licence page
        }, 2000);
      }
    });
  }
  getNewNotification() {
    const notification = {
      title: this.licence.title, // Title field
      createdBy: this.username, // CreatedBy field
      action: 'Uploaded post-works photos on:'
    };

    this.licenceService.newNotification(notification).subscribe(data => {
      // Check if licence was saved to database or not

    });
  }

  getAllLicences() {
    // Function to GET all licences from database
    this.licenceService.getAllLicences().subscribe(data => {
      this.licencePosts = data.licences; // Assign array to use in HTML
    });
  }
    expand(id) {
      this.enabledComments.push(id); // Add the current licence post id to array
    }

    // Collapse the list of comments
    collapse(id) {
      const index = this.enabledComments.indexOf(id); // Get position of id in array
      this.enabledComments.splice(index, 1); // Remove id from array
    }
    goBack() {
      this.location.back();
    }

    createAuthenticationHeaders() {
      this.licenceService.createAuthenticationHeaders();
    }


    upload() {

        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;

        for (let i = 0; i < files.length; i++) {
          if (files[i].type === 'application/pdf' || files[i].type === 'image/jpeg' ||
          files[i].type === 'image/jpg' || files[i].type === 'image/png') {
            const newfilename = this.randomKey + '-' + files[i]['name'];
            formData.append('uploads[]', files[i], newfilename);
          }
            this.createAuthenticationHeaders();
           this.http.post('https://us-central1-upload-rnce.cloudfunctions.net/uploadFile', formData,  this.options )
            .map(files => files).subscribe();
        }
        }


  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  this.upl = [];
  this.uploadready = true;
    for (let i = 0; i < this.filesToUpload.length; i++) {
      if (this.filesToUpload[i].type === 'application/pdf' ||
      this.filesToUpload[i].type === 'image/jpeg' || this.filesToUpload[i].type === 'image/jpg' ||
       this.filesToUpload[i].type === 'image/png') {
        this.upl.push(this.randomKey + '-' + this.filesToUpload[i]['name']);
  }
    }
  }
  getEmailListComm() {

    this.emailList = [];
    for (let i = 0 ; i < this.allusers.length; i++) {
      if ((this.allusers[i].role === 'TMP' && this.allusers[i].email !== this.email) ||
      (this.allusers[i].email === this.licence.createdBy && this.allusers[i].email !== this.email) ||
       (this.allusers[i].role === 'HS' && this.allusers[i].email !== this.email)) {
      this.emailList.push(this.allusers[i].email);
    }
      }

  }

  getAllUsers() {
    // Function to GET all licences from database
    this.licenceService.getAllUsers().subscribe(data => {
      this.allusers = data.users; // Assign array to use in HTML

    });
  }

  UploadEmailNote() {
    this.getEmailListComm();
    for (let i = 0; i < this.upl.length; i++) {

      this.links.push('<a  href="https://firebasestorage.googleapis.com/v0/b/upload-rnce.appspot.com/o/' +
      this.upl[i] + '?alt=media">' + this.upl[i] + '</a><br />');
    }
    const newEmail = {
      to: this.emailList.toString(), // Title field
      html: '<h2>Post Works Photos Uploaded on </h2><br /> ' + ' Title: <strong>' +
      this.licence.title + '</strong><br />' + 'Job No: ' + '<strong>' + this.licence.LicenceType +
      '</strong>' + '</strong><br />' + 'Photos Uploaded By: ' + '<strong>' + this.username + '</strong>' + 'Files: ' + '<strong>' +
      this.links + '</strong>', // CreatedBy field
    };

    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not

    });
  }


  ngOnInit() {
    this.randomKey = Math.random().toString(36).substring(2, 10);
    this.getAllUsers();
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role = profile.user.role;
      this.email = profile.user.email;
    });
    this.getAllLicences();
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve licence
    if (this.currentUrl.id) {
      this.licenceService.getSingleLicence(this.currentUrl.id).subscribe(data => {
        // Check if request was successfull
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return bootstrap error class
          this.message = data.message; // Return error message
        } else {
          // Create the licence object to use in HTML
          this.licence = {
            title: data.licence.title,
            LicenceType: data.licence.LicenceType, // Set title
            body: data.licence.body, // Set body
            createdBy: data.licence.createdBy, // Set created_by field
            createdAt: data.licence.createdAt,
            close: data.licence.close // Set created_at field
          };
          this.foundLicence = true; // Displaly licence window
        }
      });
    }


  }

}
