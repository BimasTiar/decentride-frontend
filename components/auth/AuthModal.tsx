"use client";

type Props = {
  open: boolean;
  onClose: () => void;
  onConnect: () => Promise<void>;
};

export default function AuthModal({ open, onClose, onConnect }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur">
      <div className="w-[420px] rounded-2xl bg-zinc-900 p-6 text-white shadow-xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Log in or sign up</h2>
          <button onClick={onClose} className="text-zinc-400">✕</button>
        </div>

        <button
          onClick={onConnect}
          className="w-full rounded-xl bg-green-600 py-3 font-medium hover:bg-green-500 transition"
        >
          Continue with MetaMask
        </button>

        <p className="mt-6 text-xs text-zinc-400 text-center">
          Your private keys stay in your wallet. We never store sensitive data.
        </p>
      </div>
    </div>
  );
}
