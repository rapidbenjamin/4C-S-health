import { createStore } from 'redux'


function counterReducer(state = {}, action) {
  switch (action.type) {
    case 'setUser':
      return { user: action.data }
    case 'setChatList':
      return { list: action.data }
    default:
      return state
  }
}


function counterReducer2(state = {}, action) {
  switch (action.type) {
    case 'setChatList':
      return { list: action.data }
    default:
      return state
  }
}


let store = createStore(counterReducer)
let storeChat = createStore(counterReducer2)


export { store as UserStore, storeChat as ChatStore}