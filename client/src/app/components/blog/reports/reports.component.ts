import { Component, OnInit, ViewChild } from '@angular/core';
import { Http ,RequestOptions, Headers} from '@angular/http';
import { forEach } from '@angular/router/src/utils/collection';
import { BlogService } from '../../../services/blog.service';
import { AuthService } from '../../../services/auth.service';



@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  messageClass;
  
  message;
  username;
  role;
  blogPosts;
  email;
  blogsReport=[];
  attachNo=0;
  commentss=[]
  blogreport
  blogsgot=[]
  

  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private http: Http,
    
            ) {}

  goBack() {
    window.location.reload();
  }

  // Function to get all blogs from the database
  getAllBlogs() {
    // Function to GET all blogs from database
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs;
      this.blogsReport=[];
      for(let i=0; i< this.blogPosts.length; i++){
        let JobNo = this.blogPosts[i].JobNo
        this.commentss=[]
        let createdBy = this.blogPosts[i].createdBy
        let client = this.blogPosts[i].Client
        let createdAt = this.blogPosts[i].createdAt
        for(let l=0; l< this.blogPosts[i].comments.length; l++){
            let commentator = this.blogPosts[i].comments[l].commentator
            let createdTime = this.blogPosts[i].comments[l].createdTime
            this.attachNo=0
            for(let k=0; k< this.blogPosts[i].comments[l].attachements.length; k++){
              
              if(JSON.stringify(this.blogPosts[i].comments[l].attachements[k]).includes('TMP')){
                this.attachNo++
                
              }
              
            }
            let attt = this.attachNo
              if(attt>0){
                this.commentss.push({commentator, createdTime, attt})
              }
          }
        
        let title = this.blogPosts[i].title
        let comment = this.commentss
        
     
  this.blogsReport.push({
    JobNo,
    title,
    client,
    createdBy,
    createdAt,
    comment
    })
}
      
    });
  }
 



 
  ngOnInit() {
    
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role= profile.user.role;
      this.email= profile.user.email // Used when creating new blog posts and comments
      
    });
    
    this.getAllBlogs(); // Get all blogs on component load
    
    
    
    
    
    
    
    

  }


}
