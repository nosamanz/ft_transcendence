class IPerson{
	x: number;
	y: number;
	width: number;
	height: number;
	speed?: number;

	constructor(setp: {x: number, y: number, width: number, height:number, speed:number}){
		this.x = setp.x;
		this.y = setp.y;
		this.width = setp.width;
		this.height = setp.height;
		this.speed = setp.speed;
	}
}

const playerone: IPerson = new IPerson({
	x: 10,
	y: 81,
	width: 30,
	height: 30,
	speed: 3,
});