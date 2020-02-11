import axios from 'axios';

export function fetchTweets() {
  return function (dispatch) {
    axios.get('src/mock_data/tweets.json')
      .then( (response) => {
        dispatch({
          type: 'FETCH_TWEETS_FULFILLED',
          payload: response
        })
      })
      .catch( (err) => {
        dispatch({
          type: 'FETCH_TWEETS_REJECTED',
          payload: err
        })
      })
  }
}

export function addTweet(id, text) {
  return {
    type: 'ADD_TWEET',
    payload: {
      id,
      text
    }
  }
}

export function updateTweet(id, text) {
  return {
    type: 'UPDATE_TWEET',
    payload: {
      id,
      text
    }
  }
}