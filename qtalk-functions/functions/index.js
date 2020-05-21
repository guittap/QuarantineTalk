const functions = require('firebase-functions');

const express = require('express');
const app = express();

const FBAuth = require('./utility/fbAuth')

const { getAllChats, postOneChat, getChat, commentOnChat } = require('./handlers/chats');
const { signup, login, uploadImage, addUserDetails, getAuthenticatedUser } = require('./handlers/users');


// Chat Routes
app.get('/chats', getAllChats);
app.post('/chat', FBAuth, postOneChat);
app.get('/chat/:chatId', getChat);
// TODO: delete chat
// TODO: like a chat
// TDOD: unlike a chat
app.post('/chat/:chatId/comment', FBAuth, commentOnChat);

// User Routes
app.post('/signup', signup);
app.post('/login', login);
app.post('/user/image', FBAuth, uploadImage);
app.post('/user', FBAuth, addUserDetails);
app.get('/user', FBAuth, getAuthenticatedUser);

exports.api = functions.https.onRequest(app);