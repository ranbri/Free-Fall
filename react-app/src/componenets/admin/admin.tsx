import React, { Component } from 'react';
import "./admin.css";
import { Vacation } from '../../models/vacation';
import { ActionType } from '../../redux/actionType';
import { store } from '../../redux/store';
import { Unsubscribe } from 'redux';
import { User } from '../../models/user';
import DayPicker from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import { NavLink } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
let socket: any;

const displayNone: any = { display: "none" };
const displayBlock: any = { display: "block" };
interface AdminState {
    vacations: Vacation[];
    vacation: Vacation;
    isLogged: boolean;
    admin: User;
    click: boolean;
    image: any;
    imageName: any;
    errors: {
        locationError: string,
        descriptionError: string,
        beginError: string,
        endError: string,
        priceError: string,
        imageError: string
    }
}

export class Admin extends Component<any, AdminState> {
    private unsubscribestore: Unsubscribe;

    public constructor(props: any) {
        super(props);
        this.state = {
            vacations: store.getState().vacations,
            vacation: new Vacation(),
            isLogged: store.getState().isLogged,
            admin: store.getState().user,
            click: false,
            image: undefined,
            imageName: undefined,
            errors: {
                locationError: "*",
                descriptionError: "*",
                beginError: "*",
                endError: "*",
                priceError: "*",
                imageError: "*"
            }
        };
        this.unsubscribestore = store.subscribe(() =>
            this.setState({
                vacations: store.getState().vacations,
                isLogged: store.getState().isLogged,
                admin: store.getState().user
            }));
    }
    componentDidMount(): void {


        socket = io.connect("http://localhost:3002")
        socket.on("admin-made-changes", (vacations: Vacation[]) => {
            const action = { type: ActionType.GetAllVacations, payload: vacations };
            store.dispatch(action);
        })
        if (localStorage.admin) {
            fetch("http://localhost:3001/api/vacations")
                .then(response => response.json())
                .then(vacations => {
                    const action = { type: ActionType.GetAllVacations, payload: vacations };
                    store.dispatch(action);
                })
                .catch(err => alert(err));
        } else {
            if (localStorage.user) {
                this.props.history.push("/vacations");
            } else {
                this.props.history.push("/login");
            }
        }

    }


    public componentWillUnmount(): void {
        this.unsubscribestore();
        socket.disconnect();
    }
    private setEditBegin = (e: any) => {
        let today: any = new Date(); let dd = today.getDate(); let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        today = yyyy + '-' + mm + '-' + dd;

        if (e.target.value < today) {
            e.target.value = today;
            e.target.style.border = "red 2px solid";
        } else {
            e.target.style.border = "gray 2px solid"
        }
    }
    private setEditEnd = (e: any) => {
        let today: any = new Date(); let dd = today.getDate(); let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        today = yyyy + '-' + mm + '-' + dd;
        const begin = e.target.parentElement.children[0].value;
        if (e.target.value < begin) {
            e.target.value = begin;
            e.target.style.border = "red 2px solid";
        } else {
            e.target.style.border = "gray 2px solid"
        }
    }

    private editable = (e: any): void => {
        const id = +e.target.id;
        const vacation: any = this.state.vacations.find((v: Vacation) => v.vacationID === id);
        const div: any = e.target.parentElement.parentElement.children[2];
        const input: any = e.target;
        const title = div.children[1];
        const description = div.children[2];
        const beginDate = div.children[4].firstChild;
        const endDate = div.children[4].children[1];
        const calender = div.children[4].children[2];
        const price = div.children[3].children[0];
        const image = div.children[5].children[2];
        const FUP: any = div.children[5];
        if (beginDate.value === "00/00/000" || beginDate.value === undefined) {
            input.disabled = true;
        }

        if (input.checked) {
            div.style.color = "lightgray";
            title.style.color = "lightgray";
            div.style.textDecoration = "underline dotted red";
            title.style.textDecoration = "underline dotted red";
            beginDate.style.display = "block";
            endDate.style.display = "block";
            calender.style.display = "none";
            title.setAttribute("contentEditable", true);
            description.setAttribute("contentEditable", true);
            price.setAttribute("contentEditable", true);
            FUP.style.display = "block"
        } else {
            if (image.files[0]) {

                let formData = new FormData();
                formData.append("image", image.files[0]);
                axios({
                    url: "http://localhost:3001/upload-image",
                    method: "POST",
                    data: formData
                })
                    .then((newImgName) => {
                        console.log("Success");
                        store.getState().adminChanged = true;
                        let name = newImgName.data.split("\\")
                        name = name[name.length - 1]
                        vacation.imageName = name;
                        this.setState({ vacation });
                    })
                    .catch(err => console.log(err))
                    ;

            }
            vacation.location = title.innerHTML;
            vacation.description = description.innerHTML;
            vacation.begin = beginDate.value;
            vacation.end = endDate.value;
            vacation.price = price.innerHTML;
            setTimeout(() => {
                this.setState({ vacation });
                fetch("http://localhost:3001/api/vacations/" + id, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify(vacation)
                })
                    .then(() => {
                        socket.emit("update-all");
                    })
                    .catch(err => alert(err));
            }, 200);

            beginDate.style.display = "none";
            endDate.style.display = "none";
            calender.style.display = "block";
            FUP.style.display = "none"
            div.style.color = "white";
            title.style.color = "white";
            div.style.textDecoration = "none";
            title.style.textDecoration = "none";
            title.setAttribute("contentEditable", false);
            description.setAttribute("contentEditable", false);

        }


    }
    private deleteModal = (e: any) => {
        e.target.style.color = "transparent";
        e.target.style.border = "transparent";
        e.target.style.cursor = "default";
        const target: any = e.target.parentElement.children[1];
        target.style.display = "block";
    }
    private NO = (e: any) => {
        e.target.parentElement.parentElement.children[0].style.color = "white";
        e.target.parentElement.parentElement.children[0].style.border = "white 0.6px solid";
        e.target.parentElement.parentElement.children[0].style.cursor = "pointer";
        const target: any = e.target.parentElement.parentElement.children[1];
        target.style.display = "none";
    }
    private deleteVacation = (e: any) => {
        const id: number = +e.target.parentElement.parentElement.parentElement.children[2].children[0].id;
        fetch("http://localhost:3001/api/vacations/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
        })
            .then(() => {
                socket.emit("update-all");
                store.getState().adminChanged = true;
            })
            .catch(err => alert(err));
        fetch("http://localhost:3001/api/followers/" + id, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            }
        })
            .catch(err => alert(err));
    }

    public showAdd() {
        const addCard: any = document.getElementById("addCard");
        addCard.style.display = "block"

    }
    public hideAdd() {
        const addCard: any = document.getElementById("addCard");
        addCard.style.display = "none";
        const location: any = document.getElementById("location")
        const description: any = document.getElementById("description")
        const begin: any = document.getElementById("begin")
        const end: any = document.getElementById("end")
        const price: any = document.getElementById("price")
        location.value = '';
        description.value = '';
        begin.value = new Date();
        end.value = new Date();
        price.value = "";
    }

    public uploadImage(): void {
        const image = this.state.image;
        let formData = new FormData();
        formData.append("image", image);
        axios({
            url: "http://localhost:3001/upload-image",
            method: "POST",
            data: formData
        })
            .then((newImgName) => {
                console.log("Success");
                store.getState().adminChanged = true;
                let name = newImgName.data.split("\\")
                name = name[name.length - 1]
                this.setState({ imageName: name })
            })
            .catch(err => console.log(err))
        setTimeout(() => {
            console.log("State = " + this.state.imageName)
        }, 1000);

    }


    public addNewVacation = async () => {

        if (this.state.errors.locationError === "*") {
            alert("Location IS Not Valid")
            return
        }
        if (this.state.errors.descriptionError === "*") {
            alert("Description IS Not Valid")
            return
        }
        if (this.state.errors.beginError === "*") {
            alert("Begin Date IS Not Valid")
            return
        }
        if (this.state.errors.endError === "*") {
            alert("End Date IS Not Valid")
            return
        }
        if (this.state.errors.priceError === "*") {
            alert("Price IS Not Valid")
            return
        }
        if (this.state.errors.imageError === "*") {
            alert("Image Is Not Defined")
            return
        }


        const addCard: any = document.getElementById("addCard");
        const location: any = document.getElementById("location")
        const description: any = document.getElementById("description")
        const begin: any = document.getElementById("begin")
        const end: any = document.getElementById("end")
        const price: any = document.getElementById("price")
        const vacation = { ...this.state.vacation }
        await this.uploadImage();
        setTimeout(() => {
            vacation.imageName = this.state.imageName;
            this.setState({ vacation })
            fetch("http://localhost:3001/api/vacations", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify(this.state.vacation)
            })
                .then(response => response.json())
                .then(vacation => {
                    alert("New Vacation Has Been Added : " + vacation.location)
                    addCard.style.display = "none"
                    this.props.history.push("/admin")
                    socket.emit("update-all");
                    location.value = '';
                    description.value = '';
                    begin.value = new Date();
                    end.value = new Date();
                    price.value = "";
                })
                .catch(err => alert(err + "Fuck"))
        }, 300);
    }



    render(): JSX.Element {
        return (
            <div className="admin ">
                <NavLink to="/graph" exact activeClassName="active-link" className="graph-btn">Graph</NavLink>
                <button className="graph-btn thick-btn" onClick={this.showAdd} >Add Vacation</button>


                <h1 className="title">Check The Box To Edit!</h1>
                <div className="" id="addCard" style={displayNone} onMouseOver={this.disableIn}>
                    <i onClick={this.hideAdd} className="btn graph-btn">Close</i>
                    <form >
                        <table>
                            <tbody>
                                <tr>
                                    <td className="bold table-input">Location:</td>
                                    <td><input type="text" name="location" id="location" placeholder="Country , City"
                                        onChange={this.setLocation} /><span>{this.state.errors.locationError}</span ></td>
                                </tr>
                                <tr>
                                    <td className="bold table-input">Description:</td>
                                    <td><textarea name="description" id="description" cols={18} rows={10}
                                        onChange={this.setDescription}></textarea><span>{this.state.errors.descriptionError}</span ></td>
                                </tr>
                                <tr>
                                    <td className="bold table-input">Begin Date</td>
                                    <td><input type="date" name="begin" id="begin"
                                        onChange={this.setBegin} /><span>{this.state.errors.beginError}</span ></td>
                                </tr>
                                <tr>
                                    <td className="bold table-input">End Date</td>
                                    <td><input type="date" name="end" id="end"
                                        onChange={this.setEnd} /><span>{this.state.errors.endError}</span ></td>
                                </tr>
                                <tr>
                                    <td className="bold table-input">Price</td>
                                    <td><input type="number" name="price" id="price"
                                        onChange={this.setPrice} /><span>{this.state.errors.priceError}</span ></td>
                                </tr>
                                <tr>
                                    <td>
                                    </td>
                                    <td>
                                        <input type="file" accept="image/*" name="userImage" className="image" onChange={this.setImage} />
                                        <span>{this.state.errors.imageError}</span >
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td><button type="button" className="btn-teal" id="send"
                                        onClick={this.addNewVacation}>Add Vacation</button></td>
                                </tr>
                            </tbody>
                        </table>
                    </form>

                </div>
                <div className="container">
                    {
                        this.state.vacations.map((v: Vacation) => {
                            const from = new Date(v.begin);
                            const to = new Date(v.end);
                            const modifiers = { start: from, end: to };
                            const inDateBegin = v.begin.toString().substr(0, 10)
                            const inDateEnd = v.end.toString().substr(0, 10)
                            return (
                                <div className="card-admin" key={v.location + Math.random()} >
                                    <div >
                                        <i className="x" id="x" onClick={this.deleteModal}>X</i>
                                        <div id="deleteModal" style={{ border: "1px solid red", width: "200px", margin: "auto", display: "none" }} >
                                            <p>Are you sure you want to delete this vacation?</p>
                                            <button className="graph-btn" onClick={this.deleteVacation}>Yes</button >
                                            <button className="graph-btn" onClick={this.NO} >No</button>
                                        </div>
                                    </div>
                                    <div className="card__image-container" >
                                        <img className="card__image" src={require("../../../../server/assets/images/" + v.imageName)} alt="afs" />

                                    </div>

                                    <div className="card__content"   >
                                        <input className="edit btn check" type="checkbox" onClick={this.editable} id={v.vacationID.toString()} />
                                        <h1 className="card__title">{v.location}</h1>
                                        <div className="description">
                                            {v.description}
                                        </div>
                                        <p>Price: <label>{v.price}</label>  &#x24;</p>
                                        <div className="date" style={displayBlock}>
                                            <input type="date" name="beginDate" onChange={this.setEditBegin}
                                                defaultValue={inDateBegin} style={displayNone} />
                                            <input type="date" name="endDate" onChange={this.setEditEnd}
                                                defaultValue={inDateEnd} style={displayNone} />
                                            <DayPicker
                                                className="Selectable" showOutsideDays month={from}
                                                modifiers={modifiers}
                                                selectedDays={[from, { from, to }]}
                                            />
                                        </div>
                                        <div id="FUP" style={displayNone}>
                                            <label >Upload New Image</label>
                                            <br />
                                            <input type="file" accept="image/*" name="userImage" />
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        )
    }
    private setImage = (e: any): void => {
        const image = e.target.value;
        let errMessage = "";
        if (image === undefined) {
            errMessage = "*";
        }
        const errors = { ...this.state.errors };
        errors.imageError = errMessage;
        this.setState({ image: e.target.files[0], errors })
    }
    private setLocation = (e: any) => {
        const location = e.target.value;
        let errMessage = "";
        if (location.length > 50 || location.length < 5) {
            errMessage = "*";
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        errors.locationError = errMessage;
        vacation.location = location;
        this.setState({ vacation, errors });

    }
    private setDescription = (e: any) => {
        const description = e.target.value;
        let errMessage = "";
        if (description.length > 200 || description.length < 20) {
            errMessage = "*";
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        errors.descriptionError = errMessage;
        vacation.description = description;
        this.setState({ vacation, errors });

    }
    private disableIn() {
        const begin: any = document.getElementById("begin");
        const end: any = document.getElementById("end");
        if (begin.value === "") {
            end.setAttribute("disabled", "true");
        } else {
            end.removeAttribute("disabled");
        }
    }
    private setBegin = (e: any) => {
        let begin = e.target.value;
        let errMessage = "";
        let today: any = new Date(); let dd = today.getDate(); let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        today = yyyy + '-' + mm + '-' + dd;
        const end: any = document.getElementById("end");

        if (end.value) {
            if (begin > end.value) {
                errMessage = "*";
            }
        }

        if (begin < today) {
            errMessage = "*";
            e.target.style.border = "red 2px solid";
        } else {
            e.target.style.border = "gray 2px solid"
        }
        if (begin === "0000-00-00") {
            errMessage = "*";
        }

        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        errors.beginError = errMessage;
        vacation.begin = begin;
        this.setState({ vacation, errors });
    }

    private setEnd = (e: any) => {
        let end: any = e.target.value;
        let errMessage = "";
        let today: any = new Date(); let dd = today.getDate(); let mm = today.getMonth() + 1;
        let yyyy = today.getFullYear();
        if (dd < 10) { dd = '0' + dd; }
        if (mm < 10) { mm = '0' + mm; }
        today = yyyy + '-' + mm + '-' + dd;
        const begin: any = document.getElementById("begin");
        if (begin.value !== "0000-00-00") {
            if (end < begin.value) {
                errMessage = "*";
                e.target.style.border = "red 2px solid";
            } else {
                e.target.style.border = "white 2px solid"
            }
        }

        if (end < today) {
            errMessage = "*";
            e.target.style.border = "red 2px solid";
        } else {
            e.target.style.border = "gray 2px solid"
        }
        if (end === "0000-00-00") {
            errMessage = "*";
        }


        if (begin.value === "0000-00-00") {
            if (begin.value > end) {
                errMessage = "*";
                e.target.style.border = "red 2px solid";
            } else {
                e.target.style.border = "gray 2px solid"
            }
        }

        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        errors.endError = errMessage;
        vacation.end = end;
        this.setState({ vacation, errors });
    }
    private setPrice = (e: any) => {
        const price = e.target.value;
        let errMessage = "";

        if (price < 100) {
            errMessage = "*";
        }
        const vacation = { ...this.state.vacation };
        const errors = { ...this.state.errors };
        errors.priceError = errMessage;
        vacation.price = price;
        this.setState({ vacation, errors });
    }
}