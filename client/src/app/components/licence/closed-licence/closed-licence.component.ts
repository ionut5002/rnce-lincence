import { Component, OnInit } from '@angular/core';
import { LicenceService } from '../../../services/licence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-closed-licence',
  templateUrl: './closed-licence.component.html',
  styleUrls: ['./closed-licence.component.css']
})
export class ClosedLicenceComponent implements OnInit {

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
    private authService:AuthService,
    private location:Location
  ) { }

  // Function to delete licences
  closedLicence() {
    this.processing=true;
    // Function for DELETE request
    this.licenceService.closeLicence(this.currentUrl.id).subscribe(data => {
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

  getAllLicences() {
    // Function to GET all licences from database
    this.licenceService.getAllLicences().subscribe(data => {
      this.licencePosts = data.licences; // Assign array to use in HTML
      
    });}
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

  ngOnInit() {
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role= profile.user.role;
    });
    this.getAllLicences();
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve licence
    if(this.currentUrl.id){
      this.licenceService.getSingleLicence(this.currentUrl.id).subscribe(data => {
        // Check if request was successfull
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return bootstrap error class
          this.message = data.message; // Return error message
        } else {
          // Create the licence object to use in HTML
          this.licence = {
            title: data.licence.title, // Set title
            body: data.licence.body, // Set body
            createdBy: data.licence.createdBy, // Set created_by field
            createdAt: data.licence.createdAt,
            close: data.licence.close // Set created_at field
          }
          this.foundLicence = true; // Displaly licence window
        }
      });
    }
    
    
  }
}
