import React, { Component } from 'react'
import "./follow.css"
import { Follower } from '../../models/follower';

interface FollowState {
    isFollowing: boolean;
}
interface FollowProp {
    userID: any;
    vacationID: any;
    isFollowing: any;

}
export default class Follow extends Component<FollowProp, FollowState> {
    public constructor(props: any) {
        super(props);
        this.state = {
            isFollowing: false
        };
    }

    public componentDidMount = () => {
        fetch(`http://localhost:3001/api/followers/${this.props.userID}`)
            .then(response => response.json())
            .then((follows): any => {
                let arr: any = [];
                follows
                    .map((f: { vacationID: any; }) => arr.push(f.vacationID));
                arr.filter((e: any) => e === this.props.vacationID);
                for (let item of arr) {
                    item = item.toString()
                    let card: any = document.getElementById(item)
                    card.checked = true;
                    if (item === this.props.vacationID.toString()) {
                        this.props.isFollowing(true)
                    }
                }
            });

    }


    public isFollowing = (e: any): any => {
        const follower = new Follower(this.props.vacationID, this.props.userID);
        if (e.target.checked) {
            fetch("http://localhost:3001/api/followers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(follower)
            })
            this.props.isFollowing(true)

        } else {
            fetch("http://localhost:3001/api/followers", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(follower)

            })
                .catch(err => alert(err))
            this.setState({ isFollowing: false })
            setTimeout(() => {
                this.props.isFollowing(false)
            }, 100);
        }

    }






    render() {
        return (
            <div className="follow">
                <div className="wrapper">
                    <input type="checkbox" name="checkbox"
                        className={`switch`} onChange={this.isFollowing} id={this.props.vacationID.toString()}
                    />
                </div>
            </div>
        )
    }
}
