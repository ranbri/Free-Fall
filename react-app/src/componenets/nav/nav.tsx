import React, { Component } from 'react'
import "./nav.css"
import { User } from '../../models/user';
import { NavLink, Redirect } from 'react-router-dom';
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';
import { ActionType } from '../../redux/actionType';

interface NavState {
    user: User;
    isLogged: boolean;
}

export default class Nav extends Component<any, NavState> {
    private unsubscribestore: Unsubscribe;


    public constructor(props: any) {
        super(props);
        this.state = {
            user: store.getState().user,
            isLogged: store.getState().isLogged

        };
        this.unsubscribestore = store.subscribe(() =>
            this.setState({ isLogged: store.getState().isLogged, user: store.getState().user }));
    }
    componentDidMount() {
       
        
            if (localStorage.admin) {
                const user = JSON.parse(localStorage.admin);
                fetch(`http://localhost:3001/api/users/${user.userName}`)
                    .then(response => response.json())
                    .then(user => {
                        const action = { type: ActionType.SetUser, payload: user };
                        store.dispatch(action);
                        const secondAction = { type: ActionType.isLogged, payload: true };
                        store.dispatch(secondAction);
                    });
                this.setState({ user: store.getState().user });
            } 
                if(localStorage.user){
                const user = JSON.parse(localStorage.user);
                fetch(`http://localhost:3001/api/users/${user.userName}`)
                    .then(response => response.json())
                    .then(user => {
                        const action = { type: ActionType.SetUser, payload: user };
                        store.dispatch(action);
                        const secondAction = { type: ActionType.isLogged, payload: true };
                        store.dispatch(secondAction);
                    });
                this.setState({ user: store.getState().user });            
        }
    }

    public componentWillUnmount(): void {
        this.unsubscribestore();
    }
    public isLogged() {

        if (this.state.isLogged) {
            return (
                <div className="navDiv">
                    <label id="userLabel"> Hello {this.state.user.userName}</label> &nbsp;
                <NavLink to="/home" exact activeClassName="active-link" className=" nav-btn" onClick={this.remove} >Log Out </NavLink>
                </div>)
        } else {
            return <NavLink to="/login" exact activeClassName="active-link" className=" nav-btn" >Log In </NavLink>
        }
    }

    private remove = () => {
        const action = { type: ActionType.isLogged, payload: false };
        store.dispatch(action);
        const secondAction = { type: ActionType.SetUser, payload: new User() }
        store.dispatch(secondAction);
        const user = { ...this.state.user };
        user.isLogged = "false";
        this.setState({ user });
        fetch("http://localhost:3001/api/users", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(user)

        })
            .catch(err => alert(err))
        localStorage.removeItem(`user`);
        if (this.state.user.userName === "admin") {
            localStorage.removeItem('admin');
        }
        const userLabel = document.getElementById("userLabel");
        if (userLabel) {
            userLabel.innerText = "";
        }
        return <Redirect to="/" />;
    }

    render() {
        return (
            <div className="nav" >
                <NavLink to="/home" exact activeClassName="active-link" className=" nav-btn">Home</NavLink>
                &nbsp;
                {this.isLogged()}
            </div>
        )
    }
}
