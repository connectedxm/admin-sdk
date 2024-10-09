import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { AdvertisementClick } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";

/**
 * @category Keys
 * @group Advertisements
 */
export const ADVERTISEMENT_CLICKS_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENT_QUERY_KEY(advertisementId),
  "CLICKS",
];

/**
 * @category Setters
 * @group Advertisements
 */
export const SET_ADVERTISEMENT_CLICKS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ADVERTISEMENT_CLICKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisementClicks>>
) => {
  client.setQueryData(ADVERTISEMENT_CLICKS_QUERY_KEY(...keyParams), response);
};

interface GetAdvertisementClicksProps extends InfiniteQueryParams {
  advertisementId: string;
}

/**
 * @category Queries
 * @group Advertisements
 */
export const GetAdvertisementClicks = async ({
  advertisementId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAdvertisementClicksProps): Promise<
  ConnectedXMResponse<AdvertisementClick[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/advertisements/${advertisementId}/clicks`,
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
 * @group Advertisements
 */
export const useGetAdvertisementClicks = (
  advertisementId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAdvertisementClicks>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAdvertisementClicks>>
  >(
    ADVERTISEMENT_CLICKS_QUERY_KEY(advertisementId),
    (params: InfiniteQueryParams) =>
      GetAdvertisementClicks({ advertisementId, ...params }),
    params,
    {
      ...options,
      enabled: !!advertisementId,
    },
    "advertisements"
  );
};
