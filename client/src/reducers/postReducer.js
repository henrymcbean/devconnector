import { ADD_POST } from '../actions/types';

const initialState = {
  posts: [],
  post: {},
  loading: false
}

export default function postReducer(state=initialState, action) {
  switch (action.type) {
    case ADD_POST:
      return {
        ...state,
        post: action.payload
      }
    default:
      return state;
  }
}
