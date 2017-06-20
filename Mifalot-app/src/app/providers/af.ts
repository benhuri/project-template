
import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods, FirebaseObjectObservable, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { PushNotificationsService } from "angular2-notifications-lite";
import { Router } from '@angular/router';
import * as firebase from 'firebase/app';

// For take() 
import 'rxjs/Rx';

interface User 
{
  uid: string,
  email: string,
  name: string,
  lastName: string,
  ID: number,
  permission: number, 
  phoneNumber: number
}

@Injectable()

export class AF 
{ 
  // Array
  private subscribeArray: Array<any>;

  // DB Observable
  private user: FirebaseObjectObservable<any>;

  // Int
  private numOfChatRooms: number;

  // User info
  private userDetails: User;

  // ================================

  constructor(public af: AngularFire, private pushService: PushNotificationsService, private router: Router) 
  {
    this.userDetails = { uid: null, email: null, name: null, lastName: null, ID: null, permission: null, phoneNumber: null };
    this.subscribeArray = [];
    this.numOfChatRooms = 0;
  }

  // ================================
  /**
   * Logs in the user
   * @returns {firebase.Promise<FirebaseAuthState>}
   */

  // ================================
  /**
   * Logs out the current user
   */
  logout() 
  {
    this.unsubscribeAll();
    this.subscribeArray = [];
    this.userDetails.uid = null;

    return this.af.auth.logout();
  }

  // ================================
  /**
   * Saves a message to the Firebase Realtime Database
   * @param text
   */

  sendMessage(text, name, lastName, chatRoom: FirebaseListObservable<any>) 
  {
    let message =
      {
        message: text,
        displayName: name,
        lastName: lastName,
        email: this.userDetails.email,
        timestamp: Date.now()
      };

    return chatRoom.push(message);
  }

  // ================================
  /**
   * Calls the AngularFire2 service to register a new user
   * @param model
   * @returns {firebase.Promise<void>}
   */
  registerUser(email, password) 
  {
    console.log(email)
    return this.af.auth.createUser({
      email: email,
      password: password
    });
  }

  // ================================
  /**
   * Saves information to display to screen when user is logged in
   * @param uid
   * @param model
   * @returns {firebase.Promise<void>}
   */

  // ================================

  saveUserInfoFromForm(uid, name, lastName, phoneNumber, email, ID) 
  {      
    return this.af.database.object('registeredUsers/' + uid).set(
    {
      name: name,
      lastName: lastName,
      phoneNumber: phoneNumber,
      email: email,
      ID: ID, 
      permission: 4
    }).then(() => 
      {
        this.userDetails.uid = uid;
        this.userDetails.name = name;
        this.userDetails.email = email;
        this.getUserDetailsFromDB();
      })
  }

  // ================================
  /**
   * Logs the user in using their Email/Password combo
   * @param email
   * @param password
   * @returns {firebase.Promise<FirebaseAuthState>}
   */

  // ================================

  loginWithEmail(email, password) 
  {
    return this.af.auth.login(
    {
      email: email,
      password: password
    },
    {
      provider: AuthProviders.Password,
      method: AuthMethods.Password,
    }).then((user) => 
      {
        this.saveUserDetails(user);
        this.getUserDetailsFromDB();
      })    
  }

   // ================================

  saveUserDetails(user)
  {
    this.userDetails.uid = user.uid;
    this.userDetails.name = user.auth.email;
    this.userDetails.email = user.auth.email;
  }

  // ================================

  unsubscribeAll()
  {
    for (let i = 0; i < this.subscribeArray.length; i++)
      if (this.subscribeArray[i])
        this.subscribeArray[i].unsubscribe();
  }

  // ================================
 
  deleteUser()
  {
    this.unsubscribeAll();
    this.user.remove().then(() => 
    {
      let user = firebase.auth().currentUser;
      user.delete().then(() => 
      {
        // User deleted.
        this.subscribeArray = [];
        this.userDetails.uid = null;
        
        alert("משתמש זה נמחק ע״י מנהל מפעלות");    
      }, (error) => {
        // An error happened.
      });
    });
  }
  
  // ================================
  //  name = user.displayName;
  //  email = user.email;
  //  photoUrl = user.photoURL;
  //  emailVerified = user.emailVerified;
  //  uid = user.uid;  // The user's ID, unique to the Firebase project. Do NOT use
  //                    // this value to authenticate with your backend server, if
  //                    // you have one. Use User.getToken() instead.

  // ================================
  //        Gets' Methods
  // ================================

  getUserDetails()
  {
    return this.userDetails;
  }

  // ================================

  getUserDetailsFromDB()
  {
    if (this.userDetails.uid && this.subscribeArray.length == 0)
    {
      this.user = this.af.database.object('registeredUsers/' + this.userDetails.uid, { preserveSnapshot: true });
      this.subscribeArray.push(this.user.subscribe(snapshot => 
      {
        if (snapshot.val().permission == 5)
          this.deleteUser();

        // this.userDetails.uid = this.userDetails.uid;
        // this.userDetails.email = this.userDetails.email;
        this.userDetails.name = snapshot.val().name;
        this.userDetails.lastName = snapshot.val().lastName;
        this.userDetails.ID = snapshot.val().ID;
        this.userDetails.permission = snapshot.val().permission;
        this.userDetails.phoneNumber = snapshot.val().phoneNumber;
      }));
    }
  }

  // ================================

  // getUid()
  // {
  //   return this.uid;
  // }

  // // ================================
  // //        Push Notifications
  // // ================================

  // subscribeToChatRooms()
  // {
  //   this.getNumOfChatRooms();
  //   let chatRooms = this.af.database.list('chatRooms', { preserveSnapshot: true });
  //   let currentLength = 0;

  //   this.subscribeArray.push(chatRooms.subscribe(snapshots => 
  //   {
  //     currentLength = 0;
  //     snapshots.forEach(snapshot => 
  //     { 
  //       if (snapshot.val().authorID != this.uid)
  //         currentLength++;
  //     });
  //     if (currentLength > this.numOfChatRooms)
  //       this.pushNotification();
  //     this.numOfChatRooms = currentLength;
  //   }));

  // }
  
  // // ================================

  // getNumOfChatRooms()
  // {
  //   this.numOfChatRooms = 0;
  //   let chatRooms = this.af.database.list('chatRooms', { preserveSnapshot: true }).take(1);

  //   chatRooms.subscribe(snapshots => {
  //     snapshots.forEach(snapshot => 
  //     {
  //       this.numOfChatRooms++;
  //     })
  //     console.log(this.numOfChatRooms);
  //   });
  // }

  // // ================================

  // pushNotification()
  // {
  //   this.pushService.create('פורסמה חוויה חדשה', { body: 'כנס אל ״הודעות״ וצפה בהודעה', dir: 'rtl' }).subscribe(
  //           res => console.log(res),
  //           err => console.log(err)
  //       )
  // }

  // // ================================
  // // Uses routes array in app.module.ts
  
  // navigate(page: string)
  // {
  //   this.router.navigate([page]);
  // }
  
  // ================================

}

