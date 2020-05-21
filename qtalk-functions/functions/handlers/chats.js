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

// get comments of a chat
exports.getChat = (req, res) => {
     let chatData = {};
     db.doc(`/chat/${req.params.chatId}`).get()
          .then(doc => {
               if(!doc.exists) {
                    return res.status(404).json({error: 'Chat not found'})
               }
               chatData = doc.data();
               chatData.chatId = doc.id;
               return db.collection('comments').orderBy('createdAt', 'desc').where('chatId','==', req.params.chatId).get();
          })
          .then(data => {
               chatData.comments = [];
               data.forEach(doc => {
                    chatData.comments.push(doc.data())
               });
               return res.json(chatData)
          })
          .catch (err => {
               console.error(err);
               res.status(500).json({error: err.code});
          })
}

// comment on a chat
exports.commentOnChat = (req, res) => {
     if(req.body.body.trim() === '') return res.status(400).json({ error: 'Must not be empty'});

     const newComment = {
          body: req.body.body,
          createdAt: new Date().toISOString(),
          chatId: req.params.chatId,
          userHandle: req.user.handle,
          userImage: req.user.imageUrl
     };

     db.doc(`/chat/${req.params.chatId}`).get()
          .then(doc => {
               if(!doc.exists){
                    return res.status(404).json({ error: 'Chat not found'});
               }
               return db.collection('comments').add(newComment);
          })
          .then(() => {
               res.json(newComment);
          })
          .catch(err => {
               console.log(err);
               res.status(500).json({ error: 'Something went wrong' });
          })
}
