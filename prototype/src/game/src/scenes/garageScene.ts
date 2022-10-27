import { state } from '../state/state'

export class GarageScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Garage',
    })
  }

  init(): void {}

  preload(): void {}

  create(): void {
    let buttonNext = this.add.image(this.sys.canvas.width - 90, this.sys.canvas.height - 90, 'right-arrow')
    buttonNext.setInteractive({ cursor: 'pointer' })
    // buttonNext.on('pointerover', () => buttonNext.setTexture('buttonNextHover'))
    // buttonNext.on('pointerout', () => buttonNext.setTexture('buttonNext'))
    buttonNext.on('pointerdown', () => {
      this.scene.start('Game')
    })
  }

  update(): void {}
}
