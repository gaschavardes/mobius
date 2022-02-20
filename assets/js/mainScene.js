import {
  Renderer,
  Camera,
  Transform,
  Vec3,
  Orbit
} from 'ogl'
import Emitter from 'event-emitter'
import Bowser from 'bowser'
import Stack from './stack'
class Scene {
  constructor () {
    this.time = 0
    this.scroll = 0
    this.scrollTarget = 0
    this.stacks = []
    this.count = 70 //80
    this.radius = 1.8
    this.isMobile = Bowser.getParser(window.navigator.userAgent).parsedResult.platform.type !== 'desktop'
    this.windowHeight = window.innerHeight
  }

  init () {
    this.emitter = {}
    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)
    this.renderer = new Renderer({
      dpr: window.devicePixelRatio,
      alpha: true,
      transparency: true
    })
    this.gl = this.renderer.gl
    
    this.container = document.createElement('div')
    this.container.classList.add('canvas-container')
    this.container.style.height = window.innerHeight + 'px'
    this.container.style.width = window.innerWidth + 'px'
    this.container.appendChild(this.gl.canvas)
    document.body.appendChild(this.container)

    this.gl.clearColor(1, 0, 0, 0)
    this.camera = new Camera(this.gl, {
      fov: 35
    })
    

    import('./Raf').then((el) => {
      this.Raf = el.default
      this.Raf.suscribe('scene', () => { this.update() })

    })
    this.config = {
      progress: { value: 1, range: [0, 1] },
      uCircleSize: { value: 0.1, range: [0.1, 15] },
      rez: { value: window.innerWidth / window.innerHeight, range: [0, 30] },
      rotationy: { value: 0, range: [-Math.PI, Math.PI] },
      rotationx: { value: 0, range: [-Math.PI, Math.PI] }
    }
    import('./debugController').then((el) => {
      this.DebugController = el.default
      this.setController()
    })


    this.camera.position.set(this.isMobile ? 20 : 12, 0, 0)
    this.camera.lookAt([0, 0, 0])
    this.controls = new Orbit(this.camera);
    this.scene = new Transform()

    this.resize()
    this.setStack()

    window.addEventListener('resize', this.resize.bind(this))
  }

  setStack() {
    for (let i = 0; i < this.count; i++) {
      let y = this.radius * Math.cos(2 * Math.PI / (this.count / i));
      let z = this.radius * Math.sin(2 * Math.PI / (this.count / i));
      let degX = (2 * Math.PI / (this.count / i))
      let degZ = (Math.PI * 2) / (this.count / i)
      let stack = new Stack(this, new Vec3(0, y, z), new Vec3(degX, 0 , degZ))
      this.stacks.push(stack)
    }
  }


  setController () {
    this.DebugController.addConfig(this.config, 'Position')
  }

  resize () {
    // if (!this.isMobile) {
      this.container.style.height = window.innerHeight + 'px'
      this.container.style.width = window.innerWidth + 'px'
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.perspective({ aspect: this.gl.canvas.width / this.gl.canvas.height });
    // }
  }


  destroy () {
    if (this.Raf) {
      setTimeout(() => {
        this.scene.children.forEach((el) => {
          this.scene.removeChild(el)
          requestAnimationFrame(() => {
            this.update()
          })
        })
        this.Raf.unsuscribe('scene')
        this.scene.children = []
      }, 1000)
    }
  }

  resume () {
    if (this.Raf) {
      this.Raf.suscribe('scene', () => { this.update() })
    } else {
      import('./Raf').then((el) => {
        this.Raf = el.default
        this.Raf.suscribe('scene', () => { this.update() })
      })
    }
  }

  update () {
    this.time++
    this.controls.update()
    this.stacks.forEach(el => {
      el.update(this.time * 0.03)
    })

    this.renderer.render({
      scene: this.scene,
      camera: this.camera
    })
  }
}
const out = new Scene()
export default out
