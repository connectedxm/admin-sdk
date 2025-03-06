import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
export const CUSTOM_REPORTS_QUERY_KEY = () => ["CUSTOM_REPORTS"];

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

interface GetCustomReportsProps extends InfiniteQueryParams {}

/**
 * @category Queries
 * @group Reports
 */
export const GetCustomReports = async ({
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
    CUSTOM_REPORTS_QUERY_KEY(),
    (params: InfiniteQueryParams) => GetCustomReports({ ...params }),
    params,
    options,
    "reports"
  );
};
