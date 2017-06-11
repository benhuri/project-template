import { Component, OnInit } from '@angular/core';
import { FirebaseListObservable } from 'angularfire2';
import { AF } from "../.././providers/af";

@Component({
  templateUrl: './blocked-users.component.html',
  styleUrls: ['./blocked-users.component.css']
})
export class BlockedUsersComponent implements OnInit 
{
  private header = 
  { 
     title: "משתמשים חסומים", 
     subTitle: "צפייה ועריכת המשתמשים החסומים",
     icon: "fa-user-times" 
  }

  // Flags
  private userSelected: boolean;

  private user: any;
  private users: FirebaseListObservable<any[]>;

  // =====================

  constructor(private afService: AF) 
  {
    this.userSelected = false;
    this.users = this.afService.af.database.list('registeredUsers');
  }

  // =====================

  showUserDetails(user)
  {
    this.user = user;
    this.userSelected = true;
  }

  // =====================

  sendUserToConfirmation()
  {
    if (confirm("האם ברצונך לבטל חסימה של משתמש זה?"))
    {
      this.users.update(this.user.$key, {permission: 4}).then( () => 
      {
        alert('שים לב: המשתמש' + ' ' + this.user.name + ' ' + this.user.lastName + ' ' + 'הועבר לרשימת הממתינים לאישור');
        this.userSelected = false;
      })
    }
  }

  // =====================

  resetAll()
  {
    this.user = null;
    this.userSelected = false;
  }

  // =====================

  ngOnInit() { }

}
