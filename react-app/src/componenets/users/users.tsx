import React, { Component } from 'react'
import { User } from '../../models/user';
import { ActionType } from '../../redux/actionType';
import { store } from '../../redux/store';
import { Unsubscribe } from "redux";

interface usersState {
    users: User[];
}
export default class Users extends Component<any, usersState> {
    private unsubscribestore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            users: store.getState().users
        };
        this.unsubscribestore = store.subscribe(() =>
            this.setState({ users: store.getState().users }));
    }
    public componentWillUnmount():void {
        this.unsubscribestore();
    }

    componentDidMount(): void {
        fetch("http://localhost:3001/api/users")
            .then(response => response.json())
            .then(users => {
                const action = { type: ActionType.GetAllUsers, payload: users };
                store.dispatch(action);
            })
            .catch(err => alert(err));

    }
    render() {
        return (
            <div className="users">
    
            </div>
        )
    }
}
