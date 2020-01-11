import React from 'react'
import Card from '../card/Card'
import styles from './home.module.css'

/// esta importacion hace que haga la coneccion con redux.
import { connect } from 'react-redux';
import { removeCharacterAction, addToFavoritesAAction } from '../../redux/charsDuck';

// una vez que se declaare en el conect la accion o store se pasa por props en el 
// componente para  utilizarlo en el html
 function Home({chars, addToFavoritesAAction, removeCharacterAction}) {
   // console.log(chars);
    
    // let [chars, setChars] = useState([])

    // useEffect(() => {
    //     getCharacters()
    // }, [])

    // function nextChar() {
    //     chars.shift()
    //     if (!chars.length) {
    //         //get more characters
    //     }
    //     setChars([...chars])
    // }

    function renderCharacter() {
        let char = chars[0]
        return (
            <Card 
            rightClick={addToFavoritesAAction}
            leftClick={nextCharacter}  {...char} />
        )
    }

    function nextCharacter() {
        removeCharacterAction()
    }

    // function getCharacters() {
    //     return axios.get(`${URL}/character`)
    //         .then(res => {
    //             setChars(res.data.results)
    //         })
    // }

    return (
        <div className={styles.container}>
            <h2>Personajes de Rick y Morty</h2>
            <div>
                {renderCharacter()}
            </div>
        </div>
    )
}

//  esta funcion es un mapeo que permite obtener el store, o state de redux.
function mapState(state) {
    return { 
        // primero se declare variable y  el tipo que va a tener en este caso proviene de redux del state
        // en este caso se obtiene un arreglo  de los personajes.
        chars: state.characters.array
    }
}
 

/// con el conect se realiza la conexion hacia redux.
/// dentro de la funcion connect puede ir el reducer aguna accion (STORE), o bien un dispatch
export default connect(mapState, {addToFavoritesAAction, removeCharacterAction })(Home)