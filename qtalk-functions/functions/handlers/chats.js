const { db } = require("../utility/admin");

const config = require('../utility/config');

const firebase = require('firebase');
if (!firebase.apps.length) {
     firebase.initializeApp(config);
}

exports.getAllChats = (req, res) => {
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
}

exports.postOneChat = (req, res) => {

     if (req.body.body.trim() === '') {
          return res.status(400).json({ body: 'Body must not be empty' });
     }

     const newChat = {
          body: req.body.body, 
          userHandle: req.user.handle,
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
}

