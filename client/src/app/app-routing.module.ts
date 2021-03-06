import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { HomeComponent } from './components/home/home.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { RegisterComponent } from './components/register/register.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { PublicProfileComponent } from './components/public-profile/public-profile.component';
import { BlogComponent } from './components/blog/blog.component';
import { EditBlogComponent } from './components/blog/edit-blog/edit-blog.component';
import { DeleteBlogComponent } from './components/blog/delete-blog/delete-blog.component';
import { AuthGuard } from './guards/auth.guard';
import { NotAuthGuard } from './guards/notAuth.guard';
import { ClosedBlogComponent } from './components/blog/closed-blog/closed-blog.component';
import { ClosedLicenceComponent } from './components/licence/closed-licence/closed-licence.component';
import { LicenceComponent } from './components/licence/licence.component';
import { EditLicenceComponent } from './components/licence/edit-licence/edit-licence.component';
import { DeleteLicenceComponent } from './components/licence/delete-licence/delete-licence.component';
import { UploadLicenceComponent } from './components/licence/upload-licence/upload-licence.component';
import { BookingComponent } from './components/licence/booking/booking.component';
import { PostWorksComponent } from './components/licence/post-works/post-works.component';
import { DisplayComponent } from './components/display/display.component';
import { ReportsComponent } from './components/blog/reports/reports.component';


// Our Array of Angular 2 Routes
const appRoutes: Routes = [
  {
    path: '',
    component: HomeComponent // Default Route
  },
  {
    path: 'dashboard',
    component: DashboardComponent, // Dashboard Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'register',
    component: RegisterComponent, // Register Route
    canActivate: [AuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'login',
    component: LoginComponent, // Login Route
    canActivate: [NotAuthGuard] // User must NOT be logged in to view this route
  },
  {
    path: 'profile',
    component: ProfileComponent, // Profile Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'display',
    component: DisplayComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'blog',
    component: BlogComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'closed-blog/:id',
    component: ClosedBlogComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'closed-blog',
    component: ClosedBlogComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'edit-blog/:id',
    component: EditBlogComponent, // Edit Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-blog/:id',
    component: DeleteBlogComponent, // Delete Blog Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'Reports-Jobs',
    component: ReportsComponent, // Blog Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'licence',
    component: LicenceComponent, // Licence Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'closed-licence/:id',
    component: ClosedLicenceComponent, // Licence Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'closed-licence',
    component: ClosedLicenceComponent, // Licence Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'upload-licence/:id',
    component: UploadLicenceComponent, // Licence Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'post-works/:id',
    component: PostWorksComponent, // Licence Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'book-works/:id',
    component: BookingComponent, // Licence Route,
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'edit-licence/:id',
    component: EditLicenceComponent, // Edit Licence Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'delete-licence/:id',
    component: DeleteLicenceComponent, // Delete Licence Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  {
    path: 'user/:username',
    component: PublicProfileComponent, // Public Profile Route
    canActivate: [AuthGuard] // User must be logged in to view this route
  },
  { path: '**', component: HomeComponent } // "Catch-All" Route
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
  bootstrap: [],
  exports: [RouterModule]
})

export class AppRoutingModule { }
