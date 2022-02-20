<template>
  <div class="tpl-home">
    <h1>Mobius Test</h1>  
  </div>
</template>

<script>
import './style.less'
import Emitter from 'event-emitter'
import Data from '@/assets/data/data.json'

export default {
  name: 'Home',
  data(){
    return {
      datas: Data
    }
  },
  mounted() {
    this.emitter = {}
    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.initOgl()
  },
  methods: {
    initOgl() {
       import('../../assets/js/mainScene').then((el) => {
        this.Scene = el.default
        this.Scene.init()
      })
    },
  }
}
</script>
