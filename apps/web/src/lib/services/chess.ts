import { Color } from '$lib/utils/type';
import { writable } from 'svelte/store';

const ROWS = 10;
const COLS = 9;
const S_TOP = 4;
const S_BOTTOM = 5;
const R_LEFT = 3;
const R_RIGHT = 5;
const R_TOP_BLACK = 7;
const R_TOP_RED = 2;

type ChessName = 'king' | 'cannon' | 'soldier' | 'elephant' | 'knight' | 'advisor' | 'rock';

export const chesses = writable<Record<string, Chess>>();

export abstract class Chess {
	_chesses: Record<string, Chess> = {};

	constructor(
		public x: number,
		public y: number,
		public name: ChessName,
		public color: Color
	) {
		chesses.subscribe((chesses) => {
			this._chesses = chesses;
		});
	}

	go(x: number, y: number, callback?: () => void) {
		if (this.roads.includes(`${x}${y}`)) {
			delete this._chesses[`${this.x}${this.y}`];
			this.x = x;
			this.y = y;
			this._chesses[`${x}${y}`] = this;
			callback?.();
		}
	}

	isKingStanding = (road: string) => {
		return (
			Number(road[0]) >= R_LEFT &&
			Number(road[0]) <= R_RIGHT &&
			(this.color === Color.RED ? Number(road[1]) <= R_TOP_RED : Number(road[1]) >= R_TOP_BLACK)
		);
	};

	get image() {
		return `${this.name}_${this.color}`;
	}

	protected abstract getRoads(): string[];

	get roads(): string[] {
		return this.getRoads().filter((road) => {
			if (this._chesses[road]?.color === this.color || road.length === 3) {
				return false;
			}
			return true;
		});
	}
}

export class Rock extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'rock', color);
	}

	getRoads() {
		const roads = [];
		for (let i = this.x + 1; i < COLS; i++) {
			roads.push(`${i}${this.y}`);
			if (this._chesses[`${i}${this.y}`]) {
				break;
			}
		}

		for (let i = this.x - 1; i >= 0; i--) {
			roads.push(`${i}${this.y}`);
			if (this._chesses[`${i}${this.y}`]) {
				break;
			}
		}

		for (let i = this.y + 1; i <= COLS; i++) {
			roads.push(`${this.x}${i}`);
			if (this._chesses[`${this.x}${i}`]) {
				break;
			}
		}
		for (let i = this.y - 1; i >= 0; i--) {
			roads.push(`${this.x}${i}`);
			if (this._chesses[`${this.x}${i}`]) {
				break;
			}
		}
		return roads;
	}
}

export class Knight extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'knight', color);
	}

	getRoads() {
		const roads = [];

		if (!this._chesses[`${this.x + 1}${this.y}`]) {
			roads.push(`${this.x + 2}${this.y + 1}`);
			roads.push(`${this.x + 2}${this.y - 1}`);
		}
		if (!this._chesses[`${this.x - 1}${this.y}`]) {
			roads.push(`${this.x - 2}${this.y + 1}`);
			roads.push(`${this.x - 2}${this.y - 1}`);
		}
		if (!this._chesses[`${this.x}${this.y + 1}`]) {
			roads.push(`${this.x + 1}${this.y + 2}`);
			roads.push(`${this.x - 1}${this.y + 2}`);
		}
		if (!this._chesses[`${this.x}${this.y - 1}`]) {
			roads.push(`${this.x - 1}${this.y - 2}`);
			roads.push(`${this.x + 1}${this.y - 2}`);
		}

		return roads;
	}
}

export class Cannon extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'cannon', color);
	}
	getRoads() {
		const roads = [];
		for (let i = this.x + 1; i < COLS; i++) {
			if (this._chesses[`${i}${this.y}`]) {
				for (let j = i + 1; j < COLS; j++) {
					if (this._chesses[`${j}${this.y}`]) {
						roads.push(`${j}${this.y}`);
						break;
					}
				}
				break;
			}
			roads.push(`${i}${this.y}`);
		}

		for (let i = this.x - 1; i >= 0; i--) {
			if (this._chesses[`${i}${this.y}`]) {
				for (let j = i - 1; j >= 0; j--) {
					if (this._chesses[`${j}${this.y}`]) {
						roads.push(`${j}${this.y}`);
						break;
					}
				}
				break;
			}
			roads.push(`${i}${this.y}`);
		}

		for (let i = this.y + 1; i < ROWS; i++) {
			if (this._chesses[`${this.x}${i}`]) {
				for (let j = i + 1; j < ROWS; j++) {
					if (this._chesses[`${this.x}${j}`]) {
						roads.push(`${this.x}${j}`);
						break;
					}
				}
				break;
			}
			roads.push(`${this.x}${i}`);
		}
		for (let i = this.y - 1; i >= 0; i--) {
			if (this._chesses[`${this.x}${i}`]) {
				for (let j = i - 1; j >= 0; j--) {
					if (this._chesses[`${this.x}${j}`]) {
						roads.push(`${this.x}${j}`);
						break;
					}
				}
				break;
			}
			roads.push(`${this.x}${i}`);
		}

		return roads;
	}
}

export class Elephant extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'elephant', color);
	}

	getRoads() {
		let roads: string[] = [];

		if (!this._chesses[`${this.x + 1}${this.y + 1}`]) {
			roads.push(`${this.x + 2}${this.y + 2}`);
		}
		if (!this._chesses[`${this.x + 1}${this.y - 1}`]) {
			roads.push(`${this.x + 2}${this.y - 2}`);
		}
		if (!this._chesses[`${this.x - 1}${this.y - 1}`]) {
			roads.push(`${this.x - 2}${this.y - 2}`);
		}
		if (!this._chesses[`${this.x - 1}${this.y + 1}`]) {
			roads.push(`${this.x - 2}${this.y + 2}`);
		}

		roads = roads.filter((road) => {
			return this.color === Color.RED ? Number(road[1]) <= S_TOP : Number(road[1]) >= S_BOTTOM;
		});

		return roads;
	}
}

export class Soldier extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'soldier', color);
	}

	getRoads() {
		let roads = [];
		if (this.color === Color.RED) {
			roads = [`${this.x}${this.y + 1}`];
			if (this.y > S_TOP) {
				roads.push(`${this.x + 1}${this.y}`, `${this.x - 1}${this.y}`);
			}
		} else {
			roads = [`${this.x}${this.y - 1}`];
			if (this.y < S_BOTTOM) {
				roads.push(`${this.x + 1}${this.y}`, `${this.x - 1}${this.y}`);
			}
		}

		return roads;
	}
}

export class Advisor extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'advisor', color);
	}

	getRoads() {
		const roads = [
			`${this.x - 1}${this.y - 1}`,
			`${this.x - 1}${this.y + 1}`,
			`${this.x + 1}${this.y - 1}`,
			`${this.x + 1}${this.y + 1}`
		].filter(this.isKingStanding);
		return roads;
	}
}

export class King extends Chess {
	constructor(
		public override x: number,
		public override y: number,
		public override color: Color
	) {
		super(x, y, 'king', color);
	}

	getRoads() {
		const roads = [
			`${this.x + 1}${this.y}`,
			`${this.x - 1}${this.y}`,
			`${this.x}${this.y + 1}`,
			`${this.x}${this.y - 1}`
		].filter(this.isKingStanding);

		const chessesAtX = [];

		for (let i = 0; i < ROWS; i++) {
			const chess = this._chesses[`${this.x}${i}`];
			if (chess && !(chess.color === this.color && chess.name === 'king')) {
				chessesAtX.push(chess);
			}
		}

		if (chessesAtX.length === 1) {
			roads.push(`${chessesAtX[0]?.x}${chessesAtX[0]?.y}`);
		}

		return roads;
	}
}

export const resetChesses = () => {
	chesses.set({
		'00': new Rock(0, 0, Color.RED),
		'10': new Knight(1, 0, Color.RED),
		'12': new Cannon(1, 2, Color.RED),
		'20': new Elephant(2, 0, Color.RED),
		'30': new Advisor(3, 0, Color.RED),
		'40': new King(4, 0, Color.RED),
		'50': new Advisor(5, 0, Color.RED),
		'60': new Elephant(6, 0, Color.RED),
		'70': new Knight(7, 0, Color.RED),
		'80': new Rock(8, 0, Color.RED),
		'72': new Cannon(7, 2, Color.RED),
		'03': new Soldier(0, 3, Color.RED),
		'23': new Soldier(2, 3, Color.RED),
		'43': new Soldier(4, 3, Color.RED),
		'63': new Soldier(6, 3, Color.RED),
		'83': new Soldier(8, 3, Color.RED),
		'06': new Soldier(0, 6, Color.BLACK),
		'86': new Soldier(8, 6, Color.BLACK),
		'26': new Soldier(2, 6, Color.BLACK),
		'46': new Soldier(4, 6, Color.BLACK),
		'66': new Soldier(6, 6, Color.BLACK),
		'09': new Rock(0, 9, Color.BLACK),
		'29': new Elephant(2, 9, Color.BLACK),
		'17': new Cannon(1, 7, Color.BLACK),
		'19': new Knight(1, 9, Color.BLACK),
		'39': new Advisor(3, 9, Color.BLACK),
		'49': new King(4, 9, Color.BLACK),
		'59': new Advisor(5, 9, Color.BLACK),
		'69': new Elephant(6, 9, Color.BLACK),
		'79': new Knight(7, 9, Color.BLACK),
		'77': new Cannon(7, 7, Color.BLACK),
		'89': new Rock(8, 9, Color.BLACK)
	});
};
