import React from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'
import Home from './components/home/HomePage'
import FavPage from './components/favs/FavPage'
import LoginPage from './components/login/LoginPage'
import GraphHome from './components/home/GraphHome'

// funcion para proteger las rutas middleware
function PrivateRoute({ path, component, ...rest }) {
    // primero obtenemos lo que se tiene een el localstorage
    let storage = localStorage.getItem('storage')
    storage = JSON.parse(storage)
    // si existe la variable storage y si existe el user en el storage 
    // entonces mostrar  lasa rutas Home, FavPAge 
    if (storage && storage.user) {
       return <Route path={path} component={component} {...rest} />
    } else {
        return <Redirect to="/login" {...rest} />
    }
}

export default function Routes() {
    return (
        <Switch>
            {/* <PrivateRoute exact path="/" component={GraphHome} /> */}
            <PrivateRoute exact path="/" component={Home}  />
            <PrivateRoute path="/favs" component={FavPage} />
            <Route path="/login" component={LoginPage} />
        </Switch>
    )
}