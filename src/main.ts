import { MainScene } from './scenes/MainScene'
import { PreloadScene } from './scenes/PreloadScene'
import './style.css'
import Phaser, { Game } from 'phaser'

export const PRELOAD_CONFIG = {
  cactusesCount: 6,
  birdsCount: 1
}
export const MyScenes = {
  PreloadScene: { id: 1, name: 'PreloadScene', Class: PreloadScene },
  MainScene: { id: 2, name: 'MainScene', Class: MainScene }
}

const initScenes = (): Phaser.Scene[] => {
  return Object.values(MyScenes)
    .map(scene => new scene.Class())
}
const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1000,
  height: 340,
  pixelArt: true,
  transparent: true,
  parent: 'game-container',
  backgroundColor: '#000',
  physics: {
    default: 'arcade',
    arcade: {
      // gravity: { y: 200 },
      debug: true
    }
  },
  scene: initScenes()
}

export default new Game(config)
