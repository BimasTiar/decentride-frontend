"use client";

import { useState } from "react";

export function useWallet() {
  const [account, setAccount] = useState<string | null>(null);

  const connect = async () => {
    if (!(window as any).ethereum) {
      alert("MetaMask not installed");
      return;
    }

    const accounts = await (window as any).ethereum.request({
      method: "eth_requestAccounts",
    });

    setAccount(accounts[0]);
  };

  const disconnect = () => {
    setAccount(null);
  };

  return {
    account,
    connect,
    disconnect,
    isConnected: !!account,
  };
}
