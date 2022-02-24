import React, { Component } from 'react';
import "./vacations.css";
import { Vacation } from '../../models/vacation';
import { ActionType } from '../../redux/actionType';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import { User } from '../../models/user';
import 'react-day-picker/lib/style.css';
import io from 'socket.io-client'
import VacationCard from '../vacationCard/vacationCard';

let socket: any;

interface vacationsState {
    vacations: Vacation[];
    isLogged: boolean;
    user: User;
}

export class Vacations extends Component<any, vacationsState> {
    private unsubscribestore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            isLogged: store.getState().isLogged,
            user: store.getState().user
        };
        this.unsubscribestore = store.subscribe(() =>
            this.setState({
                vacations: store.getState().vacations,
                isLogged: store.getState().isLogged,
                user: store.getState().user
            }));
    }
    public componentWillUnmount(): void {
        this.unsubscribestore();
        socket.disconnect();
    }

    shouldComponentUpdate(nextProps: any, nextState: any) {
        return nextState.vacations !== this.state.vacations;
    }
    componentDidUpdate() {

    }
    componentDidMount(): void {
        socket = io.connect("http://localhost:3002")
        socket.on("admin-made-changes", (vacations: Vacation[]) => {
            const action = { type: ActionType.GetAllVacations, payload: vacations };
            store.dispatch(action);
        })
        if (localStorage.user || localStorage.admin) {
            if (localStorage.user) {
                fetch("http://localhost:3001/api/vacations")
                    .then(response => response.json())
                    .then(vacations => {
                        const action = { type: ActionType.GetAllVacations, payload: vacations };
                        store.dispatch(action);
                    })
                    .catch(err => alert(err));
            } else {
                this.props.history.push("/admin");

            }

        } else {
            this.props.history.push("/login");
        }
        this.setState({
            vacations: store.getState().vacations,
            isLogged: store.getState().isLogged
        });

    }

    public returnFollow() {
        let locations: any = [];
        if (this.state.vacations) {
            this.state.vacations.map(v => {
                v.location = v.location.replace(/ /g, '').replace(",", "");
                locations.push(v.location)
                return "Hey"
            })
            if (locations) {
                for (let item of locations) {
                    const followClass: any = document.getElementById(item);
                    const iS = followClass.children[1].children[0].children[0].children[0].checked;
                    if (iS) {
                        followClass.className = "card  true";
                    } else {
                        followClass.className = "card  false";
                    }
                }
            }
        }
    }

    render(): JSX.Element {
        return (
            <div className="vacations ">
                <h1 className="title">Press On The Switch To Subscribe to a Vacation!</h1>
                <div className="container">
                    {this.state.vacations.map((v: Vacation) => {
                        return (
                            <VacationCard begin={v.begin} location={v.location} description={v.description}
                                end={v.end} price={v.price} vacationID={v.vacationID} userID={this.state.user.userID}
                                key={v.location} imageName={v.imageName} />
                        )
                    })}
                </div>
            </div>
        )
    }
}