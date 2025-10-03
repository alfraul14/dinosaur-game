import Phaser from 'phaser'
import { MyScenes } from '../main'

interface BaseResource {
  id: string
  source: string
  type?: ResourceType
}

interface AnimationResource extends BaseResource {
  type: typeof TypeResource.animation
  width: number
  height: number
}

type Resource = BaseResource | AnimationResource

const TypeResource = {
  image: 'image',
  animation: 'animation'
} as const
export type ResourceType = typeof TypeResource[keyof typeof TypeResource]

// --- aquí el truco ---
export const MY_RESOURCES = {
  ground: { id: 'ground', source: 'assets/ground.png' },
  dinoIdle: { id: 'dino-idle', source: 'assets/dino-idle-2.png' },
  dinoHurt: { id: 'dino-hurt', source: 'assets/dino-hurt.png' },
  cloud: { id: 'cloud', source: 'assets/cloud.png' },
  obstacle1: { id: 'obstacle1', source: 'assets/cactuses_1.png' },
  obstacle2: { id: 'obstacle2', source: 'assets/cactuses_2.png' },
  obstacle3: { id: 'obstacle3', source: 'assets/cactuses_3.png' },
  obstacle4: { id: 'obstacle4', source: 'assets/cactuses_4.png' },
  obstacle5: { id: 'obstacle5', source: 'assets/cactuses_5.png' },
  obstacle6: { id: 'obstacle6', source: 'assets/cactuses_6.png' },
  restart: { id: 'restart', source: 'assets/restart.png' },
  gameOver: { id: 'game-over', source: 'assets/game-over.png' },
  dinoRun: { id: 'dino-run', source: 'assets/dino-run.png', type: TypeResource.animation, width: 88, height: 94 },
  dinoDown: { id: 'dino-down', source: 'assets/dino-down-2.png', type: TypeResource.animation, width: 118, height: 94 },
  enemyBird: { id: 'enemy-bird', source: 'assets/enemy-bird.png', type: TypeResource.animation, width: 92, height: 77 }

} as const satisfies Record<string, Resource>

// tipo de claves
export type ResourceKey = keyof typeof MY_RESOURCES
export type ObstacleKey = Extract<ResourceKey, `obstacle${number}`>

function isAnimationResource (resource: Resource): resource is AnimationResource { return resource.type === TypeResource.animation }
export class PreloadScene extends Phaser.Scene {
  constructor () {
    super(MyScenes.PreloadScene.name)
  }

  preload (): void {
    Object.values(MY_RESOURCES).forEach(resource => {
      if (
        isAnimationResource(resource)
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
