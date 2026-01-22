"use client";

type Props = {
  onConnect: () => void;
};

export default function ConnectWallet({ onConnect }: Props) {
  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center">
      <div className="bg-slate-900 p-6 rounded-xl w-[360px] text-white">
        <h2 className="text-xl font-bold mb-4">Connect Wallet</h2>

        <button
          onClick={onConnect}
          className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg"
        >
          Connect MetaMask
        </button>
      </div>
    </div>
  );
}
