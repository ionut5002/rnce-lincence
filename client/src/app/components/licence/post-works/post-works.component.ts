import { Component, OnInit } from '@angular/core';
import { LicenceService } from '../../../services/licence.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { Location } from '@angular/common';
import { Http ,RequestOptions, Headers} from '@angular/http';

@Component({
  selector: 'app-post-works',
  templateUrl: './post-works.component.html',
  styleUrls: ['./post-works.component.css']
})
export class PostWorksComponent implements OnInit {

  emailList;
  email;
  allusers;
  upl=[];
  filesToUpload=[];
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
    private authService:AuthService,
    private location:Location,
    private http:Http
  ) { }

  // Function to delete licences
  uploadPostWorks() {
    this.UploadEmailNote()
    this.upload()
    this.processing=true;
    const uploadData ={
      id: this.currentUrl.id,
      pathPost: this.upl
    }
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
    
    createAuthenticationHeaders() {
      this.authService.loadToken(); // Get token so it can be attached to headers
      // Headers configuration options
      this.options = new RequestOptions({
        headers: new Headers({
          //'Content-Type': 'application/json', // Format set to JSON
          'authorization': this.authService.authToken // Attach token
        })
      });
    }
    
    
    upload() {
    
        const formData: any = new FormData();
        const files: Array<File> = this.filesToUpload;
    
        for(let i =0; i < files.length; i++){
          if(files[i].type=='application/pdf' || files[i].type=='image/jpeg' || files[i].type=='image/jpg' || files[i].type=='image/png'){
            formData.append("uploads[]", files[i], files[i]['name']);}
            this.createAuthenticationHeaders();
           this.http.post("https://us-central1-upload-rnce.cloudfunctions.net/uploadFile", formData,  this.options )
            .map(files => files).subscribe()
        } 
        }
  
   
  fileChangeEvent(fileInput: any) {
    this.filesToUpload = <Array<File>>fileInput.target.files;
  this.upl=[];
    for(let i =0; i < this.filesToUpload.length; i++){
      if(this.filesToUpload[i].type=='application/pdf' || this.filesToUpload[i].type=='image/jpeg' || this.filesToUpload[i].type=='image/jpg' || this.filesToUpload[i].type=='image/png'){
  this.upl.push(this.filesToUpload[i]['name'])
  }
    }
  }
  getEmailListComm(){
    
    this.emailList=[]
    for(let i =0; i < this.allusers.length; i++){
      if((this.allusers[i].role === "TMP" && this.allusers[i].email !== this.email) || (this.allusers[i].email === this.licence.createdBy && this.allusers[i].email !== this.email)|| (this.allusers[i].role === "HS" && this.allusers[i].email !== this.email)){
      this.emailList.push(this.allusers[i].email)}
      }
    
  }

  getAllUsers() {
    // Function to GET all licences from database
    this.licenceService.getAllUsers().subscribe(data => {
      this.allusers = data.users; // Assign array to use in HTML
      
    });
  }

  UploadEmailNote(){
    this.getEmailListComm()
    
    const newEmail = {
      to: this.emailList.toString(),// Title field
      html:'<h2>Post Works Photos Uploaded on </h2><br /> '+ ' Title: <strong>' +this.licence.title +'</strong><br />' +'Job No: ' +'<strong>' + this.licence.LicenceType+'</strong>'+'</strong><br />' +'Process started by: ' +'<strong>' + this.username+'</strong>', // CreatedBy field
    }
    
    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }
  

  ngOnInit() {
    this.getAllUsers() 
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role= profile.user.role;
      this.email = profile.user.email
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
            title: data.licence.title,
            LicenceType: data.licence.LicenceType, // Set title
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
