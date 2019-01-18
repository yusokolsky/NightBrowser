require('babel-register');
import React from 'react';
import { Route, Redirect } from 'react-router';

export default (
    <Route>
            <Route>
                    <Route exact path="/"  />
                    <Route path="/User/:id" />
                    <Route path="/Event/:id"  />
                    <Route path="/User/:id/edit" />
                    <Route path="/CreateEvent"  />
                    <Route path="/CreateChat"  />
                    <Route path="/SearchEvent"  />
                    <Route path="/Chats" />
                    <Route path="/Chats/:id"  />
            </Route>
    </Route>
);