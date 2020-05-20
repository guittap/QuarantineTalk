const functions = require('firebase-functions');
const admin = require('firebase-admin');
const express = require('express');
const app = express();

admin.initializeApp({
     credential: admin.credential.cert(require('../key/admin.json'))
});

const config = {
     apiKey: "AIzaSyCL6MMmg_HFbGa_1dlX3dh8rpfavxESitg",
     authDomain: "quarantinetalk-a1064.firebaseapp.com",
     databaseURL: "https://quarantinetalk-a1064.firebaseio.com",
     projectId: "quarantinetalk-a1064",
     storageBucket: "quarantinetalk-a1064.appspot.com",
     messagingSenderId: "248664078567",
     appId: "1:248664078567:web:94cbc17f745b8c97318a42",
     measurementId: "G-LXBNKQXB3G"
};

const firebase = require('firebase');
firebase.initializeApp(config);

const db = admin.firestore();

app.get('/chats', (req, res) => {
     db.collection('chat')
     .orderBy('createdAt', 'desc')
     .get()
     .then(data => {
          let chat = [];
          data.forEach(doc => {
               chat.push({
                    chatId: doc.id,
                    body: doc.data().body,
                    userHandle: doc.data().userHandle,
                    createdAt: doc.data().createdAt
               });
          });
          return res.json(chat);
     })
     .catch(err => console.error(err));
});

app.post('/chat',(req, res) => {
     if (req.method != 'POST'){
          return res.status(400).json({ error: 'Method not allowed'});
     }
     const newChat = {
          body: req.body.body, 
          userHandle: req.body.userHandle,
          createdAt: new Date().toISOString()
     };

     db
          .collection('chat')
          .add(newChat)
          .then(doc => {
               res.json({
                    message: `document ${doc.id} created successfully`
               });
          })
          .catch(err => {
               res.status(500).json({ error: 'something went wrong'});
               console.error(err);
          });
});

// signup route
app.post('/signup', (req, res) => {
     const newUser = {
          email: req.body.email,
          password: req.body.password,
          confirmPassword: req.body.confirmPassword,
          handle: req.body.handle,
     }

     //TODO: validate data
     let token, userId;
     db.doc(`/users/${newUser.handle}`).get()
          .then(doc => {
               if(doc.exists){
                    return res.status(400).json({handle: 'this handle is already taken'});
               }
               else {
                    return firebase.auth().createUserWithEmailAndPassword(newUser.email, newUser.password);
               }
          })
          .then (data => {
               userId = data.user.uid
               return data.user.getIdToken();
               
          })
          .then (idToken => {
               token = idToken;
               const userCredentials = {
                    handle: newUser.handle,
                    email: newUser.email,
                    createdAt: new Date().toISOString(),
                    userId
               };

               return db.doc(`/users/${newUser.handle}`).set(userCredentials);
          })
          .then(() => {
               return res.status(201).json({ token });
          })
          .catch (err => {
               console.error(err);
               if (err.code === "auth/email-already-in-use") {
                    return res.status(400).json({email: "Email is already in use"});
               } else {
                    return res.status(500).json({error: err.code});
               }
          });
});

exports.api = functions.https.onRequest(app);