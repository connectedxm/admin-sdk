import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ReportFilters } from "@src/interfaces";
import { CustomReport } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Reports
 */
export const CUSTOM_REPORTS_QUERY_KEY = (filters: ReportFilters = {}) => [
  "CUSTOM_REPORTS",
  ...Object.values(filters),
];

/**
 * @category Setters
 * @group Reports
 */
export const SET_CUSTOM_REPORTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CUSTOM_REPORTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetCustomReports>>
) => {
  client.setQueryData(CUSTOM_REPORTS_QUERY_KEY(...keyParams), response);
};

interface GetCustomReportsProps extends InfiniteQueryParams {
  filters?: ReportFilters;
}

/**
 * @category Queries
 * @group Reports
 */
export const GetCustomReports = async ({
  filters = {},
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetCustomReportsProps): Promise<ConnectedXMResponse<CustomReport[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get<ConnectedXMResponse<CustomReport[]>>(
    `/reports/custom`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        ...filters,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group Reports
 */
export const useGetCustomReports = (
  filters: ReportFilters = {},
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetCustomReports>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetCustomReports>>
  >(
    CUSTOM_REPORTS_QUERY_KEY(filters),
    (params: InfiniteQueryParams) => GetCustomReports({ filters, ...params }),
    params,
    options,
    "reports"
  );
};
