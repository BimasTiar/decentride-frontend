import Web3 from "web3";

export async function sendTx({
  web3,
  method,
  from,
  value,
}: {
  web3: Web3;
  method: any;
  from: string;
  value?: string;
}) {
  const gas = await method.estimateGas({
    from,
    value,
  });

  const gasPrice = await web3.eth.getGasPrice();

  return method.send({
    from,
    gas,
    gasPrice,
    value,
  });
}

export function parseTxError(err: any): string {
  if (!err) return "Unknown error";

  if (err.code === 4001) {
    return "User rejected transaction";
  }

  if (err.message) return err.message;

  return "Transaction failed";
}
