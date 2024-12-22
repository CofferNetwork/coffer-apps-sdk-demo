import { useCofferApp } from "@coffer-network/apps-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { LoaderCircle } from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

const Assets = () => {
  const { coffer, wallet } = useCofferApp();
  const { data, isLoading } = useQuery({
    queryKey: ["assets", wallet?.address],
    queryFn: async () => {
      return await coffer?.getBalance();
    },
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {isLoading && (
        <div className="flex justify-center w-full">
          <LoaderCircle className="animate-spin" />
        </div>
      )}
      <div className="flex flex-col divide-y">
        {data?.map((item) => {
          return (
            <div
              key={item.asset + item.assetType}
              className="py-2 text-sm flex justify-between"
            >
              <span className="">{item.asset}</span>
              <span>{item.balances}</span>
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
};

export default Assets;
