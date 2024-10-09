import { ConnectedXMResponse } from "@src/interfaces";
import { ReportParent, ReportType } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Reports
 */
export const REPORT_PARENTS_QUERY_KEY = (type?: keyof typeof ReportType) => {
  const queryKey = ["REPORT_PARENTS"];

  if (type) {
    queryKey.push(type);
  }
  return queryKey;
};

/**
 * @category Setters
 * @group Reports
 */
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

/**
 * @category Queries
 * @group Reports
 */
export const GetReportParents = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  type,
  adminApiParams,
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
/**
 * @category Hooks
 * @group Reports
 */
export const useGetReportParents = (
  type: keyof typeof ReportType,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetReportParents>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetReportParents>>
  >(
    REPORT_PARENTS_QUERY_KEY(type),
    (params: InfiniteQueryParams) => GetReportParents({ type, ...params }),
    params,
    {
      ...options,
      enabled: !!type,
    },
    "reports"
  );
};
