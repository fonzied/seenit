import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import AppRouter, { history } from './routers/AppRouter';
import configureStore from './store/configureStore';
import { login, logout } from './actions/auth';
import 'normalize.css/normalize.css';
import './styles/styles.scss';
import 'react-dates/lib/css/_datepicker.css';
import { firebase } from './firebase/firebase';
import LoadingPage from './components/LoadingPage';
import { fireGetPosts } from './actions/posts';
import { fireGetInfo } from './actions/profile'
import { fireGetSeens } from './actions/seens'
import db from './firebase/firebase';

const store = configureStore();
const jsx = (
  <Provider store={store}>
    <AppRouter />
  </Provider>
);
let hasRendered = false;
const renderApp = () => {
  if (!hasRendered) {
    ReactDOM.render(jsx, document.getElementById('app'));
    hasRendered = true;
  }
};

ReactDOM.render(<LoadingPage />, document.getElementById('app'));

firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    store.dispatch(login(user.uid));
    store.dispatch(fireGetSeens())
    store.dispatch(fireGetPosts())
    store.dispatch(fireGetInfo()).then(() => {
      renderApp();
    })
    if (history.location.pathname === '/login' || '/create' || '/s/*') {
      history.push('/');
    }
  } else {
    store.dispatch(logout())
    store.dispatch(fireGetPosts())
    store.dispatch(fireGetSeens()).then(() => {
      renderApp();
      history.push('/');
    })
  }
});
