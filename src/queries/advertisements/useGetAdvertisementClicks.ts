import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { AdvertisementClick } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";

export const ADVERTISEMENT_CLICKS_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENT_QUERY_KEY(advertisementId),
  "CLICKS",
];

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

export const GetAdvertisementClicks = async ({
  advertisementId,
  pageParam,
  pageSize,
  orderBy,
  search,
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

const useGetAdvertisementClicks = (advertisementId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAdvertisementClicks>>
  >(
    ADVERTISEMENT_CLICKS_QUERY_KEY(advertisementId),
    (params: any) => GetAdvertisementClicks(params),
    {
      advertisementId,
    },
    {
      enabled: !!advertisementId,
    }
  );
};

export default useGetAdvertisementClicks;
