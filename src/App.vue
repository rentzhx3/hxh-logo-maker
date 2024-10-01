<script setup>
import {computed, ref} from 'vue'
import LogoCanvas from "./components/LogoCanvas.vue";
import {getRandomEpisode} from "./episodes.js";

const loadingFont = ref(true);

document.fonts.load("1em Archivo Black").then(() => {
  loadingFont.value = false;
});


let randomEpisode = getRandomEpisode();


const topText = ref(randomEpisode.top)
const bottomTextInput = ref(randomEpisode.bottom)
const flipBottomText = ref(true)
const uppercase = ref(true)

const leftInput = ref(randomEpisode.left)
const rightInput = ref(randomEpisode.right)

const centerX = ref(!randomEpisode.right);

const bottomText = computed(() => {
  if (bottomTextInput.value === '') {
    return topText.value
  }
  return bottomTextInput.value
})

const computedLeftText = computed(() => {
  if (uppercase.value) {
    return leftInput.value.toUpperCase()
  }

  return leftInput.value;
});

const computedRightText = computed(() => {
  if (!rightInput.value) {
    return computedLeftText.value
  }
  if (uppercase.value) {
    return rightInput.value.toUpperCase()
  }

  return rightInput.value
});

const computedTopText = computed(() => {
  if (uppercase.value) {
    return topText.value.toUpperCase()
  }
  return topText.value
})

const computedBottomText = computed(() => {
  if (uppercase.value) {
    return bottomText.value.toUpperCase()
  }
  return bottomText.value
})


</script>

<template>
  <div class="container" v-if="!loadingFont">
    <div class="title">
      <LogoCanvas
          topText="LOGO"
          bottomText="MAKER"
          middleTextLeft="HUNTER"
          middleTextRight="HUNTER"
          :fontSize="220"
          :flipBottomText="true"
      />
    </div>
    <div class="content">


      <div class="form">
        <div class="actions">
          <fieldset>
            <legend>
              main
            </legend>
            <label for="topText">Top</label>
            <input name="topText" type="text" v-model="topText"/>
            <label for="bottomText">Bottom (empty to repeat)</label>
            <input type="text" v-model="bottomTextInput" :placeholder="topText"/>

          </fieldset>
          <fieldset>
            <legend>
              Middle text
            </legend>
            <label for="middleTextLeft">Left</label>
            <input name="middleTextLeft" type="text" v-model="leftInput"/>

            <label for="middleTextRight">Right (empty to repeat)</label>
            <input type="text" v-model="rightInput" :placeholder="leftInput"/>
          </fieldset>
          <fieldset>
            <legend>
              General
            </legend>
            <label>
              <input type="checkbox" v-model="flipBottomText"/>
              Flip bottom text
            </label>
            <label>
              <input type="checkbox" v-model="uppercase"/>
              Force Uppercase
            </label>
            <label>
              <input type="checkbox" v-model="centerX"/>
              Center X
            </label>

          </fieldset>


        </div>
      </div>
      <div class="logo-render">
        <LogoCanvas
            :topText="computedTopText"
            :bottomText="computedBottomText"
            :middleTextLeft="computedLeftText"
            :middleTextRight="computedRightText"
            :centerX="centerX"
            :flipBottomText="flipBottomText"
            :showSaveButton="true"
        />
      </div>

    </div>
    <footer>
      <p>
        Created by <a target="_blank" href="https://www.reddit.com/user/rentzhx3">u/rentzhx3</a> <span class="break"></span> for the <a
          target="_blank" href="https://www.reddit.com/r/HunterXHunter">r/HunterXHunter</a> community ❤️
      </p>
    </footer>
  </div>


</template>


