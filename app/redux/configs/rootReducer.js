import { combineReducers } from 'redux';
import { formReducer } from '../reducers/formReducer';

export const rootReducer = combineReducers({
  formReducer,
});
