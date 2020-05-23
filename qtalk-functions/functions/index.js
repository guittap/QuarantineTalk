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
          return db.doc(`/chat/${snapshot.data().chatId}`).get()
               .then(doc => {
                    if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
               .catch(err => 
                    console.error(err));
     });

exports.deleteNotificationOnUnLike = functions.region('us-central1').firestore.document('likes/{id}')
.onDelete((snapshot) => {
     return db.doc(`/notifications/${snapshot.id}`)
          .delete()
          .catch((err) => 
               console.error(err));
})

exports.createNotificationOnComment = functions.region('us-central1').firestore.document('comments/{id}')
.onCreate((snapshot) => {
     return db.doc(`/chat/${snapshot.data().chatId}`).get()
               .then(doc => {
                    if(doc.exists && doc.data().userHandle !== snapshot.data().userHandle) {
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
               .catch(err => 
                    console.error(err));
});

exports.onUserImageChange = functions.firestore.document('/users/{userId}')
     .onUpdate((change) => {
          if(change.before.data().imageUrl !== change.after.data().imageUrl){
               const batch = db.batch();
               return db.collection('chat').where('userHandle', '==', change.before.data().handle).get()
                    .then((data) => {
                         data.forEach((doc) => {
                              const chat = db.doc(`/chat/${doc.id}`);
                              batch.update(chat, { userImage: change.after.data().imageUrl});
                         })
                         return batch.commit();
                    })
                    .catch(err => console.error(err));

          } else return true;
     });

exports.onChatDelete = functions.firestore.document('/chat/{chatId}')
     .onDelete((snapshot, context) => {
          const chatId = context.params.chatId;
          const batch = db.batch();
          return db.collection('comments').where('chatId', '==', chatId).get()
               .then(data => {
                    data.forEach (doc => {
                         batch.delete(db.doc(`/comments/${doc.id}`));
                    })
                    return db.collection('likes').where('chatId', '==', chatId).get();
               })
               .then(data => {
                    data.forEach (doc => {
                         batch.delete(db.doc(`/likes/${doc.id}`));
                    })
                    return db.collection('notifications').where('chatId', '==', chatId).get();
               })
               .then(data => {
                    data.forEach (doc => {
                         batch.delete(db.doc(`/notifications/${doc.id}`));
                    })
                    return batch.commit();
               })
               .catch(err => console.error(err));

     })