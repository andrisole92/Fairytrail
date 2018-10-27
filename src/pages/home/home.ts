import {Component, ViewChild} from '@angular/core';
import {NavController} from 'ionic-angular';
import {AngularFireAuth} from 'angularfire2/auth';



@Component({
  selector: 'page-home',
  templateUrl: 'home.html',


})
export class HomePage {
  @ViewChild('myElement') myElem;

  constructor(public navCtrl: NavController,
              public afAuth: AngularFireAuth) {

    afAuth.user.subscribe(
      res => {
        console.log(res)
      },
      e => console.error(e)
    );
  }
}
