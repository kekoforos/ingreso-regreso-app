import { Usuario } from './../models/usuario.model';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: AngularFireAuth,
              public firestore: AngularFirestore) { }

  initAuthListener() {
    this.auth.authState.subscribe( fuser => {
      console.log(fuser);
    });
  }

  crearUsuario( nombre: string, email: string, password: string) {
    return this.auth.auth.createUserWithEmailAndPassword( email, password )
      .then( ({ user }) => {
        const newUSer = new Usuario( user.uid, nombre, user.email );

        return this.firestore.doc(`${ user.uid }/usuario`).set({...newUSer});
      });
  }

  loginUsuario( email: string, password: string) {
    return this.auth.auth.signInWithEmailAndPassword( email, password );
  }

  logout() {
    return this.auth.auth.signOut();
  }

  isAuth() {
    return this.auth.authState.pipe(
      map( fbUser => fbUser != null )
    );
  }
}
