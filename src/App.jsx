import React from 'react';

import ReactDOM from 'react-dom';

import { Router, Route, Redirect, hashHistory ,browserHistory} from 'react-router';

import MainPage from './MainPage.jsx'
import CreateEvent from './CreateEvent.jsx'
import CreateChat from './CreateChat.jsx'
import UserProfile from './UserProfile.jsx'
import EventPage from './EventPage.jsx'
import UserProfileEdit from './UserProfileEdit.jsx'
import SearchPage from './SearchEvents.jsx'
import ChatsPage from './ChatsPage.jsx'
import Chats from './Chats.jsx'
const NoMatch = () => <h2>No match to the route</h2>;
const NoSuchRoute = () => <h2>Не найдено</h2>;
ReactDOM.render(
    (
        <Router history={browserHistory}>
            <Route exact path="/" component={MainPage} />
            <Route path="/404" component={NoSuchRoute} />
            <Route path="/User/:id" component={UserProfile} />
            <Route path="/Event/:id" component={EventPage} />
            <Route path="/User/:id/edit" component={UserProfileEdit} />
            <Route path="/CreateEvent" component={CreateEvent} />
            <Route path="/CreateChat" component={CreateChat} />
            <Route path="/SearchEvent" component={SearchPage} />
            <Route path="/Chats" component={Chats} />
            <Route path="/Chats/:id" component={ChatsPage} />
            <Route path="*" component={NoMatch} />
            <Route path="*" component={NoMatch} />
        </Router>

    ),
    document.getElementById('main'))


