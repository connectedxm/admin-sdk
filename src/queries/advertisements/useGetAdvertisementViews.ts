import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { AdvertisementView } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";

/**
 * Fetches views for a specific advertisement by its ID.
 * This function utilizes a connected infinite query to retrieve data about views associated with a particular advertisement.
 * It is designed to be used in applications where detailed information about advertisement views is required.
 * @name GetAdvertisementViews
 * @param {string} advertisementId - The ID of the advertisement
 * @version 1.2
 **/

export const ADVERTISEMENT_VIEWS_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENT_QUERY_KEY(advertisementId),
  "VIEWS",
];

export const SET_ADVERTISEMENT_VIEWS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ADVERTISEMENT_VIEWS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisementViews>>
) => {
  client.setQueryData(ADVERTISEMENT_VIEWS_QUERY_KEY(...keyParams), response);
};

interface GetAdvertisementViewsProps extends InfiniteQueryParams {
  advertisementId: string;
}

export const GetAdvertisementViews = async ({
  advertisementId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAdvertisementViewsProps): Promise<
  ConnectedXMResponse<AdvertisementView[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/advertisements/${advertisementId}/views`,
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

export const useGetAdvertisementViews = (
  advertisementId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAdvertisementViews>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAdvertisementViews>>
  >(
    ADVERTISEMENT_VIEWS_QUERY_KEY(advertisementId),
    (params: InfiniteQueryParams) =>
      GetAdvertisementViews({ advertisementId, ...params }),
    params,
    {
      ...options,
      enabled: !!advertisementId && (options.enabled ?? true),
    },
    "advertisements"
  );
};