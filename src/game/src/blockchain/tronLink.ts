// import type TronWeb from "tronweb";

declare var window: any

export interface TronLinkParams {
  ready: boolean // Initialize to false, true after user authorization
  request: (args: any) => {} // The method of tuning plugins for dapp website
  // tronWeb: TronWeb;
  tronWeb: { [key: string]: any }
}

export interface TronState {
  tronLink: TronLinkParams | null
  isLoading: boolean
  form: {
    name: string | null
    decimals: number | null
    symbol: string | null
    amount: number | null
    address: string | null
  }
  accountAddress: string | null
  network: string | null
  balance: number | null
  tokenAddress: string | null
  tokenBalance: number | null
  transactionId: string | null
  symbol: string | null
}

export function getTronLink(): Promise<TronLinkParams | null> {
  return new Promise((resolve, reject) => {
    if (window.tronLink) {
      handleTronLink()
    } else {
      window.addEventListener('tronLink#initialized', handleTronLink, {
        once: true,
      })

      setTimeout(handleTronLink, 3000)
    }

    function handleTronLink() {
      const { tronLink } = window
      if (tronLink) {
        resolve(tronLink)
      } else {
        console.error('Please install TronLink-Extension!')
        reject(null)
      }
    }
  })
}
