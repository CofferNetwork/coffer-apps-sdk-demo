import { useCofferApp } from "@coffer-network/apps-react-sdk";
import { useQuery } from "@tanstack/react-query";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Download, LoaderCircle, Upload } from "lucide-react";
import dayjs from "dayjs";

export const formatTimestamp = (timestamp: number | null) => {
  if (!timestamp) return;
  if (String(timestamp).length > 10) {
    /* empty */
  } else {
    timestamp = timestamp * 1000;
  }
  return dayjs(timestamp).format("DD/MM/YYYY, HH:mm:ss");
};

const History = () => {
  const { coffer } = useCofferApp();

  const { data, isLoading } = useQuery({
    queryKey: ["history"],
    queryFn: async () => {
      const result = await coffer?.fetchAllTransaction();
      return result;
    },
  });

  return (
    <ScrollArea className="h-[400px] w-full rounded-md border p-4">
      {isLoading && (
        <div className="flex justify-center w-full">
          <LoaderCircle className="animate-spin" />
        </div>
      )}
      <div>
        <Accordion type="single" collapsible>
          {data?.map((item) => {
            return (
              <AccordionItem key={item.id} value={item.id}>
                <AccordionTrigger>
                  <div className="flex items-center space-x-2 justify-between w-full">
                    <div className="flex items-center space-x-2">
                      <span>
                        {item.isReceived ? (
                          <Download className="w-4" />
                        ) : (
                          <Upload className="w-4" />
                        )}
                      </span>
                      <span>{item.isReceived ? "Received" : "Sent"}</span>
                      <span>
                        {item.destinationAddresses?.[0]?.amount} {item.asset}
                      </span>
                    </div>
                    <span className="text-[12px] text-muted-foreground pr-2">
                      {formatTimestamp(item.createdAt)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="text-[10px] flex flex-col w-full">
                    <span>
                      <span className="inline-block w-[80px]">From: </span>
                      {item.isReceived
                        ? item.destinationAddresses?.[0]?.address
                        : "--"}
                    </span>
                    <span>
                      <span className="inline-block w-[80px]">To: </span>
                      {item.isReceived
                        ? item.destinationAddresses?.[0]?.address
                        : "--"}
                    </span>
                    <span>
                      <span className="inline-block w-[80px]">Create At: </span>
                      {formatTimestamp(item.createdAt)}
                    </span>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      </div>
    </ScrollArea>
  );
};

export default History;
