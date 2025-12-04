export interface Launch {
  id: number;
  uuid: string;
  name: string;
  number: number;
  status: string;
  startTime: number;
  endTime?: number;
}

export interface TestItem {
  id: number;
  uuid: string;
  name: string;
  status: string;
  startTime: number;
  endTime?: number;
  codeRef?: string;
  testCaseId?: string;
}
