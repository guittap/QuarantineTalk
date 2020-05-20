const functions = require('firebase-functions');

const express = require('express');
const app = express();

const FBAuth = require('./utility/fbAuth')

const { getAllChats, postOneChat } = require('./handlers/chats');
const { signup, login, uploadImage } = require('./handlers/users');


// Chat Routes
app.get('/chats', getAllChats);
app.post('/chat', FBAuth, postOneChat);

// User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);

exports.api = functions.https.onRequest(app);