export class Vacation {
    public constructor(
        public vacationID: number = 0,
        public location: string = "Israel",
        public description: string = "",
        public begin: Date = new Date(),
        public end: Date = new Date(),
        public price: number = 0,
        public imageName: any = "X.jpg"
    ) { }
}
