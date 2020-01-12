import axios from 'axios';
import { updateDB, getFavs } from '../firebase';
//constantes
let initialData = {
    fetching: false,
    array: [],
    current: {},
    favorites: []
}
// URL API
let URL = "http://rickandmortyapi.com/api/character";

// aciones que se estan solicitando 
let GET_CHARACTERS = "GET_CHARACTERS";
let GET_CHARACTERS_SUCCESS = "GET_CHARACTERS_SUCCESS";
let GET_CHARACTERS_ERROR = "GET_CHARACTERS_ERROR";

let REMOVE_CHARACTER = "REMOVE_CHARACTER";
let ADD_TO_FAVORITES = "ADD_TO_FAVORITES";


let GET_FAVS = "GET_FAVS";
let GET_FAVS_SUCESS = "GET_FAVS_SUCESS";
let GET_FAVS_ERROR = "GET_FAVS_ERROR";


// reducer para cambiar los estados 
export default function reducer(state = initialData, action) {
    switch (action.type) {

        // utilizar las acciones 
        case GET_CHARACTERS:
            return {...state, fetching: true }
        // retorna copia del estado inicial, y poner en false fetchin ya que obtuvo los datos, y mandar el payload que es un mensaje
        case GET_CHARACTERS_ERROR:
            return {...state, fetching: false, error: action.payload}

        case GET_CHARACTERS_SUCCESS:
            // realizamos una copia del estado, y de igual manera llenamos el array con los datos del payload
            return {...state, array: action.payload, fetching: false}
        
        case REMOVE_CHARACTER: 
            // removemos un personaje del aarreglo.
            return { ...state, array: action.payload, fetchin: false }
        
        case ADD_TO_FAVORITES: 
            return { ...state, ...action.payload }
        // eslint-disable-next-line no-fallthrough

        // seccion de getFavorites 
        case GET_FAVS_SUCESS: 
            return { ...state, fetching: false, favorites: action.payload }

        case GET_FAVS_ERROR: 
            return { ...state, fetching: false, error: action.payload }
        
        case GET_FAVS: 
            return {...state, fetching: true}
        
        default:
            return state
    }
}

// guardar los favorites en el local storage 
function saveStorageFavorites(storage){
    localStorage.storage = JSON.stringify(storage)
}


export let restoreFavorites = () => dispatch =>  { 
    let storage = localStorage.getItem('favorites');
    storage = JSON.parse(storage)

    if(storage && storage.favorites) {
        dispatch({ 
            type: GET_FAVS_SUCESS,
            payload: storage.favorites
        })
    }
}

// actions (thunks)

// recuperar favoritos 
export let retreiveFavs = () => (dispatch, getState) => { 
    dispatch({
        type: GET_FAVS
    })
    let { uid } = getState().user
    console.log(uid);
    return getFavs(uid)
            .then(favorites => { 
                console.log('favorites', favorites);
                dispatch({
                    type: GET_FAVS_SUCESS,
                    payload: [...favorites]
                })
                saveStorageFavorites(getState())
            }).catch( err => { 
                console.error(err);
                dispatch({
                    type: GET_FAVS_ERROR,
                    payload: err.message
                })
            })
    
}


// agregar favoritos
export let addToFavoritesAAction = () => (dispatch, getState) => { 
    // obetener los datos del initialState
    let { array, favorites } =  getState().characters;
    // se obtiene el uid, para firebase.
    let { uid } = getState().user;
    // obtener el indice del arreglo 
    let char = array.shift();
    // concatenar en favortes el indice del aarreglo obtenido con el shift.
    favorites.push(char);
    // se hace uso de la funcio npara almaacenar datos en firestore.
    updateDB(favorites, uid);
    dispatch({
        type: ADD_TO_FAVORITES,
        //  igual se desconstriuir para que no se confunda redux con la actualizacion del arreglo
        //*  payload: {array, favorites}
        payload: { array: [...array], favorites: [...favorites] }
    })
}

//  remover los personajes de Rick y Morty 
export let removeCharacterAction = () => (dispatch, getState) => {
    //* el getState obtiene todos los state de redux.
    // se hace el destructiring para obtener el arreglo  
    let { array } = getState().characters;

    // el shift() es para remover un index
    array.shift();
    dispatch({
        type: REMOVE_CHARACTER,
        // devolvemos el arreglo pero ya sin el indice del arreglo que se removio
        // se muto es decir obtuvo el nuevo arreglo.
        //  con las [] estamos deconstruyendo, para que redux no se confuinda con la inmutabilidad
        payload: [...array]
    })
}
// una funcion que devuelve una funcion :/ :D 
export const getCharacterActions = () => (dispatch, getState) => { 
    dispatch({
        type: GET_CHARACTERS
    })
    return axios.get(URL)
           .then( res => {               
               dispatch({ 
                   // laa aaccion del reducer 
                   type: GET_CHARACTERS_SUCCESS,
                   // la respuesta de la API
                   payload: res.data.results
               })
           }).catch( err => {
               console.log(err);
               dispatch({
                   type: GET_CHARACTERS_ERROR,
                   payload: err.response.message
               })
           })
}
