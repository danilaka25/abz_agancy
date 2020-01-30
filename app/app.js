import '@babel/polyfill'

import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './app'

import { Provider } from 'react-redux';
import { store } from './redux/configs/createStore';


import  Users  from './components/Users'
import  Form  from './components/Form'

import './styles/index.scss'


import jQuery from 'jquery';
import popper from 'popper.js';
import bootstrap from 'bootstrap';


 



/* jQuery(function() {
    jQuery('body').css('color', 'blue');
});
 */


ReactDOM.render(
  <Provider store={store}>
	<Form/>
  </Provider>,
  document.getElementById('form')
)


ReactDOM.render(
  <Provider store={store}>	
	<Users/>
  </Provider>,
  document.getElementById('users')
)
