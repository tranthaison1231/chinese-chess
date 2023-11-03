<script lang="ts">
	import { Chess, chesses, resetChesses } from '$lib/services/chess';
	import { isPlayer, myTurn, room } from '$lib/stores';
	import { getAssetSrc } from '$lib/utils/getAssetSrc';
	import { Status } from '$lib/utils/type';
	import { createEventDispatcher, onMount } from 'svelte';

	let canvas: HTMLCanvasElement;
	let context: CanvasRenderingContext2D;
	export let ceilWidth = 0;
	export let width = 0;
	export let height = 0;
	let loading = 0;

	let images: Record<string, HTMLImageElement | undefined> = {};

	let selectChess: Chess | undefined = undefined;

	const dispatch = createEventDispatcher();

	function handleSize() {
		canvas.height = height;
		canvas.width = width;
		draw($chesses);
	}

	function draw(items: Record<string, Chess>, selectChess?: Chess) {
		if (context) {
			context.clearRect(0, 0, canvas.width, canvas.height);
			for (const key in items) {
				const item = items[key];
				if (item) {
					context.drawImage(
						images[item.image]!,
						item.x * ceilWidth,
						item.y * ceilWidth,
						ceilWidth,
						ceilWidth
					);
				}
			}
			if (selectChess) {
				context.drawImage(
					images['selected']!,
					selectChess.x * ceilWidth,
					selectChess.y * ceilWidth,
					ceilWidth,
					ceilWidth
				);
				for (const road of selectChess.roads) {
					context.beginPath();
					context.arc(
						Number(road[0]) * ceilWidth + ceilWidth / 2,
						Number(road[1]) * ceilWidth + ceilWidth / 1.75,
						ceilWidth / 6,
						0,
						2 * Math.PI
					);
					context.fillStyle = '#FF0000';
					context.fill();
				}
			}
		}
	}

	function clickChess(e: MouseEvent) {
		if (!$isPlayer || $room?.game?.status === Status.PENDING) return;
		const ceilWidth = canvas?.width / 9;
		let x = Math.floor(e.offsetX / ceilWidth);
		let y = Math.floor(e.offsetY / ceilWidth);
		const item = $chesses[`${x}${y}`];
		const from = {
			x: selectChess?.x,
			y: selectChess?.y
		};
		const to = {
			x,
			y
		};
		if (item) {
			if ($room?.game?.turn !== $myTurn) return;
			if (selectChess && selectChess.color !== item.color) {
				selectChess.go(x, y, () => {
					selectChess = undefined;
					dispatch('move', {
						from: from,
						to: to,
						enemy: item
					});
				});
      } else if(item.color === $myTurn) {
				selectChess = item;
			}
		} else if (selectChess) {
			selectChess.go(x, y, () => {
				dispatch('move', {
					from: from,
					to: to
				});
			});
			selectChess = undefined;
		}
	}

	function move(event: Event) {
		const { from, to, turn } = (event as CustomEvent).detail;
		if (turn === $myTurn) {
			selectChess = $chesses[`${from.x}${from.y}`];
			const item = $chesses[`${to.x}${to.y}`];
			if (item) {
				if (selectChess && selectChess.color !== item.color) {
					selectChess.go(to.x, to.y);
					selectChess = undefined;
				} else {
					selectChess = item;
				}
			} else if (selectChess) {
				selectChess.go(to.x, to.y);
				selectChess = undefined;
			}
		}
	}

	onMount(() => {
		images = {
			selected: new Image(),
			rock_RED: new Image(),
			rock_BLACK: new Image(),
			knight_RED: new Image(),
			knight_BLACK: new Image(),
			cannon_RED: new Image(),
			cannon_BLACK: new Image(),
			elephant_RED: new Image(),
			elephant_BLACK: new Image(),
			advisor_RED: new Image(),
			advisor_BLACK: new Image(),
			king_RED: new Image(),
			king_BLACK: new Image(),
			soldier_RED: new Image(),
			soldier_BLACK: new Image()
		};
		context = canvas.getContext('2d')!;
		for (let i in images) {
			loading++;
			images[i]!.src = getAssetSrc(i + '.png');
			images[i]!.onload = () => {
				loading--;
			};
		}
		resetChesses();
		document.addEventListener('move', move);

		return () => {
			document.removeEventListener('move', move);
		};
	});

	$: if (!loading) {
		draw($chesses, selectChess);
	}

	$: if (ceilWidth && width && height && canvas) {
		handleSize();
	}
</script>

<canvas bind:this={canvas} on:click={clickChess} class="absolute z-20" />
