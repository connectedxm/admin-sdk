import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  PurchaseStatus,
  SeriesRegistration,
} from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { SERIES_QUERY_KEY } from "../useGetSeries";

/**
 * @category Keys
 * @group Series
 */
export const SERIES_REGISTRATIONS_QUERY_KEY = (
  seriesId: string,
  status?: keyof typeof PurchaseStatus
) => {
  const key = [...SERIES_QUERY_KEY(seriesId), "REGISTRATIONS"];
  if (status) {
    key.push(status);
  }
  return key;
};

interface GetSeriesRegistrationsProps extends InfiniteQueryParams {
  seriesId: string;
  status?: keyof typeof PurchaseStatus;
}

/**
 * @category Queries
 * @group Series
 */
export const GetSeriesRegistrations = async ({
  seriesId,
  pageParam,
  pageSize,
  orderBy,
  search,
  status,
  adminApiParams,
}: GetSeriesRegistrationsProps): Promise<
  ConnectedXMResponse<SeriesRegistration[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/series/${seriesId}/registrations`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      status: status || undefined,
    },
  });
  return data;
};
/**
 * @category Hooks
 * @group Series
 */
export const useGetSeriesRegistrations = (
  seriesId: string = "",
  status?: keyof typeof PurchaseStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetSeriesRegistrations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetSeriesRegistrations>>
  >(
    SERIES_REGISTRATIONS_QUERY_KEY(seriesId, status),
    (params: InfiniteQueryParams) =>
      GetSeriesRegistrations({
        ...params,
        seriesId,
        status,
      }),
    params,
    {
      ...options,
      enabled: !!seriesId && (options.enabled ?? true),
    }
  );
};
