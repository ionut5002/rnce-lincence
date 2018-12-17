
import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { BlogService } from '../../services/blog.service';
import { ScrollToService } from 'ng2-scroll-to-el';

@Component({
  selector: 'app-display',
  templateUrl: './display.component.html',
  styleUrls: ['./display.component.css']

})

export class DisplayComponent implements OnInit {
  messageClass;
  message;
  username;
  role;
  blogPosts;
  email;


  constructor(
    private authService: AuthService,
    private blogService: BlogService,
    private scrollService: ScrollToService
            ) {}

  goBack() {
    window.location.reload();
  }

  // Function to get all blogs from the database
  getAllBlogs() {
    // Function to GET all blogs from database
    this.blogService.getAllBlogs().subscribe(data => {
      this.blogPosts = data.blogs; // Assign array to use in HTML
    });
  }
reloadAuto() {
  setInterval(() => {
    this.getAllBlogs(); }, 200000);
  }


  scrollToTop(element) {
    this.scrollService.scrollTo(element, 1000);
}
scrollToBottom(element) {
  this.scrollService.scrollTo(element, 50000);
}




  ngOnInit() {
    // Get profile username on page load
    this.authService.getProfile().subscribe(profile => {
      this.username = profile.user.username;
      this.role = profile.user.role;
      this.email = profile.user.email; // Used when creating new blog posts and comments
    });
    this.reloadAuto();
    this.getAllBlogs(); // Get all blogs on component load
    setInterval(() => {
      this.scrollToBottom('#bottom');
      setTimeout(() => {
        this.scrollToTop('#top') ;
      }, 50000);
    }, 104000);

  }


}
