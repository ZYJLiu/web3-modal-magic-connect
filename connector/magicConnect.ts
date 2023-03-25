import { MagicConnectConnector } from "wagmi-magic-connect"

// Create and export a function that initializes the Magic Connect connector
export const magicConnectConnector = ({ chains }: any) => ({
  // Data displayed in the wallet selector modal UI
  id: "magic",
  name: "Magic Connect",
  iconUrl: "https://svgshare.com/i/iJK.svg",
  iconBackground: "#fff",

  // Function to create and return the Magic Connect connector instance
  createConnector: () => {
    const connector = new MagicConnectConnector({
      chains: chains,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGICKEY!,
        magicSdkConfiguration: {
          network: {
            rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC!,
            chainId: 5,
          },
        },
      },
    })

    // Return the instantiated connector
    return {
      connector,
    }
  },
})
