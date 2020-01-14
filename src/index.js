import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter } from 'react-router-dom'
import 'font-awesome/css/font-awesome.css'
//* importacion de  Provider que no es redux, si no un complemento.
import { Provider } from 'react-redux';
import generateStore from './redux/store';
// importacion de grapqhl y apollo
import  ApolloClient  from 'apollo-boost';
import { ApolloProvider } from 'react-apollo';

// vaariable para pasar el generateStore
let store = generateStore();

// uri para conectar con grapqhl en el navegador.
let client = new ApolloClient({ 
    uri: 'https://rickandmortyapi.com/graphql'
})

let WithRouter = () => <BrowserRouter><App /></BrowserRouter>
let WithStore = () => <Provider store={store}> <WithRouter /></Provider>
// conexion grapqhl y redux, creacon de aun provedopr de graphql
let WithApollo = () => <ApolloProvider client={client} > <WithStore /></ApolloProvider>

ReactDOM.render(<WithApollo />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
