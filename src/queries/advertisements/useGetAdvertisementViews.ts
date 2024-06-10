import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { AdvertisementView } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";

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

export const QUERY_KEY = "ADVERTISEMENT_VIEWS";

const useGetAdvertisementViews = (advertisementId: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAdvertisementViews>>
  >(
    [QUERY_KEY, advertisementId],
    (params: any) => GetAdvertisementViews(params),
    {
      advertisementId,
    },
    {
      enabled: !!advertisementId,
    }
  );
};

export default useGetAdvertisementViews;
