import { http, createConfig } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { defineChain } from 'viem'

export const kerleano = defineChain({
  id: 1804,
  name: 'Kerleano',
  nativeCurrency: { name: 'CRC', symbol: 'CRC', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://cacib-saturn-test.francecentral.cloudapp.azure.com'] },
  },
  blockExplorers: {
    default: { name: 'Aleth', url: 'https://ethereum-pocr.github.io/explorer/kerleano' },
  },
  contracts: {
    ensUniversalResolver: {
      address: '0xE4Acdd618deED4e6d2f03b9bf62dc6118FC9A4da',
      blockCreated: 16773775,
    },
    multicall3: {
      address: '0xca11bde05977b3631167028862be2a173976ca11',
      blockCreated: 14353601,
    },
  },
})
export const config = createConfig({
  chains: [kerleano],
  connectors: [
    injected(),
  ],
  transports: {
    [kerleano.id]: http(),
  },
})

declare module 'wagmi' {
  interface Register {
    config: typeof config
  }
}
