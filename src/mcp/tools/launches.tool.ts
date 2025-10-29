import { getLaunches } from "../../report-portal/service";

export async function getLaunchesTool(limit: number) {
  return await getLaunches({ limit });
}
