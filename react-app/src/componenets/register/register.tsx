import React, { Component } from 'react'
import "./register.css"
import { User } from '../../models/user'
import { Unsubscribe } from 'redux';
import { store } from '../../redux/store';

interface RegisterState {
    users: User[];
    user: User;
    errors: {
        firstNameError: string,
        lastNameError: string,
        userNameError: string,
        passwordError: string
    }
}

export default class Register extends Component<any, RegisterState>{
    private unsubscribestore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            users: store.getState().users,
            user: new User(),
            errors: {
                firstNameError: "*",
                lastNameError: "*",
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


    render() {
        return (
            <div className="register">
                <h1>Register:</h1>
                <div className="register-box">
                    <table>
                        <tbody>
                            <tr>
                                <td><label>First Name:</label></td>
                                <td><input type="text" id="register-firstName" placeholder="Between 2-20 Characters"
                                onChange={this.setFirstName}  />
                                <span>{this.state.errors.firstNameError}</span ></td>
                            </tr>
                            <tr>
                                <td><label>Last Name:</label></td>
                                <td><input type="text" id="register-lastName" placeholder="Between 2-20 Characters"
                                onChange={this.setLastName}  />
                                <span>{this.state.errors.lastNameError}</span ></td>
                            </tr>
                            <tr>
                                <td><label>User Name:</label></td>
                                <td><input type="text" id="register-userName" placeholder="Between 6-14 Characters"
                                onChange={this.setUser} />
                                <span>{this.state.errors.userNameError}</span ></td>
                            </tr>
                            <tr>
                                <td><label>Password:</label></td>
                                <td><input type="password" id="register-pass" placeholder="Between 6-14 Characters" 
                                onChange={this.setPass} />
                                <span>{this.state.errors.passwordError}</span ></td>
                            </tr>
                            <tr>
                                <td></td>
                                <td> <button className="btn-orange btn" onClick={this.registerUser}>Register</button></td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                </div> </div>
        )
    }
    private setFirstName = (e: any) => {

        const firstName = e.target.value;
        let errMessage = "";
        if (firstName.length > 20 || firstName.length < 2) {
            errMessage = "*";
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        errors.firstNameError = errMessage;
        user.firstName = firstName;
        this.setState({ user, errors });

    }
    private setLastName = (e: any) => {
        const lastName = e.target.value;
        let errMessage = "";

        if (lastName.length > 20 || lastName.length < 2) {
            errMessage = "*";
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        errors.lastNameError = errMessage;
        user.lastName = lastName;
        this.setState({ user, errors });

    }
    private setUser = (e: any) => {
        const userName = e.target.value;
        let errMessage = "";

        if (userName.length > 14 || userName.length < 5) {
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

        if (password.length >= 14 || password.length < 5) {
            errMessage = "*";
        }
        const user = { ...this.state.user };
        const errors = { ...this.state.errors };
        errors.passwordError = errMessage;
        user.password = password;
        this.setState({ user, errors });

    }
    private registerUser = ():void => {
        if (this.state.errors.firstNameError === "*") {
            alert("First Name IS Not Valid")
            return
        }
        if (this.state.errors.lastNameError === "*") {
            alert("Last Name IS Not Valid")
            return
        }
        if (this.state.errors.passwordError === "*") {
            alert("Password IS Not Valid")
            return
        }
        if (this.state.errors.userNameError === "*") {
            alert("UserName IS Not Valid")
            return
        }
        const valUser = this.state.users.find((u: User) => u.userName === this.state.user.userName);
        if(valUser === undefined){
        fetch("http://localhost:3001/api/users", {
            method:"POST",
            headers:{
                "Content-Type": "application/json",
                "Accept":"application/json"
            },
            body: JSON.stringify(this.state.user)
            
        })
        .then(response => response.json())
        .then(user => {
            alert("New User Has Been Added :" + user.userName)
            this.props.history.push("/login");

        })
        .catch(err => alert(err))
        }else {
            alert("User Name is already taken")
            
        }

     
    }
}
