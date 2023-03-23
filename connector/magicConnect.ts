import { MagicConnectConnector } from "wagmi-magic-connect"

export const magicConnectConnector = ({ chains }: any) => ({
  id: "magic",
  name: "Magic Connect",
  iconUrl: "https://svgshare.com/i/iJK.svg",
  iconBackground: "#fff",
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
    return {
      connector,
    }
  },
})
