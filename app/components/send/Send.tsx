"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCofferApp } from "@coffer-network/apps-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { LoaderCircle } from "lucide-react";
import { BitcoinNetwork } from "@coffer-network/apps-sdk";

const formSchema = z.object({
  recipient: z.string(),
  amount: z.number(),
  fee: z.number(),
});

const Send = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { coffer, wallet } = useCofferApp();
  const { data } = useQuery({
    queryKey: ["assets", wallet?.address],
    queryFn: async () => {
      return await coffer?.getBalance();
    },
  });

  const btcBalance = useMemo(() => {
    return data?.find(
      (item) => item.assetType === "btc" && item.asset === "BITCOIN"
    );
  }, [data]);

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      recipient: "",
      amount: 0,
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsCreating(true);
    coffer
      ?.createTransaction({
        originAddress: wallet!.address!,
        destinationAddresses: [
          {
            address: values.recipient,
            amount: values.amount,
          },
        ],
        asset: "BITCOIN",
        assetType: "btc",
        networkType: BitcoinNetwork.Testnet,
        txFeeRate: values.amount,
      })
      .then(() => {
        setIsCreating(false);
      })
      .catch((err) => {
        console.log(err);
        setIsCreating(false);
      });
  }

  return (
    <div className="rounded-md border p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="recipient"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Recipient</FormLabel>
                <FormControl>
                  <Input placeholder="Address" {...field} />
                </FormControl>
                <FormDescription>
                  <div className="flex justify-between">
                    <span>Available</span>
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        form.setValue("amount", btcBalance?.balances || 0);
                      }}
                    >
                      {btcBalance?.balances || "--"} BTC
                    </span>
                  </div>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Transfer amount</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    defaultValue={String(field.value)}
                    placeholder="Amount"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fee"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Fee
                  <span className="text-muted-foreground text-[12px] pl-2">
                    (sat/vB)
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                    defaultValue={field.value ? field.value : ""}
                    placeholder="sat/vB"
                  />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button className="w-full" type="submit">
            {isCreating && <LoaderCircle className="animate-spin" />}
            Create Transaction
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Send;
