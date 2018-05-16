export const ADD_TODO = 'ADD_TODO';
export const TOGGLE_TODO = 'TOGGLE_TODO';
export const SET_VISIBILITY_FILTER = 'SET_VISIBILITY_FILTER';

//action types have been defined...

export const visibilityFilters = {
  SHOW_ALL: 'SHOW_ALL',
  SHOW_COMPLETED: 'SHOW_COMPLETED',
  SHOW_ACTIVE: 'SHOW_ACTIVE'
}

// ... and one additional constant object so that we write less...

export function addTodo(text) {
  return {
    type: ADD_TODO,
    text: text
  }
}

export function toggleTodo(id) {
  return {
    type: TOGGLE_TODO,
    id: id
  }
}

export function setVisibilityFilter(filter) {
  return {
    type: SET_VISIBILITY_FILTER,
    filter: filer
  }
}

// so called action creators have been defined...