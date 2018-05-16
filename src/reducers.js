import { visibilityFilters } from './actions';
import { ADD_TODO, TOGGLE_TODO, SET_VISIBILITY_FILTER} from './actions';
//we import constants defined in actions.js

const initialState = {
  visibilityFilter: visibilityFilters.SHOW_ALL,
  todos: []
}

//..and define initial State object, so that Readux knows what the introductory state of our app is..

function todoApp(state = initialState, action) {
  switch(action.type){
    case SET_VISIBILITY_FILTER:
      return {
        ...state,
        visibilityFilter: action.filter
      };
    case ADD_TODO:
      return {
        ...state,
        todos: [
          ...state.todos,
          {
            text: action.text,
            completed: false
          } 
        ]
        };
    case TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map((todo,index) => {
         (index === action.id) ? {...todo, completed: !todo.completed} : todo
        })
      }
    default:
      return state;
  }
}

/*above we have an introductory/background reducer, which renders introductory state;
this could be written longer (witout es6 default arguments syntax):
function todoApp (state, action) {
  if (typeof(state) == 'undefined') {
    return initialState
  }
  return state;
}
*/