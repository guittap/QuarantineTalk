const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const express = require('express');
const app = express();

app.get('/chats', (req, res) => {
     admin.firestore().collection('chat')
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

     admin.firestore()
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

// hhtps://baseurl.com/api

exports.api = functions.https.onRequest(app);