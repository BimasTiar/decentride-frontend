"use client";

type Props = {
  account: string | null;
  onConnect: () => void;
  onDisconnect: () => void;
};

export default function Navbar({ account, onConnect, onDisconnect }: Props) {
  return (
    <header className="flex items-center justify-between px-6 py-4 border-b border-zinc-800">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-green-600" />
        <span className="font-semibold text-white">RideChain</span>
      </div>

      {account ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-400">
            {account.slice(0, 6)}…{account.slice(-4)}
          </span>
          <button
            onClick={onDisconnect}
            className="rounded-lg bg-zinc-800 px-4 py-2 text-sm"
          >
            Disconnect
          </button>
        </div>
      ) : (
        <button
          onClick={onConnect}
          className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium"
        >
          Connect Wallet
        </button>
      )}
    </header>
  );
}