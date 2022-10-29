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
    this.add.tileSprite(
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2,
      this.sys.canvas.width,
      this.sys.canvas.height,
      'bg-garage',
    )

    const car = state.currentCar!
    const carCell = this.add.image(0, 0, 'car-bg')
    const partCar = this.add.image(0, 0, `car${car.carCode[0]}`)
    const partBoost = this.add.image(0, 0, `boost${car.carCode[1]}`)
    const partWeight = this.add.image(0, 0, `weight${car.carCode[2]}`)
    const partGun = this.add.image(0, 0, `gun${car.carCode[3]}`)
    const partGear = this.add.image(0, 0, `gear${car.carCode[4]}`)
    const partArmor = this.add.image(0, 0, `armor${car.carCode[5]}`)
    const partWheel = this.add.image(0, 0, `wheel${car.carCode[6]}`)
    const partFuel = this.add.image(0, 0, `fuel${car.carCode[7]}`)

    let carContainer = this.add.container(this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 50, [
      partCar,
      partBoost,
      partWeight,
      partGun,
      partGear,
      partArmor,
      partWheel,
      partFuel,
    ])

    const upgradeBoost = this.add.image(0, 0, 'boost')
    const upgradeArmor = this.add.image(0, 0, 'armor')
    const upgradeFuel = this.add.image(0, 0, 'fuel')
    const upgradeGear = this.add.image(0, 0, 'gear')
    const upgradeGun = this.add.image(0, 0, 'gun')
    const upgradeWeight = this.add.image(0, 0, 'weight')
    const upgradeWheel = this.add.image(0, 0, 'wheel')


    let buttonNext = this.add.image(this.sys.canvas.width - 200, this.sys.canvas.height - 300, 'button-play')
    buttonNext.setInteractive({ cursor: 'pointer' })
    // buttonNext.on('pointerover', () => buttonNext.setTexture('buttonNextHover'))
    // buttonNext.on('pointerout', () => buttonNext.setTexture('buttonNext'))
    buttonNext.on('pointerdown', () => {
      this.scene.start('Game')
    })
  }

  update(): void {}
}
