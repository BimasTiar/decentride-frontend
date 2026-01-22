// lib/web3.ts
import Web3 from "web3";

declare global {
  interface Window {
    ethereum?: any;
  }
}

export const SEPOLIA_CHAIN_ID = 11155111;

export async function getWeb3(): Promise<Web3 | null> {
  // 1. MetaMask (browser)
  if (typeof window !== "undefined" && window.ethereum) {
    const web3 = new Web3(window.ethereum);

    // request account
    await window.ethereum.request({ method: "eth_requestAccounts" });

    // chainId validation
    const chainIdHex = await window.ethereum.request({
      method: "eth_chainId",
    });
    const chainId = Number(chainIdHex);

    if (chainId !== SEPOLIA_CHAIN_ID) {
      throw new Error("Please switch MetaMask to Sepolia network");
    }

    return web3;
  }

  // 2. Infura fallback (read-only)
  const infuraUrl = process.env.NEXT_PUBLIC_INFURA_SEPOLIA;
  if (infuraUrl) {
    return new Web3(new Web3.providers.HttpProvider(infuraUrl));
  }

  return null;
}
