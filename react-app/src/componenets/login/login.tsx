import React, { Component } from 'react'
import "./login.css"
import { NavLink } from 'react-router-dom'
import { User } from '../../models/user'
import { store } from '../../redux/store';
import { ActionType } from '../../redux/actionType';
import { Unsubscribe } from 'redux';
import { apiRequest } from '../../tools/tools';

interface LoginState {
    users: User[];
    user: User;
    isLogged: boolean;
    errors: {
        userNameError: string,
        passwordError: string
    }
}



export default class Login extends Component<any, LoginState> {
    private unsubscribestore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            users: store.getState().users,
            user: new User(),
            isLogged: store.getState().isLogged,
            errors: {
                userNameError: "*",
                passwordError: "*"
            }
        };
        this.unsubscribestore = store.subscribe(() =>
            this.setState({ users: store.getState().users }));
    }
    public componentWillUnmount(): void {
        this.unsubscribestore();
    }

    componentDidMount(): void {

        if (!this.state.isLogged) {
            fetch("http://localhost:3001/api/users")
                .then(response => response.json())
                .then(users => {
                    const action = { type: ActionType.GetAllUsers, payload: users };
                    store.dispatch(action);
                })

        } else {
            this.props.history.push("/vacations");

        }

    }
    render() {
        return (
            <div className="login">
                <h1>Login:</h1>
                <div className="login-box">
                    <table>
                        <tbody>
                            <tr>
                                <td><label>User Name:</label></td>
                                <td><input type="text" id="userName" placeholder="Between 5-12 Characters"
                                    className="input-pink" onChange={this.setUser} value={this.state.user.userName} />
                                    <span>{this.state.errors.userNameError}</span> </td>
                            </tr>
                            <tr>
                                <td><label>Password:</label></td>
                                <td><input type="password" id="login-pass" placeholder="Between 5-12 Characters "
                                    onChange={this.setPass} value={this.state.user.password} className="input-pink" />
                                    <span>{this.state.errors.passwordError}</span ></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td><button className="btn-orange " onClick={this.submitForm}>Login</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <br />

                    <NavLink to="/register" exact activeClassName="active-link" className="btn btn-pink">Register</NavLink>
                </div>
            </div>
        )

    }

    private setUser = (e: any) => {
        const userName = e.target.value;
        let errMessage = "";

        if (userName === "") {
            errMessage = "*";
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        errors.userNameError = errMessage;
        user.userName = userName;
        this.setState({ user, errors });
    }

    private setPass = (e: any) => {
        const password = e.target.value;
        let errMessage = "";

        if (password === "") {
            errMessage = "*";
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        errors.passwordError = errMessage;
        user.password = password;
        this.setState({ user, errors });

    }
    private submitForm = () => {
        const valUser: any = this.state.users.find((u: User) => u.userName === this.state.user.userName);
        if (valUser !== undefined) {
            fetch(`http://localhost:3001/api/users/${valUser.userName}`)
                .then(response => response.json())
                .then(async (user: User) => {
                    if (this.state.user.password === user.password) {
                        const action = { type: ActionType.isLogged, payload: true }
                        store.dispatch(action);
                        user.isLogged = true;
                        if (user.isAdmin === "false") {
                            localStorage.setItem(`user`, JSON.stringify(user))
                            setTimeout(() => {
                                localStorage.removeItem(`user`)
                            }, 1200000);

                            fetch("http://localhost:3001/api/users", {
                                method: "PATCH",
                                headers: {
                                    "Content-Type": "application/json",
                                    "Accept": "application/json"
                                },
                                body: JSON.stringify(user)

                            })
                                .then(patch => {
                                    if (patch) {
                                        const action = { type: ActionType.SetUser, payload: user };
                                        store.dispatch(action);
                                        this.props.history.push("/vacations");
                                    }
                                })


                        } else {
                            localStorage.setItem('admin', JSON.stringify(user))
                            setTimeout(() => {
                                localStorage.removeItem('admin')
                            }, 1200000);
                            const response = await apiRequest(`http://localhost:3001/api/users`, "PATCH", user)
                            if (response) {
                                const action = { type: ActionType.SetUser, payload: user };
                                store.dispatch(action);
                                this.props.history.push("/admin");
                            } 
                        }
                    } else {
                        alert("Password Or User Is Incorrect!")
                    }
                })

        } else {
            alert("Password Or User Is Incorrect!")
        }
    }
}