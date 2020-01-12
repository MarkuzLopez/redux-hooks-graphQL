import {createStore, combineReducers, compose, applyMiddleware } from 'redux';
import userReducer, {restoreSessionAction} from './userDuck';
import charsReducer, {getCharacterActions, restoreFavorites} from './charsDuck';
import  thunk from 'redux-thunk';

//* aqui contendra todos los reducers.
let rootReducer = combineReducers({
    user: userReducer,
    characters: charsReducer
});
//* varaiabkle para utilizar las herramientas de desarollo 
const composeEnhancers =  window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function generateStore(){
    let store = createStore(rootReducer,
        composeEnhancers( applyMiddleware(thunk))
        )
    /// ejecutar la accion de characters, es una funcion doble, y consigo los personajes por primer vez 
    getCharacterActions()(store.dispatch, store.getState)
    restoreSessionAction()(store.dispatch)
    restoreFavorites()(store.dispatch)

    return store;
}
