import { GameScene } from '../scenes/GameScene'
import { MY_RESOURCES } from '../scenes/PreloadScene'

export class Player extends Phaser.Physics.Arcade.Sprite {
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  constructor (scene: GameScene, x: number, y: number) {
    super(scene, x, y, MY_RESOURCES.dinoIdle.id)
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
      .setGravityY(200)
      .setCollideWorldBounds(true)
      .setSize(44, 92)
  }

  playRunAnimation (): void {
    this.play(MY_RESOURCES.dinoRun.id, true)
  }

  registerAnimation (): void {
    this.anims.create({
      key: MY_RESOURCES.dinoRun.id,
      frames: this.anims.generateFrameNames(MY_RESOURCES.dinoRun.id, { start: 2, end: 3 }),
      frameRate: 10,
      repeat: -1
    })
  }

  update (): void {
    const { space } = this.cursors
    const spaceIsJustDown = Phaser.Input.Keyboard.JustDown(space)
    const onFloor = (this.body as Phaser.Physics.Arcade.Body).onFloor()
    if (spaceIsJustDown && onFloor) {
      this.setVelocityY(-1600)
    }

    if ((this.scene as any).isGameRunning === false) {
      return
    }
    this.playRunAnimation()
    if (this.body?.deltaAbsY() !== undefined && this.body?.deltaAbsY() > 0) {
      this.anims.stop()
      this.setTexture(MY_RESOURCES.dinoRun.id, 0)
    } else {
      console.log('running')
      this.playRunAnimation()
    }
  }
}
