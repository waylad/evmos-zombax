import { state } from '../state/state'
import { CarToken } from '../state/stateTypes'
import { getTronLink } from './tronLink'

const ZombaxAbi = require('./abi/Zombax.json')

declare var window: any
const contractAddress = "TSyAsSP1SoUpiVi2ouaydnLFpZHo92Pkxe"
const contractAddressHex = "41ba785befeba720d17297e14a125cc481d0c0ece3"
let contractInstance;

export const connectWallet = async () => {
  const tronLink = await getTronLink()
  const res: any = await tronLink?.request({ method: 'tron_requestAccounts' })

  if(res) {
    try{
      contractInstance = tronLink?.tronWeb.contract(ZombaxAbi.abi, contractAddress)
      const name = await contractInstance.name().call()
      console.log(name)
    } catch (e: any) {
      console.log(e)
       alert("Please connect to the Nile Testnet ")
    }
  } else {
    alert("Please unlock your Tronlink Wallet ")
  }

    // await contractInstance.mintCollectable(address, "https://zombax.io/assets/cars/00000000.json", "Genesis Car", 30000000, true).send({
    //   callValue: 0,
    //   shouldPollResponse: true,
    // })
    // await contractInstance.mintCollectable(address, "https://zombax.io/assets/cars/00000110.json", "Genesis Car", 70000000, true).send({
    //   callValue: 0,
    //   shouldPollResponse: true,
    // })
    // await contractInstance.mintCollectable(address, "https://zombax.io/assets/cars/00000030.json", "Genesis Car", 200000000, true).send({
    //   callValue: 0,
    //   shouldPollResponse: true,
    // })
    // await contractInstance.mintCollectable(address, "https://zombax.io/assets/cars/01010330.json", "Genesis Car", 10000000, true).send({
    //   callValue: 0,
    //   shouldPollResponse: true,
    // })
    // await contractInstance.mintCollectable(address, "https://zombax.io/assets/cars/01010220.json", "Genesis Car", 10000000, true).send({
    //   callValue: 0,
    //   shouldPollResponse: true,
    // })
    // await contractInstance.mintCollectable(address, "https://zombax.io/assets/cars/01000110.json", "Genesis Car", 40000000, true).send({
    //   callValue: 0,
    //   shouldPollResponse: true,
    // })
    
}

export const getCars = async () => {
    const ownedCarsIds = await contractInstance.getTokensOwnedByMe().call()
  console.log('ownedCarsIds', ownedCarsIds)
  ownedCarsIds.forEach(async (ownedCarsId) => {
    // const carMeta = await carsContractWithSigner.tokenMeta(ownedCarsId)
    const carMeta = await contractInstance.tokenMeta(ownedCarsId).call()
    state.ownedCars.push({
      tokenId: carMeta[0].toNumber(),
      carCode: carMeta[3].replace('https://zombax.io/assets/cars/', '').replace('.json', ''),
      price: carMeta[1].toNumber(),
      owned: true,
    })
  })
  console.log(state.ownedCars)

  // const onSaleCarsIds = await carsContractWithSigner.getAllOnSale()
  const onSaleCarsIds = await contractInstance.getAllOnSale().call()
  console.log('onSaleCarsIds', onSaleCarsIds)
  onSaleCarsIds.forEach(async (onSaleCar) => {
    state.onSaleCars.push({
      tokenId: onSaleCar[0].toNumber(),
      carCode: onSaleCar[3].replace('https://zombax.io/assets/cars/', '').replace('.json', ''),
      price: onSaleCar[1].toNumber(),
      owned: false,
    })
  })
  console.log(state.onSaleCars)
}

export const buyCar = async (carToken: CarToken) => {
  const tx = await contractInstance.purchaseToken(carToken.tokenId).send({
    callValue: carToken.price,
    shouldPollResponse: true,
  })
  console.log(tx)
}

export const sellCar = async (carToken: CarToken, price: number) => {
  const tx = await contractInstance.setTokenSale(carToken.tokenId, true, price).send({
    callValue: 0,
    shouldPollResponse: true,
  })
  console.log(tx)
}

export const upgradeCar = async (carToken: CarToken) => {
  const tx = await contractInstance.updateTokenUri(carToken.tokenId, `https://zombax.io/assets/cars/${carToken.carCode}.json`).send({
    callValue: 0,
    shouldPollResponse: true,
  })
  console.log(tx)
}