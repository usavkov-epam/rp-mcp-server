import rpClient from "../client";
import { ITEM_V2_API, ITEM_API } from "../constants/api";
import type { TestItem } from "../types";
import { getLatestLaunch } from "./launch.service";

const LIMIT = 1000
const TO_INVESTIGATE_ISSUE_TYPE = 'ti001';
const FLAKY_ISSUE_TYPE = 'ab_uvbcfwkvo3e8';
const LAUNCH_PROVIDER_TYPE = 'launch';

export async function getItemsV2({ params }: { params?: any }) {
  const { data } = await rpClient.get(ITEM_V2_API, { params });

  console.error('Fetched items:', data);

  return {
    data: data.content.map((item: any) => ({
      id: item.id,
      uuid: item.uuid,
      name: item.name,
      number: item.number,
      status: item.status,
      startTime: item.startTime,
      endTime: item.endTime,
      codeRef: item.codeRef,
      testCaseId: item.testCaseId,
    })) as TestItem[],
    totalRecords: data.page.totalElements,
  };
}

export async function getItemsToInvestigate({ name: launchName, team }: { name: string, team?: string }) {
  const latestLaunch = await getLatestLaunch({ name: launchName });

  const params = {
    sort: "startTime,asc",
    launchId: latestLaunch.id,
    providerType: LAUNCH_PROVIDER_TYPE,
    'page.size': LIMIT,
    'filter.cnt.name': team,
    'filter.in.issueType': TO_INVESTIGATE_ISSUE_TYPE,
    'filter.eq.hasStats': true,
  };

  const { data, totalRecords } = await getItemsV2({ params });

  return {
    totalRecords,
    items: data.map(item => ({
      testPath: (item?.codeRef || '').replace(/\.cy\.(js|ts).*$/, '.cy.$1'),
      testItemId: item.id,
    })),
  };
}

export async function markTestsAsFlaky({ testItemIds }: { testItemIds: number[] }) {
  const issues = testItemIds.map((id) => ({
    id,
    testItemId: id,
    issue: {
      issueType: FLAKY_ISSUE_TYPE,
      autoAnalyzed: false,
      ignoreAnalyzer: false,
      externalSystemIssues: [],
    },
  }));

  const payload = { issues };

  console.error('Marking tests as flaky:', payload);

  const { data } = await rpClient.put(ITEM_API, payload);

  console.error('Response from marking tests as flaky:', data);

  return {
    success: true,
    updatedCount: testItemIds.length,
  };
}
