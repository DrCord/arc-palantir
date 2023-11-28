<template>
  <div class="idle-view" :class="{isIdle: displayIdleOverlay}">
    <div class="overlay"></div>
    <sprite ref='sprite'
      sprite-id="touch"
      :sprite-src="require('../assets/touch.png')"
      :sprite-name="'touch.png'"
      :sprite-w='180'
      :sprite-h='215'
    ></sprite>
  </div>
</template>

<script>
'use strict'

import Sprite from './Sprite'

export default {
  components: {
    Sprite
  },
  props: {
    overlayDisplayTimeout: {
      type: Number,
      default: 0
    },
    sessionValid: Boolean
  },
  onIdle () {
    this.onAppIdle()
  },
  onActive () {
    this.onAppActive()
  },
  data () {
    return {
      timedOut: false,
      timeoutCounter: null
    }
  },
  computed: {
    displayIdleOverlay () {
      return this.timedOut && this.sessionValid
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      this.setIdle()
    },
    onAppActive () {
      this.$refs.sprite.stop()
      clearTimeout(this.timeoutCounter)
      this.timedOut = false
      this.$emit('idle', false)
      this.$emit('timed-out', false)
    },
    onAppIdle () {
      this.setIdle()
    },
    onAppTimeout (self) {
      self.timedOut = true
      self.$emit('timed-out', true)
      if (self.$refs.sprite) {
        self.$refs.sprite.play()
      }
    },
    setIdle () {
      const self = this
      this.$emit('idle', true)
      this.timeoutCounter = setTimeout(function () { self.onAppTimeout(self) }, this.overlayDisplayTimeout)
    }
  }
}
</script>

<style>
.idle-view {
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  z-index: 8888;

  pointer-events: none;
  display: none;
}
.idle-view.isIdle {
  pointer-events: all;
  display: block;
}
.idle-view .sprite {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  height: 10px;
  width: 180px;
  z-index: 9999;
  -webkit-transform: scale(0.7);
}
.idle-view .overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 8888;

  background: #000;
  opacity: 0;
  /*-webkit-animation: SlowMo 5s cubic-bezier(0.77, 0, 0.175, 1) infinite;*/
  -webkit-transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1);
  transition: opacity 800ms cubic-bezier(0.77, 0, 0.175, 1);
}
.idle-view.isIdle .overlay {
  opacity: 0.6;
}
@-webkit-keyframes SlowMo {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
@keyframes SlowMo {
  0%{background-position:0% 50%}
  50%{background-position:100% 50%}
  100%{background-position:0% 50%}
}
</style>
