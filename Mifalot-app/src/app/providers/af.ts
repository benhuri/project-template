
import { Injectable } from "@angular/core";
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

// For take() 
import 'rxjs/Rx';

@Injectable()

export class AF 
{
  // User info
  private displayName: string;
  private email: string;
  private uid: string;
  
  // Array
  private userTeams;

  private user:any;

  private subscribeArray;

  // ================================

  constructor(public af: AngularFire) 
  {
    this.userTeams = this.subscribeArray = [];
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
    return this.af.auth.logout();
  }

  // ================================
  /**
   * Saves a message to the Firebase Realtime Database
   * @param text
   */

  sendMessage(text, chatRoom: FirebaseListObservable<any>) 
  {
    var message =
      {
        message: text,
        displayName: this.displayName,
        email: this.email,
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
        this.uid = uid;
        this.displayName = name;
        this.email = email;
        this.getUserTeamsFromDB();
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
        this.getUserTeamsFromDB();
      })    
  }

   // ================================

  saveUserDetails(user)
  {
    this.uid = user.uid;
    this.displayName = user.auth.email;
    this.email = user.auth.email;
  }

  // ================================

  unsubscribeAll()
  {
    for (var i = 0; i < this.subscribeArray.length; i++)
      if (this.subscribeArray[i])
        this.subscribeArray[i].unsubscribe();
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

  getUserName() 
  {
    return this.displayName;
  }

  // ================================

  getUserEmail() 
  {
    return this.email;
  }

  // ================================

  getUid()
  {
    return this.uid;
  }

  // ================================

  getUserTeams()
  {
    return this.userTeams;
  }

  // ================================
  //        Global Methods
  // ================================

 getUserTeamsFromDB() 
  {
    this.userTeams = [];
    
    var allTeams = this.af.database.list('teams/', { preserveSnapshot: true }).take(1);
  
     allTeams.subscribe(snapshots => {
        snapshots.forEach(snapshot => {
          if (snapshot.val().coachID == this.uid) 
            this.userTeams.push(snapshot.val());
        })
      })

    }

  // ================================

  getUserDetails(user)
  {
    if (this.uid)
    {
      this.user = this.af.database.object('registeredUsers/' + this.uid, { preserveSnapshot: true });
      this.subscribeArray.push(this.user.subscribe(snapshot => 
      {
        user.uid = this.uid;
        user.name = snapshot.val().name;
        user.lastName = snapshot.val().lastName;
        user.ID = snapshot.val().ID;
        user.permission = snapshot.val().permission;
        user.phoneNumber = snapshot.val().phoneNumber;
      }));
    }
  }

  // ================================

  getUserPermissionFromDB(user)
  {
    if (this.uid)
    {
      this.user = this.af.database.object('registeredUsers/' + this.uid, { preserveSnapshot: true });
      this.subscribeArray.push(this.user.subscribe(snapshot => 
      {
       user.permission = snapshot.val().permission;
      }));
    }
  }

}

