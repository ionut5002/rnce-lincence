
import { Component, OnInit, OnDestroy } from '@angular/core';
import { LicenceService } from '../../../services/licence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';
import { MatDialog } from '@angular/material';
import { UploadFilesComponent } from 'src/app/services/upload.component';
import * as firebase from 'firebase';
import { Subscription } from 'rxjs';
import { BlogService } from 'src/app/services/blog.service';

@Component({
  selector: 'app-post-works',
  templateUrl: './post-works.component.html',
  styleUrls: ['./post-works.component.css']
})
export class PostWorksComponent implements OnInit, OnDestroy {
  filesSubcription: Subscription;
  emailList;
  uploadready = false;
  email;
  allusers;
  upl = [];
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
    private dialog: MatDialog,
    private blogService : BlogService
  ) { }

  onUpload() {
    const dialogRef = this.dialog.open(UploadFilesComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(this.upl);
        this.uploadready = true;
      } else {
        const deleteFiles = this.upl
        this.uploadready = false;
        for(const delfile of deleteFiles){
          const ref = firebase.storage().ref()
          ref.child(`${delfile}`).delete();
        }
        this.upl =[]
      }
    });
  }
  // Function to delete licences
  uploadPostWorks() {
    this.getNewNotification();
    this.UploadEmailNote();
    
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
    this.filesSubcription = this.blogService.filenames.subscribe(uploads =>{
      this.upl = uploads;
    })
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
  ngOnDestroy (){
    this.filesSubcription.unsubscribe();
  }


}
