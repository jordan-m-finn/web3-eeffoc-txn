import { createWalletClient, custom } from "https://esm.sh/viem"

const connectWalletButton = document.getElementById('connectWalletButton')

let walletClient

async function connect() {
    // Not suitable for wallets other than hot wallets
    if (typeof window.ethereum === 'undefined') {
        createWalletClient({
            transport: custom(window.ethereum)
        })
        await walletClient.requestAddresses()
    } else {
        connectWalletButton.innerHTML = "Please first install an EVM compatible hot wallet!"
    }
}

connectWalletButton.onClick = connect