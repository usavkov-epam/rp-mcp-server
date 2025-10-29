import rpClient from "./client";
import type { Launch } from "./types";

export async function getLaunches({ limit = 5 }: { limit?: number }) {
  const { data } = await rpClient.get(`/launch`, {
    params: {
      page: 1,
      size: limit,
      sort: "startTime,desc",
    },
  });

  console.error('Fetched launches:', data);

  return data.content.map((item: any) => ({
    id: item.id,
    name: item.name,
    number: item.number,
    status: item.status,
    startTime: item.startTime,
    endTime: item.endTime,
  })) as Launch[];
}
