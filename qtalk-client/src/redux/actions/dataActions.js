import {
  SET_CHATS,
  LOADING_DATA,
  LIKE_CHAT,
  UNLIKE_CHAT,
  DELETE_CHAT,
} from "../types";
import axios from "axios";

// get all chats
export const getChats = () => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get("/chats")
    .then((res) => {
      dispatch({
        type: SET_CHATS,
        payload: res.data,
      });
    })
    .catch((err) => {
      dispatch({
        type: SET_CHATS,
        payload: [],
      });
    });
};

// like a chat
export const likeChat = (chatId) => (dispatch) => {
  axios
    .get(`/chat/${chatId}/like`)
    .then((res) => {
      dispatch({
        type: LIKE_CHAT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

// unlike a chat
export const unlikeChat = (chatId) => (dispatch) => {
  axios
    .get(`/chat/${chatId}/unlike`)
    .then((res) => {
      dispatch({
        type: UNLIKE_CHAT,
        payload: res.data,
      });
    })
    .catch((err) => console.log(err));
};

export const deleteChat = (chatId) => (dispatch) => {
  axios
    .delete(`chat/${chatId}`)
    .then(() => {
      dispatch({ type: DELETE_CHAT, payload: chatId });
    })
    .catch((err) => console.log(err));
};
