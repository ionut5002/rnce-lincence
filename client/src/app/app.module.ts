import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {MatButtonModule, 
        MatIconModule, 
        MatBadgeModule,
        MatFormFieldModule,
        MatInputModule,
        MatDialogModule,
        MatProgressBarModule} from '@angular/material';
import { AngularFireModule } from '@angular/fire';
import { AngularFireStorageModule } from '@angular/fire/storage';


import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavbarComponent } from './components/navbar/navbar.component';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { ClosedBlogComponent } from './components/blog/closed-blog/closed-blog.component';
import { LicenceComponent } from './components/licence/licence.component';
import { EditLicenceComponent } from './components/licence/edit-licence/edit-licence.component';
import { DeleteLicenceComponent } from './components/licence/delete-licence/delete-licence.component';
import { ClosedLicenceComponent } from './components/licence/closed-licence/closed-licence.component';
import { UploadLicenceComponent } from './components/licence/upload-licence/upload-licence.component';
import { BookingComponent } from './components/licence/booking/booking.component';
import { PostWorksComponent } from './components/licence/post-works/post-works.component';
import { SearchFilterPipe } from './search-filter.pipe';
import { DisplayComponent } from './components/display/display.component';
import { ReportsComponent } from './components/blog/reports/reports.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { BlogService } from './services/blog.service';
import { LicenceService } from './services/licence.service';
import { ScrollToModule } from 'ng2-scroll-to-el';
import { FlashMessagesModule } from 'angular2-flash-messages';
import { configFB } from 'src/environments/environment.prod';
import { UploadFilesComponent } from './services/upload.component';



@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    HomeComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    ProfileComponent,
    BlogComponent,
    EditBlogComponent,
    DeleteBlogComponent,
    PublicProfileComponent,
    ClosedBlogComponent,
    LicenceComponent,
    EditLicenceComponent,
    DeleteLicenceComponent,
    ClosedLicenceComponent,
    UploadLicenceComponent,
    BookingComponent,
    PostWorksComponent,
    SearchFilterPipe,
    DisplayComponent,
    ReportsComponent,
    UploadFilesComponent
  ],
  imports: [
    BrowserModule,
    HttpModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    AppRoutingModule,
    FlashMessagesModule.forRoot(),
    ScrollToModule.forRoot(),
    MatButtonModule,
    MatIconModule,
    MatBadgeModule,
    MatFormFieldModule,
    MatInputModule,
    AngularFireModule.initializeApp(configFB),
    AngularFireStorageModule,
    MatDialogModule,
    MatProgressBarModule
    
  ],
  providers: [AuthService, AuthGuard, NotAuthGuard, BlogService, LicenceService],
  bootstrap: [AppComponent],
  entryComponents: [UploadFilesComponent]
})
export class AppModule { }
