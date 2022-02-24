import { User } from "../models/user";
import { Vacation } from "../models/vacation";

export class AppState {
    public users: User[] = [];
    public user: User = new User();
    public vacations: Vacation[] = [];
    public isLogged: boolean = false;
    public adminChanged: boolean = false;
}