import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import "@/styles/globals.css"

import { EthereumClient, w3mConnectors, w3mProvider } from "@web3modal/ethereum"
import { Web3Modal } from "@web3modal/react"
import { configureChains, createClient, WagmiConfig } from "wagmi"
import { sepolia, goerli } from "wagmi/chains"

import { MagicConnectConnector } from "wagmi-magic-connect"

const projectId = process.env.NEXT_PUBLIC_PROJECT_ID!
const chains = [sepolia, goerli]
const { provider } = configureChains(chains, [w3mProvider({ projectId })])

const wagmiClient = createClient({
  autoConnect: true,
  connectors: [
    new MagicConnectConnector({
      chains: chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGICKEY!,
        magicSdkConfiguration: {
          network: {
            rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC!,
            chainId: 11155111,
          },
        },
      },
    }),
    ...w3mConnectors({ chains, version: 2, projectId }),
  ],
  provider,
})

const ethereumClient = new EthereumClient(wagmiClient, chains)

const walletImages = {
  magic: "https://svgshare.com/i/iJK.svg",
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <ChakraProvider>
        <WagmiConfig client={wagmiClient}>
          <Component {...pageProps} />
        </WagmiConfig>
      </ChakraProvider>

      <Web3Modal
        projectId={projectId}
        ethereumClient={ethereumClient}
        walletImages={walletImages}
      />
    </>
  )
}
