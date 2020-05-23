const { db } = require("../utility/admin");

const config = require("../utility/config");

const firebase = require("firebase");
if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

exports.getAllChats = (req, res) => {
  db.collection("chat")
    .orderBy("createdAt", "desc")
    .get()
    .then((data) => {
      let chat = [];
      data.forEach((doc) => {
        chat.push({
          chatId: doc.id,
          body: doc.data().body,
          userHandle: doc.data().userHandle,
          createdAt: doc.data().createdAt,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          userImage: doc.data().userImage,
        });
      });
      return res.json(chat);
    })
    .catch((err) => console.error(err));
};

exports.postOneChat = (req, res) => {
  if (req.body.body.trim() === "") {
    return res.status(400).json({ body: "Body must not be empty" });
  }

  const newChat = {
    body: req.body.body,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0,
  };

  db.collection("chat")
    .add(newChat)
    .then((doc) => {
      const resChat = newChat;
      resChat.chatId = doc.id;
      res.json(resChat);
    })
    .catch((err) => {
      res.status(500).json({ error: "something went wrong" });
      console.error(err);
    });
};

// get comments of a chat
exports.getChat = (req, res) => {
  let chatData = {};
  db.doc(`/chat/${req.params.chatId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chat not found" });
      }
      chatData = doc.data();
      chatData.chatId = doc.id;
      return db
        .collection("comments")
        .orderBy("createdAt", "desc")
        .where("chatId", "==", req.params.chatId)
        .get();
    })
    .then((data) => {
      chatData.comments = [];
      data.forEach((doc) => {
        chatData.comments.push(doc.data());
      });
      return res.json(chatData);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

// comment on a chat
exports.commentOnChat = (req, res) => {
  if (req.body.body.trim() === "")
    return res.status(400).json({ comment: "Must not be empty" });

  const newComment = {
    body: req.body.body,
    createdAt: new Date().toISOString(),
    chatId: req.params.chatId,
    userHandle: req.user.handle,
    userImage: req.user.imageUrl,
  };

  db.doc(`/chat/${req.params.chatId}`)
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chat not found" });
      }
      return doc.ref.update({ commentCount: doc.data().commentCount + 1 });
    })
    .then(() => {
      return db.collection("comments").add(newComment);
    })
    .then(() => {
      res.json(newComment);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: "Something went wrong" });
    });
};

// like a chat
exports.likeChat = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("chatId", "==", req.params.chatId)
    .limit(1);

  const chatDocument = db.doc(`/chat/${req.params.chatId}`);

  let chatData = {};

  chatDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        chatData = doc.data();
        chatData.chatId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Chat not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return db
          .collection("likes")
          .add({
            chatId: req.params.chatId,
            userHandle: req.user.handle,
          })
          .then(() => {
            chatData.likeCount++;
            return chatDocument.update({ likeCount: chatData.likeCount });
          })
          .then(() => {
            return res.json(chatData);
          });
      } else {
        return res.status(400).json({ error: "Chat already liked" });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

exports.unlikeChat = (req, res) => {
  const likeDocument = db
    .collection("likes")
    .where("userHandle", "==", req.user.handle)
    .where("chatId", "==", req.params.chatId)
    .limit(1);

  const chatDocument = db.doc(`/chat/${req.params.chatId}`);

  let chatData = {};

  chatDocument
    .get()
    .then((doc) => {
      if (doc.exists) {
        chatData = doc.data();
        chatData.chatId = doc.id;
        return likeDocument.get();
      } else {
        return res.status(404).json({ error: "Chat not found" });
      }
    })
    .then((data) => {
      if (data.empty) {
        return res.status(400).json({ error: "Chat never liked" });
      } else {
        return db
          .doc(`/likes/${data.docs[0].id}`)
          .delete()
          .then(() => {
            chatData.likeCount--;
            return chatDocument.update({ likeCount: chatData.likeCount });
          })
          .then(() => {
            res.json(chatData);
          });
      }
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.code });
    });
};

//Delete chat
exports.deleteChat = (req, res) => {
  const document = db.doc(`/chat/${req.params.chatId}`);
  document
    .get()
    .then((doc) => {
      if (!doc.exists) {
        return res.status(404).json({ error: "Chat not found" });
      }
      if (doc.data().userHandle !== req.user.handle) {
        return res.status(403).json({ error: "Unauthorized" });
      } else {
        return document.delete();
      }
    })
    .then(() => {
      res.json({ message: "Chat deleted successfully" });
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
