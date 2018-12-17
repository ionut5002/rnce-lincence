
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { RequestOptions, Http , Headers } from '@angular/http';



@Injectable()
export class LicenceService {

  options;
  domain = this.authService.domain;
  filesToUpload = [];

  constructor(
    private authService: AuthService,
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.authService.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        // 'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authService.authToken // Attach token
      })
    });
  }

  // Function to create a new licence post
  newLicence(licence) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'licences/newLicence', licence, this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to get all licences from the database
  getAllLicences() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'licences/allLicences', this.options).pipe(map((res: any ) => res.json()));
  }
  getAllUsers() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'licences/allUsers', this.options).pipe(map((res: any ) => res.json()));
  }
  getAllNotifications() {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'licences/allNotifications', this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to get the licence using the id
  getSingleLicence(id) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'licences/singleLicence/' + id, this.options).pipe(map((res: any ) => res.json()));
  }
  getSingleUser(licenceC) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.get(this.domain + 'licences/singleUser/' + licenceC, this.options).pipe(map((res: any ) => res.json()));
  }
   // Function to close a licence
   closeLicence(id) {

     const closedata = {id: id };
     // Create headers
    return this.http.put(this.domain + 'licences/closeLicence/', closedata, this.options).pipe(map((res: any ) => res.json()));
  }
  uploadLicence(uploadData) {

    const closedata = uploadData;
    // Create headers
   return this.http.put(this.domain + 'licences/uploadLicence/', closedata, this.options).pipe(map((res: any ) => res.json()));
 }
 uploadPostWorks(uploadData) {

  const closedata = uploadData;
  // Create headers
 return this.http.put(this.domain + 'licences/post-works/', closedata, this.options).pipe(map((res: any ) => res.json()));
}
 ApplyingForLicence(id) {
  const blogData = { id: id };
  return this.http.put(this.domain + 'licences/ApplyingForLicence', blogData, this.options).pipe(map((res: any ) => res.json()));
}
CompleteWorks(id) {
  const blogData = { id: id };
  return this.http.put(this.domain + 'licences/CompleteWorks', blogData, this.options).pipe(map((res: any ) => res.json()));
}

AddRefNo(id, f) {
  const blogData = { id: id,
                      RefNo: f };
  return this.http.put(this.domain + 'licences/AddRefNo', blogData, this.options).pipe(map((res: any ) => res.json()));
}

  // Function to edit/update licence post
  editLicence(licence) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'licences/updateLicence/', licence, this.options).pipe(map((res: any ) => res.json()));
  }
  bookWorks(licence) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'licences/book-works/', licence, this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to delete a licence
  deleteLicence(id) {

    this.createAuthenticationHeaders(); // Create headers
    return this.http.delete(this.domain + 'licences/deleteLicence/' + id, this.options).pipe(map((res: any ) => res.json()));
  }


  // Function to like a licence post
  likeLicence(id) {
    const licenceData = { id: id };
    return this.http.put(this.domain + 'licences/likeLicence/', licenceData, this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to dislike a licence post
  dislikeLicence(id) {
    const licenceData = { id: id };
    return this.http.put(this.domain + 'licences/dislikeLicence/', licenceData, this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to post a comment on a licence post
  postComment(id, comment, attachements) {
    this.createAuthenticationHeaders(); // Create headers
    // Create licenceData to pass to backend
    const licenceData = {
      id: id,
      comment: comment,
      attachements: attachements

    };

    return this.http.post(this.domain + 'licences/comments', licenceData, this.options).pipe(map((res: any ) => res.json()));

  }
  newNotification(notification) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'licences/notifications', notification, this.options).pipe(map((res: any ) => res.json()));
  }

  seenNotification(id) {
    const notseen = { id: id};
    return this.http.put(this.domain + 'licences/seen', notseen, this.options).pipe(map((res: any ) => res.json()));
  }
  editNotification(newUserSeen) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.put(this.domain + 'licences/updateNotification/', newUserSeen, this.options).pipe(map((res: any ) => res.json()));
  }
  newEmailNot(newEMail) {
    this.createAuthenticationHeaders(); // Create headers
    return this.http.post(this.domain + 'licences/send', newEMail, this.options).pipe(map((res: any ) => res.json()));
  }

  // changeAllLicences() {
  //   const test = '';
  //   this.createAuthenticationHeaders(); // Create headers
  //   return this.http.put(this.domain + 'licences/changeallLicences', test ,  this.options).pipe(map((res: any ) => res.json()));
  // }


}
