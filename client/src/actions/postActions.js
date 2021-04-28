import axios from "axios";

import {
  POST_LOADING,
  GET_POST,
  GET_POSTS,
  ADD_POST,
  GET_ERRORS
} from "../actions/types";

export const addPost = (postData, history) => dispatch => {
  axios
    .post("/api/post", postData)
    .then(res => {
      dispatch({
        type: ADD_POST,
        payload: res.data
      });
    })
    .catch(err => 
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })  
    );
};
