import { createWalletClient, custom, createPublicClient, parseEther, defineChain } from "https://esm.sh/viem"
import { contractAddress, abi } from "./constants-js.js"

const connectWalletButton = document.getElementById('connectWalletButton')
const fundButton = document.getElementById("fundButton")
const ethAmountInput = document.getElementById("ethAmount")

let walletClient
let publicClient

async function connect() {
    // Not suitable for wallets other than hot wallets
    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        })
        await walletClient.requestAddresses()
        connectWalletButton.innerHTML = "Connected!"

    } else {
        connectWalletButton.innerHTML = "Please first install an EVM compatible hot wallet!"
    }
}

async function fund() {
    const ethAmount = ethAmountInput.value
    console.log(`Funding with ${ethAmount}...`)

    // Not suitable for wallets other than hot wallets
    if (typeof window.ethereum !== 'undefined') {
        walletClient = createWalletClient({
            transport: custom(window.ethereum),
        })
        const [connectedAccount] = await walletClient.requestAddresses()
        const currentChain = await getCurrentChain(walletClient)

        publicClient = createPublicClient({
            transport: custom(window.ethereum)
        })
        const { request } = await publicClient.simulateContract({
            address: contractAddress,
            abi: abi,
            functionName: "fund",
            account: connectedAccount,
            chain: currentChain,
            value: parseEther(ethAmount)
        })

        const hash = await walletClient.writeContract(request)
        console.log(hash)

    } else {
        connectWalletButton.innerHTML = "Please first install an EVM compatible hot wallet!"
    }
}

async function getCurrentChain(client) {
    const chainId = await client.getChainId()
    const currentChain = defineChain({
        id: chainId,
        name: "Custom Chain",
        nativeCurrency: {
            name: "Ether",
            symbol: "ETH",
            decimals: 18,
        },
        rpcUrls: {
            default: {
                http: ["http://localhost:8545"],
            },
        },
    })
    return currentChain
}

connectWalletButton.onclick = connect
fundButton.onclick = fund