import planeFrag from '@/static/shaders/plane.frag'
import planeVert from '@/static/shaders/plane.vert'

import bubbleFrag from '@/static/shaders/bubble.frag'
import bubbleVert from '@/static/shaders/bubble.vert'
import {Plane, Mesh, Program, Sphere, Texture, Vec3 }  from 'ogl'
export default class Stack{
    constructor(ctx, position, rotation) {
        
        this.ctx = ctx
        this.rotation = rotation
        this.originaDelta = Math.PI
        this.position = position
        this.bubbleCount = 22
        this.spheres = []
        this.init()
    }
    init(){
        console.log('INIT')
        this.createNull()
        this.setBubbles()
    }
    createNull() {
        // console.log(this.position, this.rotation)
        let geometry = new Plane(this.ctx.gl);

        let program = new Program(this.ctx.gl, {
            vertex: planeVert,
            fragment: planeFrag,

            // Don't cull faces so that plane is double sided - default is gl.BACK
            cullFace: null,
        });
        this.null = new Mesh(this.ctx.gl, { geometry: geometry, program });
        this.null.position.set(this.position[0], this.position[1], this.position[2])
        this.null.scale.set(1, 1, 1)
        this.null.rotation.set(this.rotation[0], this.rotation[1], this.rotation[2]);

        this.null.setParent(this.ctx.scene);
    }
    setBubbles() {
        this.textureNormal = new Texture(this.ctx.gl);
        const imgNormal = new Image();
        imgNormal.onload = () => (this.textureNormal.image = imgNormal);
        imgNormal.src = require(`../../static/images/textures/normal.jpg`);

        this.textureBase = new Texture(this.ctx.gl);
        const imgBase = new Image();
        imgNormal.onload = () => (this.textureBase.image = imgNormal);
        imgNormal.src = require(`../../static/images/textures/basecolor.jpg`);

        let geometry = new Sphere(this.ctx.gl);
            let program = new Program(this.ctx.gl, {
                vertex: bubbleVert,
                fragment: bubbleFrag,
                
                // Don't cull faces so that plane is double sided - default is gl.BACK
                cullFace: null,

                uniforms: {
                  // uColor: {
                  //   value: new Vec3(1, 0.5, 0),
                  // },
                  uNormalScale: { value: 2 },
                  uNormalUVScale: { value: 1 },
                  tMap: { value: this.textureBase },
                  tNormal: { value: this.textureNormal },
                  Ka: {
                    value: 1
                  },
                  Kd: {
                    value: 1
                  },
                  Ks: {
                    value: 0.4
                  },
                  shininessVal: {
                    value: 1
                  },
                  ambientColor: {
                    value: new Vec3(1, 1, 1),
                  },
                  diffuseColor: {
                    value: new Vec3(1, 1, 1),
                  },
                  specularColor: {
                    value: new Vec3(1, 1, 1),
                  },
                  lightPos: {
                    value: new Vec3(0, 0, 0),
                  },
                  mode: {
                    value: 1,
                  }
                }
            });
        for (let i = 0; i < this.bubbleCount; i++) {
            const sphere = new Mesh(this.ctx.gl, { geometry: sphere, program });
            sphere = new Mesh(this.ctx.gl, { geometry: geometry, program });
            if(i < 6 ) {
              sphere.originalPos = new Vec3(-0.5 + ((i % 6) * 0.2) , -0.5 + (0.2 * Math.floor(i/6)) , 0)
              sphere.position.set(-0.5 + ((i % 6) * 0.2) , -0.5 + (0.2 * Math.floor(i/6)) , 0)
            } else if (i > 15) {
              sphere.originalPos = new Vec3(-0.5 + ((i % 6) * 0.2) , 0.5 , 0)
              sphere.position.set(-0.5 + ((i % 6) * 0.2) , 0.5 , 0);
            } else {
              sphere.originalPos = new Vec3(0.5 * ((i % 2) * 2 - 1) , -0.5 +  (0.2 * Math.floor((i-4)/2)) , 0)
              sphere.position.set(0.5 * ((i % 2) * 2 - 1) , -0.5 +  (0.2 * Math.floor((i-4)/2)) , 0)
            }
            sphere.scale.set(1/5, 1/5, 1/5);
            sphere.originalScale = 1/5
            sphere.setParent(this.null);
            this.spheres.push(sphere)
            
        }
    }
    update(time) {
      this.null.rotation.set(this.rotation[0], this.rotation[1], this.rotation[2] - time)
      this.spheres.forEach((el) => {
        el.newY = el.originalPos[0] * Math.sin(this.rotation[2] - time) + el.originalPos[1] * Math.cos(this.rotation[2] - time)
        let scale = el.originalScale + ( 0.2 + el.newY) * 0.08
        el.scale.set(scale, scale, scale)
      })
    }
}