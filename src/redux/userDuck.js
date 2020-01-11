import { loginWithGoogle, signOutGoogle } from '../firebase';
// cmunicacion entre ducks
import { retreiveFavs } from './charsDuck';
//* constants 
let initialData = { 
    loggedIn: false,
    fetching: false
}

let LOGIN = "LOGIN";
let LOGIN_SUCCESS = "LOGIN_SUCCESS";
let LOGIN_ERROR = "LOGIN_ERROR";

let LOG_OUT = "LOG_OUT";
//* reducer, algo que siempre estara escuchando y devolviendo un state.
export default function reducer(state = initialData, action){
    switch(action.type) {

        case LOG_OUT: 
            return { ...initialData }

        case LOGIN:
            return { ...state, fetching: true}
       
        case LOGIN_SUCCESS: 
            // obtenemos una copa del estado, tambien del fetching false y los users del payload en los actions (thuns)
            return {...state, fetching: false, ...action.payload, loggedIn: true }
       
        case LOGIN_ERROR: 
            return {...state, fetching: false}
       
            default: 
                 return state;
    }
}

// guarar la session en el srorage

function saveStorage(storage) { 
    console.log(storage);
    //* recordar que el storage solo se guardan strings, y no objetos.
    localStorage.storage = JSON.stringify(storage);
}

//rrecuperar storage 
export let restoreSessionAction = () =>  dispatch =>{ 
    let storage = localStorage.getItem('storage');
    storage = JSON.parse(storage)
    // si existe storage y ademas si  existe la llame user
    if(storage && storage.user) { 
        dispatch({
            type: LOGIN_SUCCESS,
            payload: storage.user
        })
    }
}

//*  action paraa desloguearte 

export let logOutAction = () => (dispatch, getState) => { 
    signOutGoogle()
    dispatch({
        type: LOG_OUT
    })
    localStorage.removeItem('storage')
}

//* action (action creator)
export let doGoogleLoginAction = () => (dispatch, getState) => { 
    dispatch({
        type: LOGIN
    })
    return loginWithGoogle()
            .then( user => {
                dispatch({
                    type: LOGIN_SUCCESS,
                    payload: {
                        uid: user.uid,
                        displayName: user.displayName,
                        email: user.email,
                        photoURL: user.photoURL
                    }
                })
                saveStorage(getState())
                /// mandar el dispatch y el getState.
                retreiveFavs()(dispatch, getState)
            }).catch( err => {
                console.log(err);
                dispatch({
                    type: LOGIN_ERROR,
                    payload: err.message
                })
            })
    
}