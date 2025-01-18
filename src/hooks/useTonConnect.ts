import { useTonAddress, useTonConnectUI } from "@tonconnect/ui-react";
import { Address, Sender, SenderArguments } from "@ton/core";

export function useTonConnect(): {
  sender: Sender;
  connected: boolean;
  hash: string;
} {
  const [tonConnectUI] = useTonConnectUI();
  const address: string = useTonAddress();

  return {
    address,
    sender: {
      // @ts-ignore
      send: async (args: SenderArguments) => {
        await tonConnectUI.sendTransaction({
          messages: [
            {
              address: args.to.toString(),
              amount: args.value.toString(),
              payload: args.body?.toBoc().toString("base64"),
            },
          ],
          validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
        });
        return 0;
      },
      address: address ? Address.parse(address) : undefined,
    },
    connected: tonConnectUI.connected,
  };
}
