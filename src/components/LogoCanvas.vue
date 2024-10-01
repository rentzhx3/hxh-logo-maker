<script setup type="text/tsx">
import {onMounted, ref, watch} from 'vue'

const props = defineProps({
  topText: String,
  bottomText: String,
  middleTextLeft: String,
  middleTextRight: String,
  fontSize: Number,
  flipBottomText: Boolean,
  centerX: Boolean,
  showSaveButton: Boolean
})



const previewCanvas = ref(null)


const drawTextBorder = (ctx, text, x, y, em) => {
  ctx.save()
  ctx.miterLimit = 5;
  // outer black border
  ctx.strokeStyle = 'black'
  let blackStrokeWidth = 0.02;
  let innerBlackStrokeWidth = blackStrokeWidth;
  let carmineFillWidth = 0.09;
  blackStrokeWidth = carmineFillWidth + blackStrokeWidth;
  ctx.lineWidth = blackStrokeWidth * em
  ctx.strokeText(text, x, y);

  ctx.strokeStyle = '#af303e'
  ctx.lineWidth = carmineFillWidth * em
  ctx.lineWidth = Math.round(ctx.lineWidth);
  ctx.strokeText(text, x, y);
  ctx.strokeStyle = 'black'
  ctx.lineWidth = innerBlackStrokeWidth * em
  ctx.strokeText(text, x, y)
  ctx.restore();
}

const debug = (ctx, text) => {
  ctx.save()
  ctx.fillStyle = 'black'
  ctx.font = '20px Archivo Black';
  ctx.fillText(text, 10, 20);
  ctx.restore()

};

const renderCanvas = (canvasRef, targetWidth, targetHeight) => {
  if (!targetWidth) {
    targetWidth = 720;
  }
  if(!targetHeight) {
    targetHeight = 480;
  }
  let topText = props.topText;
  let font = `"Archivo Black", sans-serif`


  const ctx = canvasRef.getContext('2d')
  ctx.canvas.width = targetWidth;
  ctx.canvas.height = targetHeight
  let width = canvasRef.width;
  let height = canvasRef.height;

  ctx.clearRect(0, 0, width, height)

  // compute font size to fit width
  let screenPadding = 0.05 * width;
  let biggerText = topText;
  if (props.bottomText.length > topText.length) {
    biggerText = props.bottomText;
  }
  if (biggerText == "") {
    biggerText = "                  ";
  }

  let computedFontSize = 50;
  ctx.font = `${computedFontSize}px ${font}`;

  while (ctx.measureText(biggerText).width < width - screenPadding*2) {
    ctx.font = `${computedFontSize}px ${font}`;
    computedFontSize += 10;
  }
  // ig it crosses over the canvas height, decrease font size until it fits
  while (computedFontSize*2 > height- screenPadding) {
    computedFontSize -= 10;
  }
  computedFontSize = computedFontSize *0.9
  ctx.font = `${computedFontSize}px ${font}`;


  const topTextWidth = ctx.measureText(topText).width;
  let topTextHeight = computedFontSize + (0.11 * computedFontSize * 2);


  let topTextX = (width - topTextWidth) / 2;

  let topTextY = (height /2);



  let bottomTextX = (width - ctx.measureText(props.bottomText).width) / 2;
  let bottomTextY = topTextY + topTextHeight;

  let bottomTextWidth = ctx.measureText(props.bottomText).width;
  let bottomTextHeight = topTextHeight;


  ctx.fillStyle = 'black'

  if (props.flipBottomText) {
    bottomTextY = -bottomTextY + computedFontSize - (0.11 * computedFontSize * 2);
    bottomTextY += (0.35 * computedFontSize);

    ctx.save();
    ctx.fillStyle = 'blue';
    ctx.scale(1, -1);
    drawTextBorder(ctx, props.bottomText, bottomTextX, bottomTextY, computedFontSize);
    const grad = ctx.createLinearGradient(bottomTextX, bottomTextY - computedFontSize + (0.3 * computedFontSize), bottomTextX, bottomTextY + 5);

    grad.addColorStop(0, "#b9071c");
    grad.addColorStop(0.6, "#F3AE58");
    grad.addColorStop(1, "#F3AE58");
    ctx.fillStyle = grad;
    ctx.fillText(props.bottomText, bottomTextX, bottomTextY);



    ctx.restore();
  } else {
    bottomTextX = (width - ctx.measureText(props.bottomText).width) / 2;
    bottomTextY = topTextY + computedFontSize - (0.2 * computedFontSize);

    drawTextBorder(ctx, props.bottomText, bottomTextX, bottomTextY, computedFontSize);

    const grad = ctx.createLinearGradient(bottomTextX, bottomTextY - computedFontSize , bottomTextX, bottomTextY -5);

    grad.addColorStop(0, "#F3AE58");
    grad.addColorStop(0.6, "#F3AE58");
    grad.addColorStop(1, "#b9071c");
    ctx.fillStyle = grad;
    ctx.fillText(props.bottomText, bottomTextX, bottomTextY );
  }

  // draw top text
  drawTextBorder(ctx, topText, topTextX, topTextY, computedFontSize);
  ctx.fillStyle = 'white'
  ctx.fillText(topText, topTextX, topTextY)


  // draw middle text left
  ctx.fillStyle = 'white'
  let middleTextFontSize = computedFontSize / 6;
  let middleTextRectSize = middleTextFontSize * 1.5;
  ctx.font = `${middleTextFontSize}px ${font}`
  let boxGrow = 1.7 * middleTextFontSize;
  let middleTextPadding = 0.2 * computedFontSize;


  const middleTextLeftWidth = ctx.measureText(props.middleTextLeft).width
  const middleTextHeight = middleTextFontSize;

  // black box
  let boxLeftWidth = middleTextLeftWidth + (boxGrow * 2);
  const textRight = props.middleTextRight || props.middleTextLeft
  const textRightWidth = ctx.measureText(textRight).width
  let boxRightWidth = textRightWidth + (boxGrow * 2);

  let centerBoxesWidth = boxLeftWidth + boxRightWidth;

  let groupCenter = (topTextWidth / 2) - (centerBoxesWidth / 2) + topTextX;

  let boxLeftX;
  let xText = '×';
  let xFontSize = computedFontSize * 1.3;
  ctx.save()
  ctx.font = `bold ${xFontSize}px ${font}`
  const xTextWidth = ctx.measureText(xText).width;
  ctx.restore()

  if (!props.centerX) {
    boxLeftX = groupCenter; // boxLeft - boxGrow to center on X
  } else {
    boxLeftX = topTextX + (topTextWidth /2) - boxLeftWidth;
  }

  let boxHeight = middleTextRectSize;
  let boxesY = topTextY - boxHeight / 2;
  let letterOutlineCompensation = 0.05 * computedFontSize;
  boxesY += letterOutlineCompensation; // outline compensation
  let boxYCenterText = boxesY + (boxHeight / 2) + (middleTextFontSize / 2) - (0.03) * computedFontSize;

  if (props.middleTextLeft != "") {
    ctx.fillStyle = 'black'
    ctx.fillRect(boxLeftX, boxesY, boxLeftWidth, middleTextRectSize);
    ctx.fillStyle = 'white'
    ctx.fillText(props.middleTextLeft, boxLeftX + middleTextPadding, boxYCenterText)
  }


  ctx.fillStyle = 'black';

  const textRightX = boxLeftX + boxLeftWidth;

  let rightBoxX = textRightX;
  let boxRightX = rightBoxX + boxRightWidth;
  let middleTextY = (height - middleTextHeight) / 2

  if (props.middleTextRight != "") {
    ctx.fillRect(rightBoxX, boxesY, boxRightWidth, boxHeight);
    ctx.fillStyle = 'white'
    ctx.fillText(textRight, boxRightX - textRightWidth - middleTextPadding, boxYCenterText);
  }

  ctx.font = `bold ${xFontSize}px ${font}`
  // TODO: snap to middle of letters?
  let xTextX = boxLeftX + boxLeftWidth - (xTextWidth / 2);
  let xTextY = height / 2 + (xFontSize / 2) - (0.30 * computedFontSize) + letterOutlineCompensation;
  ctx.strokeStyle = 'red';
  ctx.lineWidth = 4;

  ctx.save();
  ctx.strokeStyle = 'black';
  ctx.lineWidth = 0.11 * computedFontSize
  ctx.strokeText(xText, xTextX, xTextY);
  ctx.restore()


  const grad = ctx.createLinearGradient(xTextX, xTextY, xTextX +  xTextWidth , xTextY)
  grad.addColorStop(0, '#c5bf83');
  grad.addColorStop(0.35, '#c5bf83');
  grad.addColorStop(0.65, '#d5d08c');
  grad.addColorStop(1, '#f9fbf6');

  ctx.fillStyle = grad;
  ctx.lineWidth = 0.09 * computedFontSize
  ctx.strokeStyle = grad;

  ctx.strokeText(xText, xTextX, xTextY);

  ctx.fillStyle = '#286740'
  // draw rect
  ctx.fillText(xText, xTextX, xTextY)


};

onMounted(() => {
  renderCanvas(previewCanvas.value, 3920/4, 2160/4);
})

watch(() => [props.topText, props.bottomText, props.middleTextLeft, props.middleTextRight,  props.flipBottomText, props.centerX], () => {
  renderCanvas(previewCanvas.value, 3920/4, 2160/4);
})


const saveImage = () => {
  //  rerender at higher resolution
  const canvas = document.createElement('canvas');
  renderCanvas(canvas, 3920,2160);

  const link = document.createElement('a');
  link.download = props.topText + "x" + props.bottomText + ".png";
  link.href = canvas.toDataURL();
  link.click();
  this.$gtag.event('download', {
    type: 'png',
  });
}


</script>

<template>
  <div class="canvas-container" >
    <canvas ref="previewCanvas" />
    <div class="canvas-actions">
      <button  class="save-button" v-if="props.showSaveButton" @click="saveImage">Download HD Image</button>
    </div>
  </div>

</template>

<style scoped>

</style>
