
import { Injectable } from '@angular/core';

import 'rxjs/add/operator/map';
import { tokenNotExpired } from 'angular2-jwt';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators/';
import { Http, RequestOptions, Headers } from '@angular/http';


@Injectable()
export class AuthService {

  // domain = ""; // Production
  domain = environment.domain;
  authToken;
  user;
  options;

  constructor(
    private http: Http
  ) { }

  // Function to create headers, add token, to be used in HTTP requests
  createAuthenticationHeaders() {
    this.loadToken(); // Get token so it can be attached to headers
    // Headers configuration options
    this.options = new RequestOptions({
      headers: new Headers({
        'Content-Type': 'application/json', // Format set to JSON
        'authorization': this.authToken // Attach token
      })
    });
  }


  // Function to get token from client local storage
  loadToken() {
    this.authToken = sessionStorage.getItem('token'); // Get token and asssign to variable to be used elsewhere
  }

  // Function to register user accounts
  registerUser(user) {
    return this.http.post(this.domain + 'authentication/register', user).pipe(map((res: any ) => res.json()));
  }

  // Function to check if username is taken
  checkUsername(username) {
    return this.http.get(this.domain + 'authentication/checkUsername/' + username).pipe(map((res: any ) => res.json()));
  }

  // Function to check if e-mail is taken
  checkEmail(email) {
    return this.http.get(this.domain + 'authentication/checkEmail/' + email).pipe(map((res: any ) => res.json()));
  }

  // Function to login user
  login(user) {
    return this.http.post(this.domain + 'authentication/login', user).pipe(map((res: any ) => res.json()));
  }

  // Function to logout
  logout() {
    this.authToken = null; // Set token to null
    this.user = null; // Set user to null
    sessionStorage.clear(); // Clear local storage
  }

  // Function to store user's data in client local storage
  storeUserData(token, user) {
    sessionStorage.setItem('token', token); // Set token in local storage
    sessionStorage.setItem('user', JSON.stringify(user)); // Set user in local storage as string
    this.authToken = token; // Assign token to be used elsewhere
    this.user = user; // Set user to be used elsewhere
  }

  // Function to get user's profile data
  getProfile() {
    this.createAuthenticationHeaders(); // Create headers before sending to API
    return this.http.get(this.domain + 'authentication/profile', this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to get public profile data
  getPublicProfile(username) {
    this.createAuthenticationHeaders(); // Create headers before sending to API
    return this.http.get(this.domain + 'authentication/publicProfile/' + username, this.options).pipe(map((res: any ) => res.json()));
  }

  // Function to check if user is logged in
  loggedIn() {
    return tokenNotExpired();
  }
  ChangePassword(CPass) {
    return this.http.put(this.domain + 'authentication/changePassword', CPass, this.options).pipe(map((res: any ) => res.json()));
  }

}
