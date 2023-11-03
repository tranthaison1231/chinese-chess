<script lang="ts">
  import Button from "$lib/components/ui/button/button.svelte";
  import { onMount } from "svelte";
  import Chess from "./Chess.svelte";
  import woodBg from "$lib/assets/images/wood-table.jpg"

  export let onReady: () => void
  export let isShowReadyButton = false
  let canvas: HTMLCanvasElement
  let context: CanvasRenderingContext2D
  let ceilWidth = 0
  let checkBoardColor = "#000"

  function cross(sx: number, sy: number, ex: number, ey: number, lineWidth: number) {
    const ceilWidth = canvas?.width / 9
    const ceilHeight = canvas?.height / 10
    context.beginPath();
    context.moveTo(sx + ceilWidth / 2, sy + ceilHeight / 2);
    context.lineTo(ex + ceilWidth / 2, ey + ceilHeight / 2);
    context.strokeStyle = checkBoardColor;
    context.lineWidth = lineWidth;
    context.stroke();
    context.closePath();
  }


  function handleSize() {
    const parent = canvas.parentNode as HTMLElement;
    let minLength = parent!.clientHeight
    canvas.height = Math.ceil(minLength);
    canvas.width = Math.ceil(minLength / 9 * 8);
    ceilWidth = canvas?.width / 9
    let ceilHeight = canvas?.height / 10
    const lineWidth = minLength > 500 ? 2 : 1
    context.beginPath();
    context.moveTo(0, 0);
    context.lineTo(canvas.width, 0);
    context.lineTo(canvas.width, canvas.height);
    context.lineTo(0, canvas.height);	
    context.lineTo(0, 0);
    context.lineWidth = lineWidth * 2;
    context.strokeStyle = checkBoardColor;
    context.stroke();
    context.closePath(); 

    for(let i=0; i<=9; i++) {
      cross(0, i * ceilHeight, ceilWidth * 8, i * ceilHeight, lineWidth);
    }

    for(let i=0; i<=8; i++) {
      if(i === 0 || i === 8) {
        cross(i * ceilWidth, 0, i * ceilWidth, ceilHeight * 9, lineWidth);
      }
      else {
        cross(i * ceilWidth, 0, i * ceilWidth, 4 * ceilHeight, lineWidth);
        cross(i * ceilWidth, 5 * ceilHeight, i * ceilWidth, ceilHeight * 9, lineWidth);
      }
    }	
    cross(3 * ceilWidth, 0, 5 * ceilWidth, 2 * ceilHeight, lineWidth);
    cross(5 * ceilWidth, 0, 3 * ceilWidth, 2 * ceilHeight, lineWidth);
    cross(3 * ceilWidth, 7 * ceilHeight, 5 * ceilWidth, 9 * ceilHeight, lineWidth);
    cross(3 * ceilWidth, 9 * ceilHeight, 5 * ceilWidth, 7 * ceilHeight, lineWidth);
    
    let lineW = ceilWidth / 7;   
    let lineH = ceilHeight / 7;  
    let disX = ceilWidth / 14;   
    let disY = ceilHeight / 14;  
    for(let i=1; i<=7; i+=6) {
      cross(ceilWidth * i - disX - lineW, ceilHeight * 2 - disY, ceilWidth * i - disX, ceilHeight * 2 - disY, lineWidth / 2);    
      cross(ceilWidth * i - disX, ceilHeight * 2 - disY, ceilWidth * i - disX, ceilHeight * 2 - disY - lineH, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 2 - disY, ceilWidth * i + disX + lineW, ceilHeight * 2 - disY, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 2 - disY, ceilWidth * i + disX, ceilHeight * 2 - disY - lineH, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 2 + disY, ceilWidth * i + disX + lineW, ceilHeight * 2 + disY, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 2 + disY, ceilWidth * i + disX, ceilHeight * 2 + disY + lineH, lineWidth / 2);
      cross(ceilWidth * i - disX - lineW, ceilHeight * 2 + disY, ceilWidth * i - disX, ceilHeight * 2 + disY, lineWidth / 2);    
      cross(ceilWidth * i - disX, ceilHeight * 2 + disY, ceilWidth * i - disX, ceilHeight * 2 + disY + lineH, lineWidth / 2);
    }
    for(let i=0; i<=8; i+=2) {
      if(i !== 0){
        cross(ceilWidth * i - disX - lineW, ceilHeight * 3 - disY, ceilWidth * i - disX, ceilHeight * 3 - disY, lineWidth / 2);   
        cross(ceilWidth * i - disX, ceilHeight * 3 - disY, ceilWidth * i - disX, ceilHeight * 3 - disY - lineH, lineWidth / 2);
        cross(ceilWidth * i - disX - lineW, ceilHeight * 3 + disY, ceilWidth * i - disX, ceilHeight * 3 + disY, lineWidth / 2);    
        cross(ceilWidth * i - disX, ceilHeight * 3 + disY, ceilWidth * i - disX, ceilHeight * 3 + disY + lineH, lineWidth / 2);
      }
      if(i !== 8) {
        cross(ceilWidth * i + disX, ceilHeight * 3 - disY, ceilWidth * i + disX + lineW, ceilHeight * 3 - disY, lineWidth / 2);
        cross(ceilWidth * i + disX, ceilHeight * 3 - disY, ceilWidth * i + disX, ceilHeight * 3 - disY - lineH, lineWidth / 2);
        cross(ceilWidth * i + disX, ceilHeight * 3 + disY, ceilWidth * i + disX + lineW, ceilHeight * 3 + disY, lineWidth / 2);
        cross(ceilWidth * i + disX, ceilHeight * 3 + disY, ceilWidth * i + disX, ceilHeight * 3 + disY + lineH, lineWidth / 2);
      }
    }
    for(let i=1; i<=7; i+=6){
      cross(ceilWidth * i - disX - lineW, ceilHeight * 7 - disY, ceilWidth * i - disX, ceilHeight * 7 - disY, lineWidth / 2);    
      cross(ceilWidth * i - disX, ceilHeight * 7 - disY, ceilWidth * i - disX, ceilHeight * 7 - disY - lineH, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 7 - disY, ceilWidth * i + disX + lineW, ceilHeight * 7 - disY, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 7 - disY, ceilWidth * i + disX, ceilHeight * 7 - disY - lineH, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 7 + disY, ceilWidth * i + disX + lineW, ceilHeight * 7 + disY, lineWidth / 2);
      cross(ceilWidth * i + disX, ceilHeight * 7 + disY, ceilWidth * i + disX, ceilHeight * 7 + disY + lineH, lineWidth / 2);
      cross(ceilWidth * i - disX - lineW, ceilHeight * 7 + disY, ceilWidth * i - disX, ceilHeight * 7 + disY, lineWidth / 2);    
      cross(ceilWidth * i - disX, ceilHeight * 7 + disY, ceilWidth * i - disX, ceilHeight * 7 + disY + lineH, lineWidth / 2);
    }
    for(let i=0; i<=8; i+=2){
      if(i !== 0){
        cross(ceilWidth * i - disX - lineW, ceilHeight * 6 - disY, ceilWidth * i - disX, ceilHeight * 6 - disY, lineWidth / 2);   
        cross(ceilWidth * i - disX, ceilHeight * 6 - disY, ceilWidth * i - disX, ceilHeight * 6 - disY - lineH, lineWidth / 2);
        cross(ceilWidth * i - disX - lineW, ceilHeight * 6 + disY, ceilWidth * i - disX, ceilHeight * 6 + disY, lineWidth / 2);    
        cross(ceilWidth * i - disX, ceilHeight * 6 + disY, ceilWidth * i - disX, ceilHeight * 6 + disY + lineH, lineWidth / 2);
      }
      if(i !== 8){
        cross(ceilWidth * i + disX, ceilHeight * 6 - disY, ceilWidth * i + disX + lineW, ceilHeight * 6 - disY, lineWidth / 2);
        cross(ceilWidth * i + disX, ceilHeight * 6 - disY, ceilWidth * i + disX, ceilHeight * 6 - disY - lineH, lineWidth / 2);
        cross(ceilWidth * i + disX, ceilHeight * 6 + disY, ceilWidth * i + disX + lineW, ceilHeight * 6 + disY, lineWidth / 2);
        cross(ceilWidth * i + disX, ceilHeight * 6 + disY, ceilWidth * i + disX, ceilHeight * 6 + disY + lineH, lineWidth / 2);
      }
    }
    const fontSize = ceilHeight / 1.5;
    context.font = `${fontSize}px KaiTi`;
    context.fillStyle = checkBoardColor;
    context.fillText("楚河", ceilWidth * 0.8, ceilHeight * 5 + ceilHeight / 4);
    context.fillText("汉界", ceilWidth * 6.8, ceilHeight * 5 + ceilHeight / 4);
  }

  onMount(() => {
    context = canvas.getContext("2d")!;
		handleSize()
	})
</script>

<svelte:window on:resize={handleSize}/>
<canvas bind:this={canvas} class="absolute z-0 bg-repeat-round" style="background-image: url('{woodBg}') ;"/>
<Chess on:move width={canvas?.width} height={canvas?.height} ceilWidth={ceilWidth} />
{#if isShowReadyButton}
<Button class="absolute z-30 text-xl" size="lg" on:click={onReady}> Ready </Button>
{/if}
