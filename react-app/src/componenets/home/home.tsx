import React, { Component } from 'react'
import "./home.css"
import { NavLink } from 'react-router-dom'
export default class Home extends Component {
    render() {
        return (
            <div className="home">

                <header className="header">

                    <div className="logo-box">
                        <img src={require('../../assets/logos/logo.png')} alt="Logo" className="logo" />
                    </div>
                    <div className="text-box">
                        <h1 className="heading-primary">
                            <span className="heading-primary-main">Free Fall</span>
                            <span className="heading-primary-sub">is where life happens</span>
                        </h1>
                        <NavLink to="/vacations" exact activeClassName="active-link"
                            className="btn btn-white">Discover out Vacations</NavLink>

                        <div className="display">
                            <h2>Choose A Vacation </h2>
                            <i className="fa fa-arrow-right"></i>
                            <h2>Subscribe</h2>
                            <i className="fa fa-arrow-right"></i>
                            <h2>Stay Updated!</h2>
                        </div>
                    </div>

                </header>
            </div>
        )
    }


}
