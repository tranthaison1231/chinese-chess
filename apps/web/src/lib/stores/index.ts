import { Color, Status, type Room, type User } from '$lib/utils/type';
import { derived, writable } from 'svelte/store';

export const room = writable<Room>({
	id: '',
	game: {
		id: '',
		status: Status.PENDING
	},
	users: []
});
export const me = writable<User | null>(null);

export const myTurn = derived([room, me], ([$room, $me], set: (color: Color | null) => void) => {
	if ($me?.id === $room?.game?.player1?.id) set(Color.RED);
	else if ($me?.id === $room?.game?.player2?.id) set(Color.BLACK);
	else set(null);
});
export const isPlayer = derived([room, me], ([$room, $me], set: (isPlayer: boolean) => void) => {
	set($me?.id === $room?.game?.player1?.id || $me?.id === $room?.game?.player2?.id);
});
