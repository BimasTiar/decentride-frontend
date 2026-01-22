import Web3 from "web3";
import ABI from "./RideSharingABI.json";
import { CONTRACT_ADDRESS } from "./contractAddress";

export const getWeb3 = () => {
  const { ethereum } = window as any;
  return new Web3(ethereum);
};

export const getContract = (web3: Web3) => {
  return new web3.eth.Contract(ABI as any, CONTRACT_ADDRESS);
};
