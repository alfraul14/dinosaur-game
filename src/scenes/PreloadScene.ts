import Phaser from 'phaser'
import { MyScenes } from '../main'

const TypeResource = {
  image: 'image',
  animation: 'animation'
} as const
export type ResourceType = keyof typeof TypeResource

export const MY_RESOURCES = {
  ground: { id: 'ground', source: 'assets/ground.png' },
  dinoIdle: { id: 'dino-idle', source: 'assets/dino-idle-2.png' },
  dinoRun: { id: 'dino-run', source: 'assets/dino-run.png', type: TypeResource.animation, width: 88, height: 94 }
}

export class PreloadScene extends Phaser.Scene {
  constructor () {
    super(MyScenes.PreloadScene.name)
  }

  preload (): void {
    Object.values(MY_RESOURCES).forEach(resource => {
      if (
        'type' in resource && resource.type === TypeResource.animation
      ) {
        this.load.spritesheet(resource.id, resource.source, {
          frameWidth: resource.width,
          frameHeight: resource.height
        })
        return
      }
      this.load.image(resource.id, resource.source)
    })

    this.load.on('fileComplete', (key: string) => {
      console.log(`✅ ${key} cargado`)
    })
  }

  create (): void {
    this.scene.start(MyScenes.MainScene.name)
  }
}
