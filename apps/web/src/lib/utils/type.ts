export enum Status {
	PENDING = 'PENDING',
	ACTIVE = 'ACTIVE'
}
export enum Color {
	RED = 'RED',
	BLACK = 'BLACK'
}

export interface Location {
	x: number;
	y: number;
}

export interface User {
	id: string;
	username: string;
}

export interface Game {
	id: string;
	status: Status;
	player1ID?: string;
	player2ID?: string;
	player1?: User;
	player2?: User;
	turn?: Color;
}

export interface Room {
	id: string;
	users: User[];
	game?: Game;
}

export interface Message {
	username: string;
	content: string;
	time?: Date;
}
