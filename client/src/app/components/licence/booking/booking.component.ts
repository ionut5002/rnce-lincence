
import { Component, OnInit } from '@angular/core';
import { LicenceService } from '../../../services/licence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.css']
})
export class BookingComponent implements OnInit {
  emailList;
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
  constructor(
    private licenceService: LicenceService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private location: Location,

  ) { }

  // Function to delete licences
  BookWorksSubmit() {
    this.WorkEmailNote();
    this.processing = true; // Lock form fields
    // Function to send licence object to backend
    this.licenceService.bookWorks(this.licence).subscribe(data => {
      // Check if PUT request was a success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set error bootstrap class
        this.message = data.message; // Set error message
        this.processing = false; // Unlock form fields
      } else {
        this.messageClass = 'alert alert-success'; // Set success bootstrap class
        this.message = data.message; // Set success message
        // After two seconds, navigate back to licence page
        setTimeout(() => {
          this.getNewNotification();
          this.router.navigate(['/licence']); // Navigate back to route page
        }, 2000);
      }
    });
  }
  getNewNotification() {
    const notification = {
      title: this.licence.title, // Title field
      createdBy: this.username, // CreatedBy field
      action: 'Booked works on:'
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


    goBack() {
      this.location.back();
    }

    createAuthenticationHeaders() {
      this.licenceService.createAuthenticationHeaders();
    }



  getEmailListComm() {

    this.emailList = [];
    for (let i = 0; i < this.allusers.length; i++) {
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

  WorkEmailNote() {
    this.getEmailListComm();

    const newEmail = {
      to: this.emailList.toString(), // Title field
      html: '<h2>Works Dates Booked on </h2><br /> ' + ' Title: <strong>' +
      this.licence.title + '</strong><br />' + 'Job No: ' + '<strong>' + this.licence.LicenceType +
      '</strong>' + '</strong><br />' + 'Process started by: ' + '<strong>' + this.username + '</strong>', // CreatedBy field
    };

    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not

    });
  }


  ngOnInit() {
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
            _id: data.licence._id,
            title: data.licence.title,
            LicenceType: data.licence.LicenceType, // Set title
            body: data.licence.body, // Set body
            createdBy: data.licence.createdBy, // Set created_by field
            createdAt: data.licence.createdAt,
            close: data.licence.close,
            WorksStartDate: data.licence.WorksStartDate,
            WorksEndDate: data.licence.WorksEndDate // Set created_at field
          };
          this.foundLicence = true; // Displaly licence window
        }
      });
    }


  }

}
