import React, { useEffect, useState } from 'react';
import Card from '../card/Card';
import { gql } from 'apollo-boost';
import { useQuery } from 'react-apollo'

export default function GraphHome() {

    let [char, setChars] = useState([])

    let query = gql`
            {
                characters{ 
                    results{
                      name
    	              image
                    }
                }
            }
        `
    let { data, loading, error } = useQuery(query);

    useEffect(() => { 
        // decimos que si tiene data informacion y loading estaa en false y no tiene error, entonces.
        if(data && !loading && !error) { 
            /// obtiene los datos y los almacena en la varibable de tipo useState
            setChars([...data.characters.results]);
        }
    }, [data]);

    // funcion que elimina los actores y hace del useState
    function nextCharacter() {
        char.shift();
        setChars([...char]);
    }

    /// si loading estaa en true no tiene datos y esta cargando
    if(loading) return <h2>Cargando...</h2>
    return (
        <Card
        leftClick={nextCharacter} 
        {...char[0]}
        />
    )
}