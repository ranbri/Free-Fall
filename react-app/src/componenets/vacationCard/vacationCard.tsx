import React, { Component } from 'react'
import "./vacationCard.css"
import Follow from '../follow/follow'
import DayPicker from 'react-day-picker'
import NumberFormat from 'react-number-format';


interface VacationCardProps {
    location: string;
    vacationID: number;
    userID: number;
    description: string;
    begin: Date;
    end: Date;
    price: number;
    imageName: string;
}

interface VacationCardState {
    isFollowing: boolean;
}
export default class VacationCard extends Component<VacationCardProps, VacationCardState> {
    constructor(props: any) {
        super(props)
        this.state = {
            isFollowing: false
        }
    }


    public returnFollow(checked: boolean) {
        if (checked) {
            this.setState({ isFollowing: checked })
        }
    }
    render() {
        const from = new Date(this.props.begin);
        const to = new Date(this.props.end);
        const modifiers = { start: from, end: to };
        return (
            <div className={`card ${this.state.isFollowing ? "following" : "not-following"}`}
                key={this.props.location} id={this.props.location.replace(/ /g, '').replace(",", "")}>
                <div className="card__image-container">
                    <img className="card__image" src={require(`../../../../server/assets/images/${this.props.imageName}`)} alt="afs" />
                </div>
                <label className="card-switch">
                    <Follow userID={this.props.userID} vacationID={this.props.vacationID}
                        isFollowing={this.returnFollow.bind(this)} />
                </label>
                <div className="card__content" >
                    <h1 className="card__title">{this.props.location}</h1>
                    <p>{this.props.description}.</p>
                    <br />
                    <h1>
                        <NumberFormat value={this.props.price} displayType={'text'} thousandSeparator={true} prefix={'$'} />;
                    </h1>
                    <DayPicker
                        className="Selectable"
                        showOutsideDays month={from}
                        modifiers={modifiers}
                        selectedDays={[from, { from, to }]}
                        disabledDays={{
                            daysOfWeek: [0, 1, 2, 3, 4, 5, 6]
                        }} />
                </div>
            </div>
        )
    }
}
