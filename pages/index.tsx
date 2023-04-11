import { VStack } from "@chakra-ui/react"
import { Web3Button, Web3NetworkSwitch } from "@web3modal/react"
export default function Home() {
  return (
    <VStack>
      <Web3Button />
      <Web3NetworkSwitch />
    </VStack>
  )
}
