import {
  SET_CHATS,
  LOADING_DATA,
  LIKE_CHAT,
  UNLIKE_CHAT,
  DELETE_CHAT,
  SET_ERRORS,
  POST_CHAT,
  CLEAR_ERRORS,
  LOADING_UI,
  SET_CHAT,
  STOP_LOADING_UI,
  SUBMIT_COMMENT,
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

export const getChat = (chatId) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .get(`/chat/${chatId}`)
    .then((res) => {
      dispatch({
        type: SET_CHAT,
        payload: res.data,
      });
      dispatch({ type: STOP_LOADING_UI });
    })
    .catch((err) => console.log(err));
};

// post a chat
export const postChat = (newChat) => (dispatch) => {
  dispatch({ type: LOADING_UI });
  axios
    .post("/chat", newChat)
    .then((res) => {
      dispatch({
        type: POST_CHAT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
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

// submit a comment
export const submitComment = (chatId, commentData) => (dispatch) => {
  axios
    .post(`/chat/${chatId}/comment`, commentData)
    .then((res) => {
      dispatch({
        type: SUBMIT_COMMENT,
        payload: res.data,
      });
      dispatch(clearErrors());
    })
    .catch((err) => {
      dispatch({
        type: SET_ERRORS,
        payload: err.response.data,
      });
    });
};

export const deleteChat = (chatId) => (dispatch) => {
  axios
    .delete(`chat/${chatId}`)
    .then(() => {
      dispatch({ type: DELETE_CHAT, payload: chatId });
    })
    .catch((err) => console.log(err));
};

export const getUserData = (userHandle) => (dispatch) => {
  dispatch({ type: LOADING_DATA });
  axios
    .get(`/user/${userHandle}`)
    .then((res) => {
      dispatch({
        type: SET_CHATS,
        payload: res.data.chats,
      });
    })
    .catch(() => {
      dispatch({
        type: SET_CHATS,
        payload: null,
      });
    });
};

export const clearErrors = () => (dispatch) => {
  dispatch({ type: CLEAR_ERRORS });
};
