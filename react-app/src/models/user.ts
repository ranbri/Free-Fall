export class User {
    constructor(
        public userID:number = 0,
        public firstName:string = "",
        public lastName:string = "",
        public userName:string = "",
        public password:string = "",
        public isAdmin:boolean | string = "false",
        public isLogged:boolean | string = "false"
    ){}
}
