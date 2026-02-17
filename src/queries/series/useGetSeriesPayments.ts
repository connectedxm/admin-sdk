import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Payment } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { SERIES_QUERY_KEY } from "./useGetSeries";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_PAYMENTS_QUERY_KEY = (seriesId: string) => [
  ...SERIES_QUERY_KEY(seriesId),
  "PAYMENTS",
];

interface GetSeriesPaymentsProps extends InfiniteQueryParams {
  seriesId: string;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesPayments = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSeriesPaymentsProps): Promise<ConnectedXMResponse<Payment[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series/${seriesId}/payments`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
    },
  });
  return data;
};

/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesPayments = (
  seriesId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesPayments>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesPayments>>
  >(
    SERIES_PAYMENTS_QUERY_KEY(seriesId),
    (params: InfiniteQueryParams) =>
      GetSeriesPayments({
        seriesId,
        ...params,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options.enabled ?? true),
    }
  );
};
