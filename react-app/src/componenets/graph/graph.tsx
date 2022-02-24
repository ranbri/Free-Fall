import React, { Component } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import "./graph.css";
import { NavLink } from 'react-router-dom';

interface GraphState {
    data: [{}];
}
export default class Graph extends Component<any, GraphState> {
    public constructor(props: any) {
        super(props)
        this.state = {
            data: [{}]
        }
    }


    componentDidMount(): void {
        if (!localStorage.admin) {
            this.props.history.push("/vacations");
        }
        fetch("http://localhost:3001/api/followers")
            .then(response => response.json())
            .then(data => {
                this.setState({ data })
            })
    }

render() { 
    return (
        <div className="graph" >
             <NavLink to="/admin" exact activeClassName="active-link"
                            className="btn btn-white"> &#8592;  Back</NavLink>
            <div className="container-graph" style={{ width: '100%', height: 300 }}>
                <ResponsiveContainer>
                    <BarChart width={900} height={500} data={this.state.data}>
                        <XAxis dataKey="location" stroke="#333" />
                        <YAxis />
                        <Tooltip />
                        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
                        <Bar dataKey="followers" fill="#0088d1" barSize={30} />
                    </BarChart>
                </ResponsiveContainer >
            </div>
        </div>
    )
}
}
