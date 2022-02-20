import { vec2 } from 'gl-matrix'
import Emitter from 'event-emitter'
import Bowser from 'bowser'
import RAF from './Raf'
// import DebugController from '@/glxp/debug/debugController'

const _VEC2 = vec2.create()

class Mouse {
  constructor (target) {
    this.cursor = vec2.fromValues(0, 0)
    this.cursorReel = vec2.fromValues(0, 0)
    this.dampedCursorReel = vec2.fromValues(0, 0)
    this.lastCursor = vec2.fromValues(0, 0)
    this.velocity = vec2.fromValues(0, 0)
    this.dampedCursor = vec2.fromValues(0.5, 0.5)

    this.target = target || window
    this.wheelVelocity = vec2.fromValues(0, 0)
    this.wheel = vec2.fromValues(0, 0)
    this.lastWheel = vec2.fromValues(0, 0)
    this.screenWidth = window.innerWidth
    this.screenHeight = window.innerHeight
    this.isDown = false
    this.wheelDir = null
    this.emitter = {}

    this.preventDamping = false

    Emitter(this.emitter)
    this.on = this.emitter.on.bind(this.emitter)
    this.off = this.emitter.off.bind(this.emitter)

    RAF.suscribe('mouse', () => { this.update() })

    this.config = {
      damping: { value: 0.1, range: [0, 0.5] }
    }

    // DebugController.addConfig(this.config, 'Mouse')

    this.isMobile = Bowser.getParser(window.navigator.userAgent).parsedResult.platform.type === 'mobile'

    this.initEvents()
  }

  initEvents () {
    this.target.addEventListener('touchstart', (event) => { this.onDown(event.touches[0]) }, { passive: false })
    this.target.addEventListener('touchend', (event) => { this.onUp(event) }, { passive: false })
    this.target.addEventListener('touchmove', (event) => { this.onMove(event.touches[0], event) }, { passive: false })

    this.target.addEventListener('mousedown', (event) => { this.onDown(event) })
    this.target.addEventListener('mousemove', (event) => { this.onMove(event) })
    this.target.addEventListener('mouseup', (event) => { this.onUp(event) })

    this.target.addEventListener('wheel', (event) => { this.onWheel(event) })

    this.target.addEventListener('click', () => { this.emitter.emit('click') })
    this.target.addEventListener('resize', () => {
      this.screenWidth = window.innerWidth
      this.screenHeight = window.innerHeight
    })
  }

  onDown (event) {
    this.cursor[0] = (event.clientX / this.screenWidth - 0.5) * 2
    this.cursor[1] = (event.clientY / this.screenHeight - 0.5) * 2
    this.lastCursor[0] = this.cursor[0]
    this.lastCursor[1] = this.cursor[1]
    this.checkDrag = vec2.fromValues(this.cursor[0], this.cursor[1])
    this.isDown = true
    this.currentEvent = event
    this.emitter.emit('down', this)
  }

  onUp (e) {
    this.isDown = false
    this.dragedVal = vec2.create()

    vec2.sub(this.dragedVal, this.checkDrag, this.cursor)
    this.currentEvent = e
    this.emitter.emit('up', this)
  }

  onWheel (event) {
    this.lastWheel[0] = this.wheel[0]
    this.lastWheel[1] = this.wheel[1]
    this.wheel[0] = event.deltaX
    this.wheel[1] = event.deltaY
    this.wheelDir = event.deltaY < 0 ? 'up' : 'down'
    this.emitter.emit('wheel', this)
  }

  onMove (event, e) {
    if (e && e.touches.length === 2) {
      const touch1 = vec2.fromValues(e.touches[0].clientX, e.touches[0].clientY)
      const touch2 = vec2.fromValues(e.touches[1].clientX, e.touches[1].clientY)
      this.distance = Math.sqrt(Math.pow(touch1[0] - touch2[0], 2) + Math.pow(touch1[1] - touch2[1], 2))
      this.difference = this.distance - this.prevDist

      this.difference > 0 ? this.emitter.emit('pinch', 'in') : this.emitter.emit('pinch', 'out')

      this.prevDist = this.distance
    } else {
      this.cursor[0] = (event.clientX / this.screenWidth - 0.5) * 2
      this.cursor[1] = (event.clientY / this.screenHeight - 0.5) * 2
      this.cursorReel[0] = event.clientX
      this.cursorReel[1] = event.clientY
      // this.currentEvent = event
      // if (!this.isMobile) this.currentEvent.composedPath = event.composedPath()
      this.emitter.emit('move', this)
      if (this.isDown) { this.emitter.emit('drag', this) }
    }
  }

  update () {
    this.velocity[0] = this.cursor[0] - this.lastCursor[0]
    this.velocity[1] = this.cursor[1] - this.lastCursor[1]
    this.wheelVelocity[0] = this.wheel[0] - this.lastWheel[0]
    this.wheelVelocity[1] = this.wheel[1] - this.lastWheel[1]
    this.lastCursor[0] = this.cursor[0]
    this.lastCursor[1] = this.cursor[1]

    if (!this.preventDamping) {
      vec2.sub(_VEC2, this.cursor, this.dampedCursor)
      vec2.scale(_VEC2, _VEC2, this.config.damping.value)
      vec2.add(this.dampedCursor, this.dampedCursor, _VEC2)

      vec2.sub(_VEC2, this.cursorReel, this.dampedCursorReel)
      vec2.scale(_VEC2, _VEC2, this.config.damping.value)
      vec2.add(this.dampedCursorReel, this.dampedCursorReel, _VEC2)
    }
  }
}

const out = new Mouse()
export default out
