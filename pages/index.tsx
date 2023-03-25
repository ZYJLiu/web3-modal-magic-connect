import React from "react"
import Image from "next/image"
import { ConnectButton } from "@rainbow-me/rainbowkit"
import type { NextPage } from "next"
import {
  useAccount,
  useContractRead,
  useContractWrite,
  usePrepareContractWrite,
  useWaitForTransaction,
} from "wagmi"
import { abi } from "../contract-abi"
import FlipCard, { BackCard, FrontCard } from "../components/FlipCard"
import type {
  UsePrepareContractWriteConfig,
  UseContractReadConfig,
  UseContractWriteConfig,
} from "wagmi"

// Define NFT minting contract configuration
const contractConfig = {
  address: "0xbfe421739A996EcCADb6074f3dF2f0fF5e563415",
  abi,
  chainId: 5,
}

const Home: NextPage = () => {
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const [totalMinted, setTotalMinted] = React.useState(0)
  const { isConnected, address } = useAccount()

  // Prepare the contract "safemint" function
  const { config: contractWriteConfig } = usePrepareContractWrite({
    ...contractConfig,
    functionName: "safeMint",
    ...(address
      ? {
          args: [
            address,
            // {
            //   gasLimit: 1_000_000,
            // },
          ],
          onSettled(data, error) {
            console.log("Settled", { data, error })
          },
        }
      : {}),
  } as UsePrepareContractWriteConfig)

  // Use wagmi contract write hook for minting
  const {
    data: mintData,
    write: safeMint,
    isLoading: isMintLoading,
    isSuccess: isMintStarted,
    error: mintError,
  } = useContractWrite(contractWriteConfig as UseContractWriteConfig)

  // Use wagmi contract read hook for fetching total supply (number of NFTs minted)
  const { data: totalSupplyData }: any = useContractRead({
    ...contractConfig,
    functionName: "totalSupply",
    watch: true,
  } as UseContractReadConfig)

  // Use wagmi wait for transaction hook to listen for NFT mint transaction completion
  const {
    data: txData,
    isSuccess: txSuccess,
    error: txError,
  } = useWaitForTransaction({
    hash: mintData?.hash,
  })

  // Update the total minted NFTs when totalSupplyData changes
  React.useEffect(() => {
    if (totalSupplyData) {
      setTotalMinted(totalSupplyData.toNumber())
    }
  }, [totalSupplyData])

  const isMinted = txSuccess

  return (
    <div className="page">
      <div className="container">
        <div style={{ flex: "1 1 auto" }}>
          <div style={{ padding: "24px 24px 24px 0" }}>
            <h1>NFT Demo Mint</h1>
            <p style={{ margin: "12px 0 24px" }}>
              {totalMinted} minted so far!
            </p>
            <ConnectButton />

            {mintError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {mintError.message}
              </p>
            )}
            {txError && (
              <p style={{ marginTop: 24, color: "#FF6257" }}>
                Error: {txError.message}
              </p>
            )}

            {mounted && isConnected && !isMinted && (
              <button
                style={{ marginTop: 24 }}
                disabled={!safeMint || isMintLoading || isMintStarted}
                className="button"
                data-mint-loading={isMintLoading}
                data-mint-started={isMintStarted}
                onClick={() => safeMint?.(address)}
              >
                {isMintLoading && "Waiting for approval"}
                {isMintStarted && "Minting..."}
                {!isMintLoading && !isMintStarted && "Mint"}
              </button>
            )}
          </div>
        </div>

        <div style={{ flex: "0 0 auto" }}>
          <FlipCard>
            <FrontCard isCardFlipped={isMinted}>
              <Image
                layout="responsive"
                src="/nft.png"
                width="500"
                height="500"
                alt="RainbowKit Demo NFT"
              />
              <h1 style={{ marginTop: 24 }}>Rainbow NFT</h1>
              <ConnectButton />
            </FrontCard>
            <BackCard isCardFlipped={isMinted}>
              <div style={{ padding: 24 }}>
                <Image
                  src="/nft.png"
                  width="80"
                  height="80"
                  alt="RainbowKit Demo NFT"
                  style={{ borderRadius: 8 }}
                />
                <h2 style={{ marginTop: 24, marginBottom: 6 }}>NFT Minted!</h2>
                <p style={{ marginBottom: 24 }}>
                  Your NFT will show up in your wallet in the next few minutes.
                </p>
                <p style={{ marginBottom: 6 }}>
                  View on{" "}
                  <a href={`https://goerli.etherscan.io/tx/${mintData?.hash}`}>
                    Etherscan
                  </a>
                </p>
                <p>
                  View on{" "}
                  <a
                    href={`https://testnets.opensea.io/assets/goerli/${
                      txData?.to
                    }/${totalMinted - 1}`}
                  >
                    Opensea
                  </a>
                </p>
              </div>
            </BackCard>
          </FlipCard>
        </div>
      </div>
    </div>
  )
}

export default Home
