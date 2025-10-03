export class GameScene extends Phaser.Scene {
  public isGameRunning: boolean = false

  gameHeight (): number {
    return Number(this.game.config.height)
  }

  gameWidth (): number {
    return Number(this.game.config.width)
  }
}
