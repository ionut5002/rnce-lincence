import { Component, OnInit } from '@angular/core';
import { LicenceService } from '../../../services/licence.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-delete-licence',
  templateUrl: './delete-licence.component.html',
  styleUrls: ['./delete-licence.component.css']
})
export class DeleteLicenceComponent implements OnInit {
  message;
  messageClass;
  foundLicence = false;
  processing = false;
  licence;
  currentUrl;

  constructor(
    private licenceService: LicenceService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  // Function to delete licences
  deleteLicence() {
    this.processing = true; // Disable buttons
    // Function for DELETE request
    this.licenceService.deleteLicence(this.currentUrl.id).subscribe(data => {
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

  ngOnInit() {
    this.currentUrl = this.activatedRoute.snapshot.params; // Get URL paramaters on page load
    // Function for GET request to retrieve licence
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
          createdAt: data.licence.createdAt // Set created_at field
        };
        this.foundLicence = true; // Displaly licence window
      }
    });
  }

}
