import rpClient from "../client";
import { LATEST_LAUNCH_API, LAUNCH_API } from "../constants/api";
import type { Launch } from "../types";

const normalizeLaunches = (launchesData: any[]): Launch[] => {
  return launchesData.map((item: any) => ({
    id: item.id,
    uuid: item.uuid,
    name: item.name,
    number: item.number,
    status: item.status,
    startTime: item.startTime,
    endTime: item.endTime,
  }));
}

export async function getLaunches({ limit = 5 }: { limit?: number }) {
  const { data } = await rpClient.get(LAUNCH_API, {
    params: {
      page: 1,
      size: limit,
      sort: "startTime,desc",
    },
  });

  console.error('Fetched launches:', data);

  return {
    data: normalizeLaunches(data.content),
    totalRecords: data.page.totalElements,
  };
}

export async function getLatestLaunches({ params }: { params?: any }) {
  const { data } = await rpClient.get(LATEST_LAUNCH_API, { params });

  return {
    data: normalizeLaunches(data.content),
    totalRecords: data.page.totalElements,
  };
}

export async function getLatestLaunch({ name }: { name: string }) {
  const params = {
    'filter.eq.name': name,
  };

  const { data } = await getLatestLaunches({ params });

  return data[0];
};
