import { GameScene } from '../scenes/GameScene'
import { MY_RESOURCES } from '../scenes/PreloadScene'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private readonly gameScene: GameScene
  constructor (scene: GameScene, x: number, y: number) {
    super(scene, x, y, MY_RESOURCES.dinoRun.id)
    this.gameScene = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)
    this.init()
    this.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    this.registerAnimation()
  }

  init (): void {
    if (this.scene.input.keyboard != null) {
      this.cursors = this.scene.input.keyboard?.createCursorKeys()
    }
    this
      .setOrigin(0, 1)
      .setGravityY(5000)
      .setCollideWorldBounds(true)
      .setBodySize(44, 92)
      .setOffset(20, 0)
      .setDepth(1)
  }

  playRunAnimation (): void {
    if (this.body?.height !== undefined) {
      this.body?.height <= 58
        ? this.play(MY_RESOURCES.dinoDown.id, true)
        : this.play(MY_RESOURCES.dinoRun.id, true)
    }
  }

  registerAnimation (): void {
    this.anims.create({
      key: MY_RESOURCES.dinoRun.id,
      frames: this.anims.generateFrameNames(MY_RESOURCES.dinoRun.id, { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
    this.anims.create({
      key: MY_RESOURCES.dinoDown.id,
      frames: this.anims.generateFrameNames(MY_RESOURCES.dinoDown.id),
      frameRate: 10,
      repeat: -1
    })
  }

  die (): void {
    this.anims.pause()
    this.setTexture(MY_RESOURCES.dinoHurt.id)
  }

  update (): void {
    const { space, down } = this.cursors
    const spaceIsJustDown = Phaser.Input.Keyboard.JustDown(space)
    const isDownJustDown = Phaser.Input.Keyboard.JustDown(down)
    const isDownJustUp = Phaser.Input.Keyboard.JustUp(down)

    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor()
    if (spaceIsJustDown && onFloor) {
      this.setVelocityY(-1600)
    }
    if (isDownJustDown && onFloor) {
      this.body?.setSize(this.body.width, 58)
      this.setOffset(60, 34)
    }

    if (isDownJustUp && onFloor) {
      this.body?.setSize(44, 92)
      this.setOffset(20, 0)
    }

    if (!this.gameScene.isGameRunning) {
      return
    }
    this.playRunAnimation()
    if (this.body?.deltaAbsY() !== undefined && this.body?.deltaAbsY() > 0) {
      this.anims.stop()
      this.setTexture(MY_RESOURCES.dinoRun.id, 0)
    } else {
      this.playRunAnimation()
    }
  }
}
