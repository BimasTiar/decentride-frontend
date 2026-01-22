import Web3 from "web3";

export const getWeb3 = async (): Promise<Web3> => {
  if ((window as any).ethereum) {
    const web3 = new Web3((window as any).ethereum);
    await (window as any).ethereum.request({ method: "eth_requestAccounts" });
    return web3;
  }
  throw new Error("MetaMask not detected");
};
