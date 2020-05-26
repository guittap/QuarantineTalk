import {
  SET_CHATS,
  LIKE_CHAT,
  UNLIKE_CHAT,
  LOADING_DATA,
  DELETE_CHAT,
  POST_CHAT,
  SET_CHAT,
} from "../types";

const initialState = {
  chats: [],
  chat: {},
  loading: false,
};

export default function (state = initialState, action) {
  let index;
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true,
      };

    case SET_CHATS:
      return {
        ...state,
        chats: action.payload,
        loading: false,
      };

    case SET_CHAT:
      return {
        ...state,
        chat: action.payload,
      };

    case LIKE_CHAT:
    case UNLIKE_CHAT:
      index = state.chats.findIndex(
        (chat) => chat.chatId === action.payload.chatId
      );
      state.chats[index] = action.payload;
      if (state.chat.chatId === action.payload.chatId) {
        state.chat = action.payload;
      }
      return {
        ...state,
      };

    case DELETE_CHAT:
      index = state.chats.findIndex((chat) => chat.chatId === action.payload);
      state.chats.splice(index, 1);
      return {
        ...state,
      };

    case POST_CHAT:
      return {
        ...state,
        chats: [action.payload, ...state.chats],
      };
    default:
      return state;
  }
}
