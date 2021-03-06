
// Modules
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { RouterModule, Routes } from "@angular/router";
import { AngularFireModule } from 'angularfire2';

// Components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { MessagesComponent } from './pages/messages/messages.component';
import { AttendanceComponent } from './pages/attendance/attendance.component';
import { ReportsComponent } from './pages/reports/reports.component';
import { PupilsManagementComponent } from './pages/pupils-management/pupils-management.component';
import { RegistrationComponent } from './pages/registration/registration.component';
import { PageHeaderComponent } from './page-header/page-header.component';
import { UsersConfirmComponent } from './pages/users-confirm/users-confirm.component';
import { DeletedUsersComponent } from './pages/deleted-users/deleted-users.component';
import { UsersManagementComponent } from './pages/users-management/users-management.component';
import { AssociateTeamsComponent } from './associate-teams/associate-teams.component';
import { UserStatusComponent } from './user-status/user-status.component';
import { NavHeaderComponent } from './nav-header/nav-header.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { TeamsManagementComponent } from './pages/teams-management/teams-management.component';

// Animations
import { LoadingComponent } from './_animations/loading/loading.component';
import { SpinnerComponent } from './_animations/spinner/spinner.component';

// Services/Providers
import { SimpleNotificationsModule, PushNotificationsService } from 'angular2-notifications-lite';
import { AF } from "./providers/af";
import { ShareService } from "./providers/share-service";


// ======================================================
// Initialize Firebase 

  export const firebaseConfig = 
  {
    apiKey: "AIzaSyALUkgtATRDcoX5c3AeLvLX_JLkrTXJS4c",
    authDomain: "application-d2061.firebaseapp.com",
    databaseURL: "https://application-d2061.firebaseio.com",
    projectId: "application-d2061",
    storageBucket: "application-d2061.appspot.com",
    messagingSenderId: "1005060683377"
  };

// ======================================================

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'attendance', component: AttendanceComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'messages', component: MessagesComponent },
  { path: 'pupils-management', component: PupilsManagementComponent },
  { path: 'register', component: RegistrationComponent },
  { path: 'users-confirm', component: UsersConfirmComponent },
  { path: 'deleted-users', component: DeletedUsersComponent },
  { path: 'users-management', component: UsersManagementComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'teams-management', component: TeamsManagementComponent }
 
];

// ======================================================

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    MessagesComponent,
    AttendanceComponent,
    ReportsComponent,
    PupilsManagementComponent,
    RegistrationComponent,
    PageHeaderComponent,
    UsersConfirmComponent,
    LoadingComponent,
    DeletedUsersComponent,
    UsersManagementComponent,
    AssociateTeamsComponent,
    UserStatusComponent,
    NavHeaderComponent,
    SpinnerComponent,
    ForgotPasswordComponent,
    TeamsManagementComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    SimpleNotificationsModule.forRoot(),
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [ AF, ShareService, PushNotificationsService ],
  bootstrap: [ AppComponent ]
})

// ======================================================

export class AppModule { }

