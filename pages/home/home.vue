<template>
  <div class="tpl-home">
    coucou 4
    <!-- <img :src="require(`../../static/images/${datas.projects[0].image}`)" alt=""> -->
  </div>
</template>

<script>
import './style.less'
// import {Texture, Plane, Mesh, Program, Vec2, Vec3 }  from 'ogl'
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
    console.log(Data.projects[0].image)
    this.emitter = {}
    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    console.log(this)
    this.initOgl()
  },
  methods: {
    initOgl() {
       import('../../assets/js/mainScene').then((el) => {
        this.Scene = el.default
        this.Scene.init()
      })
    },
    
    initTexts() {

    }
  }
}
</script>
