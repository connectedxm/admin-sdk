import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ReportParent } from "@src/interfaces";
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

interface GetReportParentProps extends SingleQueryParams {
  parentId: string;
}

export const GetReportParent = async ({
  parentId,
  adminApiParams,
}: GetReportParentProps): Promise<ConnectedXMResponse<ReportParent>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/parents/${parentId}`);
  return data;
};
export const useGetReportParent = (
  parentId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetReportParent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetReportParent>>(
    REPORT_PARENT_QUERY_KEY(parentId),
    (params: SingleQueryParams) => GetReportParent({ parentId, ...params }),
    {
      ...options,
      enabled: !!parentId,
    }
  );
};
