// lib/contract.ts
import { getWeb3 } from "./web3";
import ABI_JSON from "./RideSharingABI.json"; // pastikan file ABI ada di lib folder
import { CONTRACT_ADDRESS } from "./contractAddress";

export default async function getContract() {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  const account = accounts && accounts.length > 0 ? accounts[0] : null;

  // ABI bisa berbentuk array langsung atau objek { abi: [...] }
  const abi = (ABI_JSON as any).abi ?? (ABI_JSON as any);

  const contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
  return { web3, contract, account };
}
