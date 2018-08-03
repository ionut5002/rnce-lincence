import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FlashMessagesService } from 'angular2-flash-messages';
import { LicenceService} from '../../services/licence.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
    licencePosts;
    licencequeue;
    role;

  constructor(
    public authService: AuthService,
    private router: Router,
    private flashMessagesService: FlashMessagesService,
    private licenceService: LicenceService
  ) {
    
   }

  // Function to logout user
  onLogoutClick() {
    this.authService.logout(); // Logout user
    this.flashMessagesService.show('You are logged out!', { cssClass: 'alert-info' }); // Set custom flash message
    this.router.navigate(['/']); // Navigate back to home page
    
  }
  getAllLicences() {
    if(this.authService.loggedIn()){
      this.licenceService.getAllLicences().subscribe(data => {
        this.licencePosts = data.licences;
        this.licencequeue=0
        for(let i=0; i<this.licencePosts.length; i++){
          if(this.licencePosts[i].phase1){
            this.licencequeue++
            
          }
        }
         // Assign array to use in HTML
      })
    }
    // Function to GET all licences from database
    
  }
  getProfile(){
    if(this.authService.loggedIn()){
      this.authService.getProfile().subscribe(profile => {
        this.role= profile.user.role;
        
      });
    }
  }
  
  reloadAuto(){
    setInterval(()=>{
      this.getAllLicences();
      this.getProfile()
       },30000); 
    }

  ngOnInit() {
    this.getProfile()
    this.getAllLicences()
    this.reloadAuto()
  }

}
