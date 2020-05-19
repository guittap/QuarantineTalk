const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send("Hello world");
});

exports.getChats = functions.https.onRequest((req, res) => {
     admin.firestore().collection('chat').get()
          .then(data => {
               let chat = [];
               data.forEach(doc => {
                    chat.push(doc.data());
               });
               return res.json(chat);
          })
          .catch(err => console.error(err));
});

exports.createChat = functions.https.onRequest((req, res) => {
     if (req.method != 'POST'){
          return res.status(400).json({ error: 'Method not allowed'});
     }
     const newChat = {
          body: req.body.body, 
          userHandle: req.body.userHandle,
          createdAt: admin.firestore.Timestamp.fromDate(new Date())
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
