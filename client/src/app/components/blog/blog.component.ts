import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import {  FileUploader } from 'ng2-file-upload/ng2-file-upload';
import { Http ,RequestOptions, Headers} from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';
import {SearchFilterPipe} from '../../Pipes/search-filter.pipe';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']

})

export class BlogComponent implements OnInit {
  
  messageClass;
  
  message;
  newPost = false;
  loadingBlogs = false;
  form;
  commentForm;
  processing = false;
  username;
  role;
  blogPosts;
  allusers;
  emailList=[];
  newComment = [];
  enabledComments = [];
  listing;
  filesToUpload=[];
   upl = [];
   options;
   Notifications;
   blogT;
   blogJ;
   co=0;
   LocationMap;
   location;
   blogC;
   creatorEmail;
   email;
   randomKey;
   links = [];


  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private blogService: BlogService,
    private http: Http
  ) {

    this.createNewBlogForm(); // Create new job form on start up
    this.createCommentForm(); // Create form for posting comments on a user's job post
  }

  // Function to create new job form
  createNewBlogForm() {
    this.form = this.formBuilder.group({
      // Title field
      title: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
        Validators.minLength(5),
        this.alphaNumericValidation
      ])],
      // JobNo field
      JobNo: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(5),
        Validators.minLength(5),
        this.NumericValidation2
      ])],
      // Body field
      body: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(500),
        Validators.minLength(5)
      ])],
      // path field
      path: [],
      // Client field
      Client: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(25),
        Validators.minLength(3),
        this.alphaNumericValidation
      ])],
      // StartDate field
      StartDate : [],
      // SpeedOfRoad field
      SpeedOfRoad: [],
      // emergency field
      emergency: [],
      // SafetyFolder field
      SafetyFolder: [],
      // PSCS field
      PSCS: [],
      // PSDP field
      PSDP: [],
      // RoadWidth field
      RoadWidth: ['', Validators.compose([
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(1),
        this.NumericValidation
      ])],
      // CarriagewayType field
      CarriagewayType: [],
      // RoadLevel field
      RoadLevel: [],
      // Volume field
      Volume : ['',Validators.compose([
        Validators.required,
        Validators.maxLength(6),
        Validators.minLength(1),
        this.NumericValidation
      ])],
      // WorksType field
      WorksType : [],
      // WorksHours field
      WorksHours : [],
      // LocationOnRoad field
      LocationOnRoad : [],
      // TypeOfTrafficCR field
      TypeOfTrafficCR : [],
      // Address field
      Address: ['',Validators.compose([
        Validators.required,
        Validators.maxLength(200),
        Validators.minLength(10),
      ])],
      // LocationMap field
      LocationMap:[],
      // LicenceRequired field
      LicenceRequired:['',Validators.compose([
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

  // Enable new job form
  enableFormNewBlogForm() {
    this.form.get('title').enable(); 
    this.form.get('body').enable();
    this.form.get('JobNo').enable();
    this.form.get('Client').enable();
    this.form.get('StartDate').enable();
    this.form.get('SpeedOfRoad').enable();
    this.form.get('RoadWidth').enable();
    this.form.get('CarriagewayType').enable();
    this.form.get('RoadLevel').enable();
    this.form.get('Volume').enable();
    this.form.get('WorksType').enable();
    this.form.get('WorksHours').enable();
    this.form.get('LocationOnRoad').enable();
    this.form.get('TypeOfTrafficCR').enable();
    this.form.get('Address').enable();
    this.form.get('LicenceRequired').enable();
    this.form.get('emergency').enable(),
    this.form.get('SafetyFolder').enable(),
    this.form.get('PSCS').enable(),
    this.form.get('PSDP').enable()
  }

  // Disable new job form
  disableFormNewBlogForm() {
    this.form.get('title').disable(); 
    this.form.get('body').disable();
    this.form.get('JobNo').disable();
    this.form.get('Client').disable();
    this.form.get('StartDate').disable();
    this.form.get('SpeedOfRoad').disable();
    this.form.get('RoadWidth').disable();
    this.form.get('CarriagewayType').disable();
    this.form.get('RoadLevel').disable();
    this.form.get('Volume').disable();
    this.form.get('WorksType').disable();
    this.form.get('WorksHours').disable();
    this.form.get('LocationOnRoad').disable();
    this.form.get('TypeOfTrafficCR').disable();
    this.form.get('Address').disable();
    this.form.get('LicenceRequired').disable();
    this.form.get('emergency').disable(),
    this.form.get('SafetyFolder').disable(),
    this.form.get('PSCS').disable(),
    this.form.get('PSDP').disable()
  }

  // Validation for form
  alphaNumericValidation(controls) {
    const regExp = new RegExp(/^(?=.*[A-Z0-9])[\w.,!"'-\/$ ]+$/i); // Regular expression to perform test
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

  // Function to display new job form
  newBlogForm() {
    this.newPost = true; // Show new job form
    this.getEmailList()
    this.randomKey = Math.random().toString(36).substring(2, 10)
  }

  // Reload jobs on current page
  reloadBlogs() {
    this.loadingBlogs = true; // Used to lock button
    this.getAllBlogs();
    this.getAllNotifications(); // Add any new blogs to the page
    setTimeout(() => {
      this.loadingBlogs = false; // Release button lock after four seconds
    }, 4000);
  }

  // Function to post a new comment on job post
  draftComment(id) {
    this.randomKey = Math.random().toString(36).substring(2, 10)
    this.upl=[]
    this.commentForm.reset(); // Reset the comment form each time users starts a new comment
    this.newComment = []; // Clear array so only one post can be commented on at a time
    this.newComment.push(id); // Add the post that is being commented on to the array
    this.blogService.getSingleBlog(id).subscribe(data =>{
      this.blogT = data.blog.title;
      this.blogC = data.blog.createdBy;
      this.blogJ = data.blog.JobNo;
      this.blogService.getSingleUser(this.blogC).subscribe(data=>{
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
    const index = this.newComment.indexOf(id); // Check the index of the blog post in the array
    this.newComment.splice(index, 1); // Remove the id from the array to cancel post submission
    this.commentForm.reset(); // Reset  the form after cancellation
    this.enableCommentForm(); // Enable the form after cancellation
    this.processing = false; // Enable any buttons that were locked
  }

  // Function to submit a new job post
  onBlogSubmit() {
    this.upload();
    this.processing = true; // Disable submit button
    this.disableFormNewBlogForm(); // Lock form

    // Create job object from form fields
    const blog = {
      title: this.form.get('title').value,
      JobNo: this.form.get('JobNo').value, 
      body: this.form.get('body').value,
      Client:this.form.get('Client').value,
      StartDate:this.form.get('StartDate').value,
      SpeedOfRoad:this.form.get('SpeedOfRoad').value,
      RoadWidth:this.form.get('RoadWidth').value,
      CarriagewayType:this.form.get('CarriagewayType').value,
      RoadLevel:this.form.get('RoadLevel').value,
      Volume:this.form.get('Volume').value,
      WorksType:this.form.get('WorksType').value,
      WorksHours:this.form.get('WorksHours').value,
      LocationOnRoad:this.form.get('LocationOnRoad').value,
      TypeOfTrafficCR:this.form.get('TypeOfTrafficCR').value,
      Address:this.form.get('Address').value,
      LocationMap:this.LocationMap,
      LicenceRequired:this.form.get('LicenceRequired').value,
      emergency:this.form.get('emergency').value,
      SafetyFolder:this.form.get('SafetyFolder').value,
      PSCS:this.form.get('PSCS').value,
      PSDP:this.form.get('PSDP').value,
      path:this.upl,
      createdBy: this.username 
    }

    // Function to save job into database
    this.blogService.newBlog(blog).subscribe(data => {
      // Check if job was saved to database or not
      if (!data.success) {
        this.messageClass = 'alert alert-danger'; // Return error class
        this.message = data.message; // Return error message
        this.processing = false; // Enable submit button
        this.enableFormNewBlogForm(); // Enable form
      } else {
        this.messageClass = 'alert alert-success'; // Return success class
        this.message = data.message; // Return success message
        this.getNewNotification();
        this.newEmailNote()

        

        // Clear form data after two seconds
        setTimeout(() => {
          this.getAllBlogs();
        this.getAllNotifications();
          this.newPost = false; // Hide form
          this.processing = false; // Enable submit button
          this.message = false; // Erase error/success message
          this.form.reset(); // Reset all form fields
          this.enableFormNewBlogForm(); // Enable the form fields
        }, 4000);
      }
    });
  }

  getNewNotification(){
    const notification = {
      title: this.form.get('title').value, // Title field
      createdBy: this.username // CreatedBy field
    }
    this.blogService.newNotification(notification).subscribe(data => {
      // Check if blog was saved to database or not
      
    });
  }
/*   getNewNotificationComment(){
  
  } */
  seenNotification(id){
    this.blogService.seenNotification(id).subscribe(data =>{
      this.getAllNotifications();
    })
  }
  // Function to go back to previous page
  goBack() {
    window.location.reload(); // Clear all variable states
  }

  // Function to get all blogs from the database
  getAllBlogs() {
    // Function to GET all blogs from database
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs; // Assign array to use in HTML
    });
  }
  getAllNotifications() {
    // Function to GET all blogs from database
    this.blogService.getAllNotifications().subscribe(data => {
      this.Notifications = data.notifications;
      this.co=0;
      for(var i=0; i < this.Notifications.length; i++) {
        if(!this.Notifications[i].seen.includes(this.username) && !this.Notifications[i].author.includes(this.username)){
          
            this.co++;
            
          
          
        }
      }

      
    
    });
  }
  

  // Function to like a blog post
  likeBlog(id) {
    // Service to like a blog post
    this.blogService.likeBlog(id).subscribe(data => {
      this.getAllBlogs(); // Refresh blogs after like
    });
  }

  // Function to disliked a blog post
  dislikeBlog(id) {
    // Service to dislike a blog post
    this.blogService.dislikeBlog(id).subscribe(data => {
      this.getAllBlogs(); // Refresh blogs after dislike
    });
  }

  // Function to post a new comment
  postComment(id) {
    this.CommEmailNote()
    const notification = {
      title: this.blogT, // Title field
      createdBy: this.username // CreatedBy field
    }
    
    this.blogService.newNotification(notification).subscribe(data => {
      // Check if blog was saved to database or not
    });
    this.upload();
    this.disableCommentForm(); // Disable form while saving comment to database
    this.processing = true; // Lock buttons while saving comment to database
    const comment = this.commentForm.get('comment').value; // Get the comment value to pass to service function
    const attachements=this.upl;
    
    // Function to save the comment to the database
    this.blogService.postComment(id, comment, attachements).subscribe(data => {
      this.getAllBlogs(); // Refresh all blogs to reflect the new comment
      const index = this.newComment.indexOf(id); // Get the index of the blog id to remove from array
      this.newComment.splice(index, 1); // Remove id from the array
      this.enableCommentForm(); // Re-enable the form
      this.commentForm.reset();// Reset the comment form
      this.processing = false; // Unlock buttons on comment form
      if (this.enabledComments.indexOf(id) < 0) this.expand(id); // Expand comments for user on comment submission
    });
  }

  // Expand the list of comments
  expand(id) {
    this.enabledComments.push(id); // Add the current blog post id to array
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
          const newfilename = this.randomKey + '-' + files[i]['name']
          formData.append("uploads[]", files[i], newfilename);}
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
this.upl.push(this.randomKey + '-' + this.filesToUpload[i]['name'])
}
  }
}
reloadAuto(){
  setInterval(()=>{
    this.getAllBlogs();
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
  // Function to GET all blogs from database
  this.blogService.getAllUsers().subscribe(data => {
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
      /* console.log(this.emailList.toString()) */
  }

  
  newEmailNote(){
    
    const newEmail = {
      to: this.emailList.toString(), // Title field
      html:'<h2>New Job</h2><br /> '+ ' Title: <strong>' +this.form.get('title').value +'</strong><br />' +'Job No: ' +'<strong>' + this.form.get('JobNo').value+'</strong>'+'</strong><br />' +'Client: ' +'<strong>' + this.form.get('Client').value+'</strong>', // CreatedBy field
    }
    
    this.blogService.newEmailNot(newEmail).subscribe(data => {
      // Check if blog was saved to database or not
      
    });
  }

  CommEmailNote(){
    if(this.upl.length>0){
      
      for(let i =0; i < this.upl.length; i++){
        
        this.links.push('<a  href="https://firebasestorage.googleapis.com/v0/b/upload-rnce.appspot.com/o/'+this.upl[i]+'?alt=media">'+this.upl[i]+'</a><br />')
      }
      const newEmail = { 
      to: this.emailList.toString(),// Title field
      html:'<h2>New Files added on</h2><br /> '+ ' Title: <strong>' +this.blogT +'</strong><br />' +'Job No: ' +'<strong>' + this.blogJ+'</strong>'+'</strong><br />' +'Added by: ' +'<strong>' + this.username+'</strong><br />'+'Comment: '+ this.commentForm.get('comment').value +'</strong><br />' +'Files: ' +'<strong>' + 
       this.links +'</strong>', // CreatedBy field
    }
    this.blogService.newEmailNot(newEmail).subscribe(data => {
      // Check if blog was saved to database or not
      
    });
  }else{
      const newEmail = {
        to: this.emailList.toString(),// Title field
        html:'<h2>New Comments on</h2><br /> '+ ' Title: <strong>' +this.blogT +'</strong><br />' +'Job No: ' +'<strong>' + this.blogJ+'</strong>'+'</strong><br />' +'Added by: ' +'<strong>' + this.username +'</strong><br />'+'Comment: ' +'<strong>' + this.commentForm.get('comment').value +'</strong><br />', // CreatedBy field
      }
      this.blogService.newEmailNot(newEmail).subscribe(data => {
        // Check if blog was saved to database or not
        
      });
    }
    
    
    
  }

  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role= profile.user.role;
      this.email= profile.user.email // Used when creating new blog posts and comments
      
    });
    this.reloadAuto();
    this.getAllBlogs(); // Get all blogs on component load
    this.getAllNotifications();
    this.getAllUsers()
    
    
    

  }


}
