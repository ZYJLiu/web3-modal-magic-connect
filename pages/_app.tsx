import "../styles/global.css"
import "@rainbow-me/rainbowkit/styles.css"
import type { AppProps } from "next/app"

import {
  RainbowKitProvider,
  getDefaultWallets,
  connectorsForWallets,
} from "@rainbow-me/rainbowkit"
import { argentWallet, trustWallet } from "@rainbow-me/rainbowkit/wallets"
import { magicConnectConnector } from "../connector/magicConnect"

import { createClient, configureChains, WagmiConfig } from "wagmi"
import { goerli } from "wagmi/chains"
import { publicProvider } from "wagmi/providers/public"

// Configure chains, providers, and webSocketProvider
const { chains, provider, webSocketProvider } = configureChains(
  [goerli], // Use only the Goerli test network for this demo
  [publicProvider()]
)

// Rainbowkit default wallets
const { wallets } = getDefaultWallets({
  appName: "RainbowKit Mint NFT Demo",
  chains,
})

const demoAppInfo = {
  appName: "RainbowKit Mint NFT Demo",
}

// Create connectors for wallets
// Include Magic Connect to the list of wallets to display in wallet selector modal
const connectors = connectorsForWallets([
  {
    groupName: "Magic",
    wallets: [magicConnectConnector({ chains })],
  },
  ...wallets,
  {
    groupName: "Other",
    wallets: [argentWallet({ chains }), trustWallet({ chains })],
  },
])

// Create the Wagmi client
const wagmiClient = createClient({
  autoConnect: true, // autoconnect not working correctly with Magic Connect
  connectors,
  provider,
  webSocketProvider,
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider appInfo={demoAppInfo} chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default MyApp
