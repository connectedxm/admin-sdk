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
 * Retrieves a list of report parents based on the specified report type.
 * This function is used to fetch report parent data, which can be utilized in various reporting features within the application.
 * It supports infinite scrolling and pagination through the use of connected infinite queries.
 * @name GetReportParents
 * @param {string} type - The type of the report
 * @version 1.2
 **/

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