import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { LicenceService } from '../../services/licence.service';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Http ,RequestOptions, Headers} from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-licence',
  templateUrl: './licence.component.html',
  styleUrls: ['./licence.component.css']
})

export class LicenceComponent implements OnInit {
  
  licenceCr;
  t2class = 'alert alert-info';
  t3class = 'alert alert-info';
  t4class = 'alert alert-info';
  messageClass;
  message;
  newPost = false;
  loadingLicences = false;
  form;
  commentForm;
  processing = false;
  username;
  role;
  licencePosts;
  allusers;
  emailList=[];
  newComment = [];
  enabledComments = [];
  listing;
  filesToUpload=[];
   upl = [];
   options;
   Notifications;
   licenceT;
   licenceJ;
   co=0;
   LocationMap;
   location;
   licenceC;
   creatorEmail;
   email;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private licenceService: LicenceService,
    private http: Http
  ) {

    this.createNewLicenceForm(); // Create new licence form on start up
    this.createCommentForm(); // Create form for posting comments on a user's licence post
  }

  // Function to create new licence form
  createNewLicenceForm() {
    this.form = this.formBuilder.group({
      // Title field
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      // Body field
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],
      path: [],
      Client: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(3),
        this.alphaNumericValidation
      ])],
      StartDate : [],
      WorkWidth: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(1),
        this.NumericValidation
      ])],
      WorkLength: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(4),
        Validators.minLength(1),
        this.NumericValidation
      ])],
      Address: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ])],
      LicenceType:['',Validators.compose([
        Validators.required
      ])],
      TMType:['',Validators.compose([
        Validators.required
      ])]
    })
  }

  // Create form for posting comments
  createCommentForm() {
    this.commentForm = this.formBuilder.group({
      comment: ['', Validators.compose([
        Validators.required,
        Validators.minLength(1),
        Validators.maxLength(200)
      ])],
      attachements: []
      
    })
  }

  // Enable the comment form
  enableCommentForm() {
    this.commentForm.get('comment').enable(); // Enable comment field
  }

  // Disable the comment form
  disableCommentForm() {
    this.commentForm.get('comment').disable(); // Disable comment field
  }

  // Enable new Licence form
  enableFormNewLicenceForm() {
    this.form.get('title').enable(); // Enable title field
    this.form.get('body').enable();
    this.form.get('Client').enable();
    this.form.get('StartDate').enable();
    this.form.get('TMType').enable();
    this.form.get('Address').enable();
    this.form.get('WorkWidth').enable();
    this.form.get('WorkLength').enable();
    this.form.get('LicenceType').enable();
    
    
    
  }

  // Disable new Licence form
  disableFormNewLicenceForm() {
    this.form.get('title').disable(); // Enable title field
    this.form.get('body').disable();
    this.form.get('Client').disable();
    this.form.get('StartDate').disable();
    this.form.get('TMType').disable();
    this.form.get('Address').disable();
    this.form.get('WorkWidth').disable();
    this.form.get('WorkLength').disable();
    this.form.get('LicenceType').disable();
     // Disable body field
  }

  // Validation for title
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^[a-zA-Z0-9 ]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'alphaNumericValidation': true } // Return error in validation
    }
  }
  NumericValidation(controls) {
    const regExp = new RegExp(/^\d*\.?\d*$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'NumericValidation': true } // Return error in validation
    }
  }
  NumericValidation2(controls) {
    const regExp = new RegExp(/^[0-9]+$/); // Regular expression to perform test
    // Check if test returns false or true
    if (regExp.test(controls.value)) {
      return null; // Return valid
    } else {
      return { 'NumericValidation2': true } // Return error in validation
    }
  }

  // Function to display new Licence form
  newLicenceForm() {
    this.newPost = true; // Show new Licence form
    this.getEmailList()
  }

  // Reload Licences on current page
  reloadLicences() {
    this.loadingLicences = true; // Used to lock button
    this.getAllLicences();
    this.getAllNotifications(); // Add any new Licences to the page
    setTimeout(() => {
      this.loadingLicences = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to post a new comment on Licence post
  draftComment(id) {
    this.upl=[]
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
    this.licenceService.getSingleLicence(id).subscribe(data =>{
      this.licenceT = data.licence.title;
      this.licenceC = data.licence.createdBy;
      this.licenceJ = data.licence.LicenceType;
      this.licenceService.getSingleUser(this.licenceC).subscribe(data=>{
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return error class
          this.message = data.message; // Return error message
        } else {
          this.messageClass = 'alert alert-success'; // Return success class
          this.message = data.message; // Return success message
        this.creatorEmail=data.user.email;
        this.getEmailListComm()
        }
      })
      
      
   });
  }

 

  // Function to cancel new post transaction
  cancelSubmission(id) {
    this.filesToUpload=[]
    this.upl=[]
    const index = this.newComment.indexOf(id); // Check the index of the licence post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }

  // Function to submit a new licence post
  onLicenceSubmit() {
    this.upload();
    this.processing = true; // Disable submit button
    this.disableFormNewLicenceForm(); // Lock form

    // Create Licence object from form fields
    const licence = {
      title: this.form.get('title').value,
      body: this.form.get('body').value,
      Client:this.form.get('Client').value,
      StartDate:this.form.get('StartDate').value,
      Address:this.form.get('Address').value,
      LicenceType:this.form.get('LicenceType').value,
      WorkWidth:this.form.get('WorkWidth').value,
      WorkLength:this.form.get('WorkLength').value,
      TMType: this.form.get('TMType').value,
      path:this.upl,
      createdBy: this.username // CreatedBy field
    }
  

    // Function to save licence into database
    this.licenceService.newLicence(licence).subscribe(data => {
      // Check if licence was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewLicenceForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getNewNotification();
        this.newEmailNote()

        

        // Clear form data after two seconds
        setTimeout(() => {
          this.getAllLicences();
        this.getAllNotifications();
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewLicenceForm(); // Enable the form fields
        }, 4000);
      }
    });
  }

  getNewNotification(){
    const notification = {
      title: this.form.get('title').value, // Title field
      createdBy: this.username // CreatedBy field
    }
    this.licenceService.newNotification(notification).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }
/*   getNewNotificationComment(){
  
  } */
  seenNotification(id){
    this.licenceService.seenNotification(id).subscribe(data =>{
      this.getAllNotifications();
    })
  }
  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to get all licences from the database
  getAllLicences() {
    // Function to GET all licences from database
    this.licenceService.getAllLicences().subscribe(data => {
      this.licencePosts = data.licences; // Assign array to use in HTML
    });
  }
  getAllNotifications() {
    // Function to GET all licences from database
    this.licenceService.getAllNotifications().subscribe(data => {
      this.Notifications = data.notifications;
      this.co=0;
      for(var i=0; i < this.Notifications.length; i++) {
        if(!this.Notifications[i].seen.includes(this.username) && !this.Notifications[i].author.includes(this.username)){
          
            this.co++;
            
          
          
        }
      }

      
    
    });
  }
  

  // Function to like a licence post
  likeLicence(id) {
    // Service to like a licence post
    this.licenceService.likeLicence(id).subscribe(data => {
      this.getAllLicences(); // Refresh licences after like
    });
  }

  // Function to disliked a licence post
  dislikeLicence(id) {
    // Service to dislike a licence post
    this.licenceService.dislikeLicence(id).subscribe(data => {
      this.getAllLicences(); // Refresh licences after dislike
    });
  }

  // Function to post a new comment
  postComment(id) {
    this.CommEmailNote()
    const notification = {
      title: this.licenceT, // Title field
      createdBy: this.username // CreatedBy field
    }
    
    this.licenceService.newNotification(notification).subscribe(data => {
      // Check if licence was saved to database or not
    });
    this.upload();
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    const attachements=this.upl;
    
    // Function to save the comment to the database
    this.licenceService.postComment(id, comment, attachements).subscribe(data => {
      this.getAllLicences(); // Refresh all licences to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the licence id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset();// Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current licence post id to array
  }

  // Collapse the list of comments
  collapse(id) {
    const index = this.enabledComments.indexOf(id); // Get position of id in array
    this.enabledComments.splice(index, 1); // Remove id from array
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
reloadAuto(){
  setInterval(()=>{
    this.getAllLicences();
    this.getAllNotifications(); },300000); 
  }

  getGeolocation(){
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(position => {
        this.location = position.coords;
        this.LocationMap = this.location.latitude+', '+this.location.longitude;
        
         
      });
   }
  }

/*   email notifications */

getAllUsers() {
  // Function to GET all licences from database
  this.licenceService.getAllUsers().subscribe(data => {
    this.allusers = data.users; // Assign array to use in HTML
    
  });
}

  getEmailList(){
    
    this.emailList=[]
    for(let i =0; i < this.allusers.length; i++){
      if((this.allusers[i].role === "TMP" && this.allusers[i].email !== this.email) || (this.allusers[i].role === "HS" && this.allusers[i].email !== this.email)){
      this.emailList.push(this.allusers[i].email)}
      }
      /* console.log(this.emailList.toString()) */
  }

  getEmailListComm(){
    
    this.emailList=[]
    for(let i =0; i < this.allusers.length; i++){
      if((this.allusers[i].role === "TMP" && this.allusers[i].email !== this.email) || (this.allusers[i].email === this.creatorEmail && this.allusers[i].email !== this.email) || (this.allusers[i].role === "HS" && this.allusers[i].email !== this.email)){
      this.emailList.push(this.allusers[i].email)}
      }
      
  }

  
  newEmailNote(){
   
    const newEmail = {
      to: this.emailList.toString(), // Title field
      html:'<h2>New Licence</h2><br /> '+ ' Title: <strong>' +this.form.get('title').value +'</strong><br />' +'Licence Type: ' +'<strong>' + this.form.get('LicenceType').value+'</strong>'+'</strong><br />' +'Start Date: ' +'<strong>' + this.form.get('StartDate').value+'</strong>', // CreatedBy field
    }
    
    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }

  CommEmailNote(){
    
    const newEmail = {
      to: this.emailList.toString(),// Title field
      html:'<h2>New Changes on</h2><br /> '+ ' Title: <strong>' +this.licenceT +'</strong><br />' +'Job No: ' +'<strong>' + this.licenceJ+'</strong>'+'</strong><br />' +'Added by: ' +'<strong>' + this.username+'</strong>', // CreatedBy field
    }
    
    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }
  ApplyingEmailNote(){
    
    const newEmail = {
      to: this.emailList.toString(),// Title field
      html:'<h2>Applying Process started on</h2><br /> '+ ' Title: <strong>' +this.licenceT +'</strong><br />' +'Job No: ' +'<strong>' + this.licenceJ+'</strong>'+'</strong><br />' +'Process started by: ' +'<strong>' + this.username+'</strong>', // CreatedBy field
    }
    
    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }
  CompleteEmailNote(){
    
    const newEmail = {
      to: this.emailList.toString(),// Title field
      html:'<h2>Works completed on</h2><br /> '+ ' Title: <strong>' +this.licenceT +'</strong><br />' +'Job No: ' +'<strong>' + this.licenceJ+'</strong>'+'</strong><br />' +'Process started by: ' +'<strong>' + this.username+'</strong>', // CreatedBy field
    }
    
    this.licenceService.newEmailNot(newEmail).subscribe(data => {
      // Check if licence was saved to database or not
      
    });
  }

  ApplyingForLicence(id) {
    this.licenceT='';
    this.licenceJ='';
    this.licenceService.getSingleLicence(id).subscribe(data =>{
      this.licenceT = data.licence.title;
      this.licenceJ = data.licence.LicenceType;
      this.licenceCr = data.licence.createdBy;
      this.licenceService.getSingleUser(this.licenceCr).subscribe(data=>{
        if (!data.success) {
          this.messageClass = 'alert alert-danger'; // Return error class
          this.message = data.message; // Return error message
        } else {
          this.messageClass = 'alert alert-success'; // Return success class
          this.message = data.message; // Return success message
        this.creatorEmail=data.user.email;
        this.getEmailListComm()
        this.ApplyingEmailNote();
        }
      })
    
      
    })
    // Service to like a licence post
    this.licenceService.ApplyingForLicence(id).subscribe(data => {
      this.getAllLicences(); // Refresh licences after like
    });
  }
  CompleteWorks(id) {
    this.licenceT='';
    this.licenceJ='';
    this.licenceService.getSingleLicence(id).subscribe(data =>{
      this.licenceT = data.licence.title;
      this.licenceJ = data.licence.LicenceType;
      this.getEmailListComm()
      this.CompleteEmailNote();
    })
    // Service to like a licence post
    this.licenceService.CompleteWorks(id).subscribe(data => {
      this.getAllLicences(); // Refresh licences after like
    });
  }

  classt2(){
    this.t2class='alert alert-success';
    this.t3class='alert alert-info';
    this.t4class='alert alert-info';

  }
  classt3(){
    this.t2class='alert alert-info';
    this.t3class='alert alert-success';
    this.t4class='alert alert-info';

  }
  classt4(){
    this.t2class='alert alert-info';
    this.t3class='alert alert-info';
    this.t4class='alert alert-danger';

  }
  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role= profile.user.role;
      this.email= profile.user.email // Used when creating new licence posts and comments
      
    });
    this.reloadAuto();
    this.getAllLicences(); // Get all licences on component load
    this.getAllNotifications();
    this.getAllUsers()
    
    
    

  }


}
