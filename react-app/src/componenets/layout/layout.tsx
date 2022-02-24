import React, { Component } from 'react'
import "./layout.css"
import Login from '../login/login'
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'
import Register from '../register/register'
import Home from '../home/home'
import { Vacations } from '../vacations/vacations'
import Nav from '../nav/nav'
import { Admin } from '../admin/admin'
import { ActionType } from '../../redux/actionType'
import { store } from '../../redux/store'
import { Page404 } from '../page404/page404'
import Graph from '../graph/graph'


export default class Layout extends Component {


    componentDidMount(): void {
        if (localStorage.user) {
            const user = JSON.parse(localStorage.user);
            fetch(`http://localhost:3001/api/users/${user.userName}`)
                .then(response => response.json())
                .then(user => {
                    const secondAction = { type: ActionType.isLogged, payload: true };
                    store.dispatch(secondAction);
                    const action = { type: ActionType.SetUser, payload: user };
                    store.dispatch(action);
                });
        }
    }


    render() {
        return (
            <div className='layout'>
                <BrowserRouter>
                    <nav>
                        <Nav></Nav>
                    </nav>
                    <main>
                        <Switch>
                            <Route path="/login" component={Login} exact />
                            <Route path="/register" component={Register} exact />
                            <Route path="/vacations" component={Vacations} exact />
                            <Route path="/admin" component={Admin} exact />
                            <Route path="/home" component={Home} exact />
                            <Route path="/graph" component={Graph} exact />
                            <Redirect from="/" to="/home" exact />
                            <Route component={Page404} />
                        </Switch>
                    </main>
                </BrowserRouter>
            </div>
        )
    }


}
