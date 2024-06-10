import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Report, ReportParent, ReportType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { REPORT_PARENTS_QUERY_KEY } from "./useGetReportParents";

export const REPORT_PARENT_QUERY_KEY = (parentId: string) => [
  ...REPORT_PARENTS_QUERY_KEY(),
  parentId,
];

export const SET_REPORT_PARENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORT_PARENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReportParent>>
) => {
  client.setQueryData(REPORT_PARENT_QUERY_KEY(...keyParams), response);
};

interface GetReportParentProps {
  parentId: string;
}

export const GetReportParent = async ({
  parentId,
}: GetReportParentProps): Promise<ConnectedXMResponse<ReportParent>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/parents/${parentId}`);
  return data;
};

const useGetReportParent = (parentId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReportParent>>(
    REPORT_PARENT_QUERY_KEY(parentId),
    () => GetReportParent({ parentId }),
    {
      enabled: !!parentId,
    }
  );
};

export default useGetReportParent;
