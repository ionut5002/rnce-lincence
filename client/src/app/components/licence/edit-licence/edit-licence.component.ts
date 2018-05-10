import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { LicenceService } from '../../../services/licence.service';



@Component({
  selector: 'app-edit-licence',
  templateUrl: './edit-licence.component.html',
  styleUrls: ['./edit-licence.component.css']
})
export class EditLicenceComponent implements OnInit {

  message;
  messageClass;
  licence;
  processing = false;
  currentUrl;
  loading = true;
  LocationMap;
   locations;
   allusers;
   emailList=[]

  constructor(
    private location: Location,
    private activatedRoute: ActivatedRoute,
    private licenceService: LicenceService,
    private router: Router,
   
  ) { }

  // Function to Submit Update
  updateLicenceSubmit() {
    this.newEmailNote()
    this.processing = true; // Lock form fields
    // Function to send licence object to backend
    this.licenceService.editLicence(this.licence).subscribe(data => {
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
  getNewNotification(){
    const notification = {
      title: this.licence.title, // Title field
      createdBy: this.licence.createdBy // CreatedBy field
    }
    
    this.licenceService.newNotification(notification).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }

  // Function to go back to previous page
  goBack() {
    this.location.back();
  }
 


  /* email notification */



  getAllUsers() {
    // Function to GET all licences from database
    this.licenceService.getAllUsers().subscribe(data => {
      this.allusers = data.users; // Assign array to use in HTML
      this.getEmailList()
    });
  }
  
    getEmailList(){
      for(let i =0; i < this.allusers.length; i++){
        if(this.allusers[i].role === "TMP"){
        this.emailList.push(this.allusers[i].email)}
        }
        
    }
    newEmailNote(){
      if(this.emailList==[]){
      const newEmail = {
        to: this.emailList.toString(), // Title field
        html:'<h2>New Edit on Job</h2><br /> '+ ' Title: <strong>' + this.licence.title +'</strong><br />' +'Job No: ' +'<strong>' + this.licence.JobNo+'</strong>'+'</strong><br />' +'By: ' +'<strong>' + this.licence.createdBy+'</strong>', // CreatedBy field
      }
      
      this.licenceService.newEmailNot(newEmail).subscribe(data => {
        // Check if licence was saved to database or not
        
      });}
    }

  ngOnInit() {
    this.getAllUsers()
    this.currentUrl = this.activatedRoute.snapshot.params; // When component loads, grab the id
    // Function to GET current licence with id in params
    this.licenceService.getSingleLicence(this.currentUrl.id).subscribe(data => {
      // Check if GET request was success or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Set bootstrap error class
        this.message = data.message; // Set error message
      } else {
        this.licence = data.licence; // Save licence object for use in HTML
        this.loading = false; // Allow loading of licence form
      }
    });

  }

}
