import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {AngularFireDatabase, AngularFireList} from "angularfire2/database";
import {Observable} from "rxjs/Observable";
import {AngularFireAuth} from "angularfire2/auth";
import {map} from "rxjs/internal/operators";
import {auth} from "firebase";
import {HomePage} from "../pages/home/home";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = 'MyFilesPage';
  currentUser: any;

  pages: Array<{ title: string, component: any }>;
  lotsRef: AngularFireList<any>;
  lots: Observable<any[]>;
  avatarUrl: string = null;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              db: AngularFireDatabase, public afAuth: AngularFireAuth) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Find Parking', component: HomePage}
    ];
    // showing user lots
    // window.auth = this.afAuth;
    // window.nav = this.nav;
    afAuth.user.subscribe((user) => {
      console.log(user);
      if (user && user.uid) {
        // this.photoUrl = user.photoURL;
        this.avatarUrl = user.photoURL;
        this.currentUser = user;
        this.lotsRef = db.list('/lots', ref => ref.orderByChild('uuid').equalTo(user.uid));
        this.lots = this.lotsRef.snapshotChanges().pipe(
          map(actions =>
            actions.map(a => ({key: a.key, ...a.payload.val()}))
          )
        );
      } else {
        this.currentUser = null;


      }
    })
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  facebook(){
    this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  googleAuth(){
    this.afAuth.auth.signInWithRedirect(new auth.GoogleAuthProvider());
  }

  login() {
    this.afAuth.auth.signInWithRedirect(new auth.FacebookAuthProvider());
  }

  logout() {
    this.avatarUrl = null;
    this.afAuth.auth.signOut();
    window.location.reload();

  }



}
