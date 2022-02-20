import * as dat from 'dat.gui'
// let controlKit = new ControlKit()

// const savedConfig = require('./config.js')
// const defaultConfig = require('./defaultConfig')

class DebugController {
  constructor () {
    this.active = true

    this.init()
    this.types = ['config']
    this.configs = {}
  }

  queryDebug () {
    // const url = window.location.href
    // let name = 'dev'
    // name = name.replace(/[[]]/g, '\\$&')

    // const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)')
    // const results = regex.exec(url)
    // if (results) { return decodeURIComponent(results[2].replace(/\+/g, ' ')) === 'true' }
    // return false
  }

  init () {
    this.panel = new dat.GUI({
      name: 'Debug GUI',
      autoPlace: false,
      closed: false,
      width: 300
    })
    const obj = {
      print: () => {
        this.print()
      }
    }
    // const defaultObj = {
    //   defaultValue: () => {
    //     this.printDefault()
    //   }
    // }
    this.panel.add(obj, 'print')
    // this.panel.add(defaultObj, 'defaultValue')
    this.panel.domElement.style.position = 'fixed'
    this.panel.domElement.style.zIndex = '10000'
    this.panel.domElement.style.top = '0'
    this.panel.domElement.style.right = '0'
    this.panel.domElement.classList.add('gui-custom')

    if (!this.active) {
      this.panel.destroy()
    } else {
      // document.body.appendChild(this.panel.domElement)
    }
  }

  createModal () {

  }

  print () {
    // console.log(JSON.stringify(this.configs))
  }

  printDefault () {
    // console.log(JSON.stringify(defaultConfig))
  }

  register (type, object, id) {
    if (this.types.includes(type) === -1) {
      console.error('Type of params not valid')
      return
    }
    this['add_' + type](object, id)
  }

  addConfig (object, id) {
    if (this.panel.__folders[id] !== undefined) {
      this.panel.__folders[id].close()
      this.panel.__ul.removeChild(this.panel.__folders[id].domElement.parentNode)
      delete this.panel.__folders[id]
      this.panel.onResize()
    }
    this.configs[id] = object

    const group = this.panel.addFolder(id)
    for (const key in object) {
      if (!Object.prototype.hasOwnProperty.call(object, key)) {
        continue
      }
      const sub = object[key]

      // if (savedConfig[id] && savedConfig[id][key]) {
      //   sub.value = savedConfig[id][key].value
      // }

      if (sub.guiType === 'color') {
        group.addColor(sub, 'value').name(key)
      } else if (sub.guiType === 'list') {
        group.addStringInput(sub, 'value', { presets: sub.presets, label: key })
      } else {
        group.add(sub, 'value', sub.range[0], sub.range[1]).name(key)
      }
    }
    return group
  }
}

const Export = new DebugController()
export default Export
