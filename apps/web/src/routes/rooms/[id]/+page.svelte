<script lang="ts">
	import { beforeNavigate, goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { PUBLIC_API_URL } from '$env/static/public';
	import ChatList from '$lib/components/ChatList.svelte';
	import ConfirmButton from '$lib/components/ConfirmButton.svelte';
	import Music from '$lib/components/Music.svelte';
	import Table from '$lib/components/Table.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { notification } from '$lib/components/ui/notification';
	import { ACTIONS } from '@chinese-chess/utils';
	import { Chess, resetChesses } from '$lib/services/chess';
	import { isPlayer, me, myTurn, room } from '$lib/stores';
	import { cn } from '$lib/utils/cn';
	import { Status, type Location, type Message, Color } from '$lib/utils/type';
	import { LogOut, X } from 'lucide-svelte';
	import { onMount, tick } from 'svelte';
	import peer from '$lib/services/peer';

	const { id: roomID } = $page.params;
	let ws: WebSocket;
	let username: string | null;
	let messages: Message[] = [];
	let chatEl: HTMLDivElement | null;
	let myStream: MediaStream | null

	$: gameID = $room?.game?.id;
	$: player1 = $room?.game?.player1;
	$: player2 = $room?.game?.player2;
	$: isGameActive = $room?.game?.status === Status.ACTIVE;
	$: isShowReadyButton = Boolean(!isGameActive && isPlayer && player1?.id && player2?.id);

	const handleGetTracks = (event: RTCTrackEvent) => {
		if(event.streams[0]) {
			console.log('GOT TRACKS!!!', event.streams[0]);
			const element = document.querySelector('#remote-stream') as HTMLVideoElement;
			element.removeAttribute('srcObject')
			element.srcObject = event.streams[0];

			element.addEventListener('loadedmetadata', () => {
				element.play()
			})
			element.onloadstart = () => {console.log('onload start')}
			element.onerror = (e) => {console.log('error',e)}
		}
	}

	const makeCall = async () => {
		console.log('Make call from ' + $me?.id + ' ' + $me?.username);

		const offer = await peer.makeCall()
		ws.send(JSON.stringify({ action: ACTIONS.VOICE.MAKE_CALL, offer, roomID }))
	}

	const handleIncomingCall = async (offer: RTCSessionDescriptionInit, from: string) => { 
		const answer = await peer.createAnswer(offer)
		console.log('Incoming call from ' + from);
		ws.send(JSON.stringify({
			action: ACTIONS.VOICE.ACCEPT_CALL,
			answer,
			from,
		}))
	}

	const acceptCall = async (answer: RTCSessionDescriptionInit) => {
		await peer.setRemoteDescription(answer)
	}

	const negotiationDone = async (answer: RTCSessionDescriptionInit) => {
		await peer.setRemoteDescription(answer)
	}

	const onNegotiationNeed = async () => {
		console.log('Negotiation Needed');
		const offer = await peer.makeCall();
		ws.send(JSON.stringify({ action: ACTIONS.VOICE.NEGOTIATION, offer, roomID }))
	}

	const onNegotiating  = async (offer: RTCSessionDescriptionInit) => {
		const answer = await peer.createAnswer(offer);

		ws.send(JSON.stringify({
			action: ACTIONS.VOICE.NEGOTIATION_DONE,
			answer,
			roomID: $room.id
		}))
	}

	onMount(() => {
		const searchParams = new URLSearchParams(window.location.search);
		username = searchParams.get('username');
		ws = new WebSocket(PUBLIC_API_URL);

		peer.peerConnection?.addEventListener('track', handleGetTracks)

		peer.peerConnection?.addEventListener('negotiationneeded', onNegotiationNeed)

		ws.onopen = () => {
			ws.send(JSON.stringify({ action: ACTIONS.ROOM.ENTER, username, roomID }));
		};

		ws.onmessage = async (event) => {
			const data = JSON.parse(event.data);
			const { action } = data;
			if (action === ACTIONS.ROOM.INFO) {
				if(data.room){
					$room = data.room;
				}
			}
			if (action === ACTIONS.ROOM.ME) {
				$me = data.me;
				await makeCall()
			}
			if (action === ACTIONS.ROOM.MESSAGE) {
				messages = [
					...messages,
					{
						username: data.username,
						content: data.content
					}
				];
				await tick();
				if (chatEl) {
					chatEl.scrollTop = chatEl.scrollHeight;
				}
			}
			if (action === ACTIONS.GAME.MOVE) {
				$room = data.room;
				document.dispatchEvent(
					new CustomEvent('move', {
						detail: {
							from: data.from,
							to: data.to,
							turn: data.room.game.turn
						}
					})
				);
			}
			if (action === ACTIONS.GAME.END) {
				resetChesses();
				if (data?.winner?.id === $me?.id) {
					notification.success({
						title: 'You win!'
					});
				} else {
					notification.error({
						title: 'You lose!'
					});
				}
			}

			if(action === ACTIONS.VOICE.INCOMING_CALL) {
				const { offer, from } = data
				await handleIncomingCall(offer, from)
			}

			if(action === ACTIONS.VOICE.ACCEPT_CALL) {
				const { answer, from } = data
				console.log('Accept call from ' + from);
				await acceptCall(answer)
			}

			if(action === ACTIONS.VOICE.NEGOTIATING) {
				const { offer } = data

				console.log('Negotiating from' + $me?.id);
				onNegotiating(offer)
			}

			if(action === ACTIONS.VOICE.NEGOTIATION_DONE) {
				const { answer } = data
				console.log('Negotiation Done');

				negotiationDone(answer)
			}
		};
	});

	const handleReady = () => {
		if (gameID) {
			ws.send(JSON.stringify({ action: ACTIONS.GAME.START, gameID: gameID, roomID }));
		}
	};

	const joinSit = (sitID: number) => {
		if ((sitID === 1 && player1) || (sitID === 2 && player2)) {
			return;
		}
		if (gameID && !$isPlayer) {
			ws.send(JSON.stringify({ action: ACTIONS.GAME.SIT, roomID: roomID, gameID: gameID, sitID }));
		}
	};

	const handleSurrender = () => {
		if (gameID) {
			const winner = $me?.id === player1?.id ? player2 : player1;
			ws.send(
				JSON.stringify({ action: ACTIONS.GAME.END, roomID: roomID, gameID: gameID, winner: winner })
			);
		}
	};

	const handleTakeBack = () => {
		ws.send(JSON.stringify({ action: ACTIONS.GAME.TAKE_BACK, roomID: roomID }));
	};

	const leaveRoom = () => {
		ws.send(JSON.stringify({ action: ACTIONS.ROOM.LEAVE, roomID: roomID }));
		goto('/');
	};

	const removeSit = (sitID: number) => {
		ws.send(JSON.stringify({ action: ACTIONS.GAME.REMOVE_SIT, gameID: gameID, roomID, sitID }));
	};

	const move = (event: CustomEvent<{ from: Location; to: Location; enemy?: Chess }>) => {
		const { from, to, enemy } = event.detail;
		if (enemy?.name === 'king') {
			const winner = $me?.id === player1?.id ? player1 : player2;
			ws.send(
				JSON.stringify({ action: ACTIONS.GAME.END, roomID: roomID, gameID: gameID, winner: winner })
			);
		}
		ws.send(
			JSON.stringify({
				action: ACTIONS.GAME.MOVE,
				gameID: gameID,
				roomID: roomID,
				from,
				to,
				turn: $myTurn
			})
		);
	};

	function sendMessage(e: CustomEvent<{ content: string }>) {
		const { content } = e.detail;
		ws.send(JSON.stringify({ action: ACTIONS.ROOM.MESSAGE, content, roomID, user: $me }));
	}

	function onGetUserMediaError(error: Error) {
		notification.error({
			title: 'Error Enabling audio! Error: ' + error.message
		})
	}

	async function onTurnOnVoiceChat(stream: MediaStream) {
		myStream = stream
		const tracks = stream.getTracks();
		for(const track of tracks) {
			peer.peerConnection?.addTrack(track, stream)
		}
		
		const element = document.querySelector('#my-stream') as HTMLVideoElement;
		element.srcObject = stream;
		element.addEventListener('loadedmetadata', () => {
			element.play()
		})
	}

	async function onTurnOffVoiceChat() {
		const tracks = myStream?.getTracks();
		for(const track of tracks ?? []) {
			if(track.readyState === 'live') {
				track.stop();
			}
		}
	}

	// beforeNavigate(({ cancel }) => {
	// 	if (!confirm('When you leave, you will lose the game?')) {
	// 		cancel();
	// 	}
	// });
</script>

<div class="flex h-full w-full max-w-7xl justify-center gap-10 py-10">
	<div class="relative flex h-full w-1/2 items-center justify-center 2xl:w-3/4">
		<Table onReady={handleReady} {isShowReadyButton} on:move={move} />
	</div>
	<div class="flex w-1/4 flex-col justify-between space-y-4 border p-2">
		<div>
			<div class="mb-4 flex gap-4">
				<button on:click={leaveRoom} class="hover:scale-105">
					<LogOut />
				</button>
				<Music />
			</div>
			<div class="mb-4 space-y-2">
				<button
					class={cn('relative w-full border p-2 text-center text-xl', {
						'border-primary': $room?.game?.turn === Color.RED && isGameActive
					})}
					on:click={() => joinSit(1)}
				>
					{#if player1 && $me?.id === player1?.id}
						<button class="absolute right-2 top-2" on:click|stopPropagation={() => removeSit(1)}>
							<X />
						</button>
					{/if}
					{player1 ? player1.username : 'Player 1'}
				</button>
				{#key isGameActive}
					<Timer on={$room?.game?.turn === Color.RED && isGameActive} on:end={handleSurrender} />
				{/key}
				<button
					class={cn('relative w-full border p-2 text-center text-xl', {
						'border-primary': $room?.game?.turn === Color.BLACK && isGameActive
					})}
					on:click={() => joinSit(2)}
				>
					{#if player2 && $me?.id === player2?.id}
						<button class="absolute right-2 top-2" on:click|stopPropagation={() => removeSit(2)}>
							<X />
						</button>
					{/if}
					{player2 ? player2.username : 'Player 2'}
				</button>
				{#key isGameActive}
					<Timer on={$room?.game?.turn === Color.BLACK && isGameActive} on:end={handleSurrender} />
				{/key}
			</div>
			{#if isGameActive && isPlayer}
				<ConfirmButton on:click={handleSurrender}>Surrender</ConfirmButton>
				<Button variant="destructive" on:click={handleTakeBack}>Take back</Button>
			{/if}
		</div>
		<ChatList bind:chatEl {messages} on:sendMessage={sendMessage} {onGetUserMediaError} {onTurnOnVoiceChat} {onTurnOffVoiceChat} />
	</div>
	<!-- <audio id="my-recorder" playsinline autoplay >
		<source  type="audio/mpeg" />
	</audio>
	<audio id="voice-recorder" playsinline autoplay >
		<source  type="audio/mpeg" />
	</audio> -->
	<div>
		My Stream
		<!-- svelte-ignore a11y-media-has-caption -->
		<video id="my-stream" autoplay width="640" height="480">
		</video>
		Remote stream
		<!-- svelte-ignore a11y-media-has-caption -->
		<video id="remote-stream" autoplay width="640" height="480">
		</video>
	</div>
</div>
