const functions = require('firebase-functions');
const express = require('express');
const app = express();
const FBAuth = require('./utility/fbAuth');

const { db } = require('./utility/admin');

const { getAllChats, postOneChat, getChat, commentOnChat, likeChat, unlikeChat, deleteChat } = require('./handlers/chats');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser, getUserDetails, markNotificationsRead } = require('./handlers/users');


// Chat Routes
app.get('/chats', getAllChats);
app.post('/chat', FBAuth, postOneChat);
app.get('/chat/:chatId', getChat);
app.delete('/chat/:chatId', FBAuth, deleteChat);
app.get('/chat/:chatId/like', FBAuth, likeChat);
app.get('/chat/:chatId/unlike', FBAuth, unlikeChat);
app.post('/chat/:chatId/comment', FBAuth, commentOnChat);

// User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', markNotificationsRead);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.region('us-central1').firestore.document('likes/{id}')
     .onCreate((snapshot) => {
          db.doc(`/chat/${snapshot.data().chatId}`).get()
               .then(doc => {
                    if(doc.exists) {
                         return db.doc(`/notifications/${snapshot.id}`).set({
                              createdAt: new Date().toISOString(),
                              recipient: doc.data().userHandle,
                              sender: snapshot.data().userHandle,
                              type: 'like',
                              read: false,
                              chatId: doc.id
                         });
                    }
               })
               .then(() => {
                    return;
               })
               .catch(err => {
                    console.error(err);
                    return;
               });
     });

exports.deleteNotificationOnUnLike = functions.region('us-central1').firestore.document('likes/{id}')
.onDelete((snapshot) => {
     db.doc(`/notifications/${snapshot.id}`)
          .delete()
          .then(() => {
               return;
          })
          .catch((err) => {
               console.error(err);
               return;
          })
})

exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}')
.onCreate((snapshot) => {
     db.doc(`/chat/${snapshot.data().chatId}`).get()
               .then(doc => {
                    if(doc.exists) {
                         return db.doc(`/notifications/${snapshot.id}`).set({
                              createdAt: new Date().toISOString(),
                              recipient: doc.data().userHandle,
                              sender: snapshot.data().userHandle,
                              type: 'comment',
                              read: false,
                              chatId: doc.id
                         });
                    }
               })
               .then(() => {
                    return;
               })
               .catch(err => {
                    console.error(err);
                    return;
               });
});