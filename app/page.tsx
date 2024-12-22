"use client";
import { Button } from "./components/ui/button";
import { useCofferApp } from "@coffer-network/apps-react-sdk";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Send } from "./components/send";
import { History } from "./components/history";
import { UserRound } from "lucide-react";
import { Assets } from "./components/assets";

const abbreviateAddress = (address: string = "") => {
  if (!address) return "";
  return address.substring(0, 4) + "...." + address.substr(-7, 7);
};

export default function Home() {
  const { wallet } = useCofferApp();

  return (
    <div className="p-8 space-y-5">
      <h1 className="text-[30px] font-bold text-left">Coffer App Example</h1>
      <main className="flex flex-col h-full">
        <div className="w-full flex justify-end mb-10">
          <Button size="sm">
            <UserRound /> {abbreviateAddress(wallet?.address)}
          </Button>
        </div>

        <div className="flex justify-center">
          <Tabs defaultValue="send" className="w-[400px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="send">Send</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
              <TabsTrigger value="assets">Assets</TabsTrigger>
            </TabsList>
            <TabsContent value="send">
              <Send />
            </TabsContent>
            <TabsContent value="history">
              <History />
            </TabsContent>
            <TabsContent value="assets">
              <Assets />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
