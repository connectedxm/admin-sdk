import { ConnectedXMResponse } from "@src/interfaces";
import { ReportParent, ReportType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const REPORT_PARENTS_QUERY_KEY = (type?: keyof typeof ReportType) => {
  const queryKey = ["REPORT_PARENTS"];

  if (type) {
    queryKey.push(type);
  }
  return queryKey;
};

export const SET_REPORT_PARENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof REPORT_PARENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetReportParents>>
) => {
  client.setQueryData(REPORT_PARENTS_QUERY_KEY(...keyParams), response);
};

interface GetReportParentsProps extends InfiniteQueryParams {
  type: keyof typeof ReportType;
}

export const GetReportParents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
}: GetReportParentsProps): Promise<ConnectedXMResponse<ReportParent[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/reports/parents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      type,
    },
  });
  return data;
};

const useGetReportParents = (type: keyof typeof ReportType) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetReportParents>>
  >(
    REPORT_PARENTS_QUERY_KEY(type),
    (params: any) => GetReportParents(params),
    {
      type,
    },
    {
      enabled: !!type,
    }
  );
};

export default useGetReportParents;
