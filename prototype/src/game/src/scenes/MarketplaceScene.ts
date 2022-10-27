import { getCars, buyCar, sellCar } from '../blockchain/lib'
import { state } from '../state/state'

export class MarketplaceScene extends Phaser.Scene {
  constructor() {
    super({
      key: 'Marketplace',
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
      'background',
    )

    this.add.image(100 + 700, 25 + 30, 'header')
    const allCars = [...state.ownedCars, ...state.onSaleCars]

    for (let i = 0; i < 8; i++) {
      let car = allCars[i]

      // Car Boost Weight Gun Gear Armor Wheel Fuel
      // CBWGGAWF
      // 01010330

      if (car && car.carCode) {
        const carCell = this.add.image(0, 0, 'car-cell')
        const partCar = this.add.image(0, 0, `car${car.carCode[0]}`)
        const partBoost = this.add.image(0, 0, `boost${car.carCode[1]}`)
        const partWeight = this.add.image(0, 0, `weight${car.carCode[2]}`)
        const partGun = this.add.image(0, 0, `gun${car.carCode[3]}`)
        const partGear = this.add.image(0, 0, `gear${car.carCode[4]}`)
        const partArmor = this.add.image(0, 0, `armor${car.carCode[5]}`)
        const partWheel = this.add.image(0, 0, `wheel${car.carCode[6]}`)
        const partFuel = this.add.image(0, 0, `fuel${car.carCode[7]}`)

        const text = this.add
          .text(0, 130, car.owned ? 'OWNED' : `${car.price} E`, {
            fontFamily: 'Electrolize',
            align: 'center',
            wordWrap: { width: 257, useAdvancedWrap: true },
          })
          .setFontSize(14)
          .setOrigin(0.5)

        let buttonBuy: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
        if (!car.owned) buttonBuy = this.add.image(0, 167, 'button-buy-car')
        buttonBuy.setInteractive({ cursor: 'pointer' })
        buttonBuy.on('pointerdown', async () => {
          await buyCar(car)
          await getCars()
          this.scene.restart()
        })

        let buttonSelect: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
        if (car.owned) buttonSelect = this.add.image(-70, 167, 'button-select-car')
        buttonSelect.setInteractive({ cursor: 'pointer' })
        buttonSelect.on('pointerdown', async () => {
          state.currentCar = car
          this.scene.start('Garage')
        })

        let buttonSell: any = new Phaser.GameObjects.Text(this, 0, 0, '', {})
        if (car.owned) buttonSell = this.add.image(70, 167, 'button-sell-car')
        buttonSell.setInteractive({ cursor: 'pointer' })
        buttonSell.on('pointerdown', async () => {
          const price = parseInt(prompt('Please enter your price', '1') || '1')
          await sellCar(car, price)
          await getCars()
        })

        let container = this.add.container(
          this.sys.canvas.width / 2 - 450 + (i % 4) * 300,
          this.sys.canvas.height / 2 - 150 + (i < 4 ? 0 : 350),
          [
            carCell,
            text,
            partCar,
            partBoost,
            partWeight,
            partGun,
            partGear,
            partArmor,
            partWheel,
            partFuel,
            buttonBuy,
            buttonSelect,
            buttonSell,
          ],
        )

        container.setSize(257, 306)
      }
    }

    const buttonBack = this.add.image(90, this.sys.canvas.height - 90, 'left-arrow')
    buttonBack.setInteractive({ cursor: 'pointer' })
    // buttonBack.on('pointerover', () => buttonBack.setTexture('buttonBackHover'))
    // buttonBack.on('pointerout', () => buttonBack.setTexture('buttonBack'))
    buttonBack.on('pointerdown', () => {
      this.scene.start('Garage')
    })
  }

  update(): void {}
}
