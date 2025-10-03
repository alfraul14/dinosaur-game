import Phaser from 'phaser'
import { MyScenes, PRELOAD_CONFIG } from '../main'
import { Player } from '../entities/Player'
import { SpriteWithDynamicBody } from '../types'
import { GameScene } from './GameScene'
import { MY_RESOURCES, ObstacleKey } from './PreloadScene'

const DEFAULT_SPEED = 5
const DEFAULT_SPAWN_TIME = 0
export class MainScene extends GameScene {
  protected player!: Player
  protected ground!: Phaser.GameObjects.TileSprite
  protected obstacles!: Phaser.Physics.Arcade.Group
  protected clouds!: Phaser.Physics.Arcade.Group
  protected startTrigger!: SpriteWithDynamicBody
  private spawnTime = DEFAULT_SPAWN_TIME
  private readonly spawnInterval = 1500
  private gameSpeed = DEFAULT_SPEED
  protected gameOvertContainer!: Phaser.GameObjects.Container
  protected gameOvertText!: Phaser.GameObjects.Image
  protected restartText!: Phaser.GameObjects.Image

  constructor () {
    super(MyScenes.MainScene.name)
  }

  create (): void {
    this.createEnvironment()
    this.createPlayer()
    this.createObstacles()
    this.createGameOverContainer()
    this.handleGameStart()
    this.handleObstacleCollision()
    this.handleGameRestart()
    this.createAnimations()
  }

  handleGameRestart (): void {
    this.restartText.on('pointerdown', () => {
      this.physics.resume()
      this.player.setVelocityY(0)
      this.obstacles.clear(true, true)
      this.gameOvertContainer.setAlpha(0)
      this.anims.resumeAll()
      this.isGameRunning = true
    })
  }

  handleObstacleCollision (): void {
    this.physics.add.collider(this.obstacles, this.player, () => {
      this.isGameRunning = false
      this.physics.pause()
      this.anims.pauseAll()
      this.player.die()
      this.gameOvertContainer.setAlpha(1)
      this.spawnTime = DEFAULT_SPAWN_TIME
      this.gameSpeed = DEFAULT_SPEED
    })
  }

  handleGameStart (): void {
    this.startTrigger = this.physics.add.sprite(0, 10, '')
      .setAlpha(0)
      .setOrigin(0, 1)
    this.physics.add.overlap(this.startTrigger, this.player, () => {
      if (this.startTrigger.y === 10) {
        this.startTrigger.body.reset(0, this.gameHeight())
        return
      }

      this.startTrigger.body.reset(9999, 9999)
      const rollOutEvent = this.time.addEvent({
        delay: 1000 / 60,
        loop: true,
        callback: () => {
          this.player.playRunAnimation()
          this.player.setVelocityX(80)
          this.ground.width += (17 * 2)

          if (this.ground.width >= this.gameWidth()) {
            rollOutEvent.remove()
            this.ground.width = this.gameWidth()
            this.player.setVelocityX(0)
            this.isGameRunning = true
          }
        }
      })
    })
  }

  createGameOverContainer (): void {
    this.gameOvertText = this.add.image(0, 0, MY_RESOURCES.gameOver.id)
    this.restartText = this.add.image(0, 80, MY_RESOURCES.restart.id).setInteractive()
    this.gameOvertContainer = this.add
      .container(this.gameWidth() / 2, (this.gameHeight() / 2) - 50)
      .add([this.gameOvertText, this.restartText])
      .setAlpha(0)
  }

  createObstacles (): void {
    this.obstacles = this.physics.add.group()
  }

  update (time: number, delta: number): void {
    if (!this.isGameRunning) { return }
    this.spawnTime += delta
    if (this.spawnTime >= this.spawnInterval) {
      this.spawnObstacle()
      this.spawnTime = 0
    }
    Phaser.Actions.IncX(this.obstacles.getChildren(), -this.gameSpeed)
    this.obstacles.getChildren().forEach((obstacle) => {
      if (obstacle instanceof Phaser.Physics.Arcade.Sprite) {
        if (obstacle.getBounds().right < 0) {
          this.obstacles.remove(obstacle)
        }
      }
    })
    this.ground.tilePositionX += this.gameSpeed
  }

  createPlayer (): void {
    this.player = new Player(this, 0, this.gameHeight())
  }

  createEnvironment (): void {
    this.ground = this.add.tileSprite(0, this.gameHeight(), 88, 26, 'ground').setOrigin(0, 1)
    this.clouds = this.clouds.addMultiple([
      this.add.image(this.gameWidth() / 2, 170, MY_RESOURCES.cloud.id),
      this.add.image(this.gameWidth() - 80, 80, MY_RESOURCES.cloud.id),
      this.add.image(this.gameWidth() / 1.3, 100, MY_RESOURCES.cloud.id)
    ])
  }

  createAnimations (): void {
    this.anims.create({
      key: MY_RESOURCES.enemyBird.id,
      frames: this.anims.generateFrameNumbers(MY_RESOURCES.enemyBird.id),
      frameRate: 6,
      repeat: -1
    })
  }

  spawnObstacle (): void {
    const obstaclesCount = PRELOAD_CONFIG.cactusesCount + PRELOAD_CONFIG.birdsCount
    const obstacleNumber = Math.floor(Math.random() * obstaclesCount) + 1
    const distance = Phaser.Math.Between(150, 300)
    const enemySpawnDistance = this.gameWidth() + distance
    let obstacle: Phaser.Physics.Arcade.Sprite

    if (obstacleNumber > PRELOAD_CONFIG.cactusesCount) {
      const enemyPosibleHeight = [20, 70]
      const enemyHeight = enemyPosibleHeight[Math.floor(Math.random() * 2)]
      obstacle = this.obstacles
        .create(enemySpawnDistance, this.gameHeight() - enemyHeight, MY_RESOURCES.enemyBird.id)
      obstacle.play(MY_RESOURCES.enemyBird.id, true)
    } else {
      const obstacleKey = `obstacle${obstacleNumber}` as ObstacleKey
      obstacle = this.obstacles
        .create(enemySpawnDistance, this.gameHeight(), MY_RESOURCES[obstacleKey].id)
    }
    obstacle
      .setOrigin(0, 1)
      .setImmovable()
  }
}
