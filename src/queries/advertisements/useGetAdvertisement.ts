import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Advertisement } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ADVERTISEMENTS_QUERY_KEY } from "./useGetAdvertisements";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Advertisements
 */
export const ADVERTISEMENT_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENTS_QUERY_KEY(),
  advertisementId,
];

/**
 * @category Setters
 * @group Advertisements
 */
export const SET_ADVERTISEMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ADVERTISEMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisement>>
) => {
  client.setQueryData(ADVERTISEMENT_QUERY_KEY(...keyParams), response);
};

interface GetAdvertisementProps extends SingleQueryParams {
  advertisementId: string;
}

/**
 * @category Queries
 * @group Advertisements
 */
export const GetAdvertisement = async ({
  advertisementId,
  adminApiParams,
}: GetAdvertisementProps): Promise<ConnectedXMResponse<Advertisement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/advertisements/${advertisementId}`);
  return data;
};
/**
 * @category Hooks
 * @group Advertisements
 */
export const useGetAdvertisement = (
  advertisementId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAdvertisement>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisement>>(
    ADVERTISEMENT_QUERY_KEY(advertisementId),
    (params: SingleQueryParams) =>
      GetAdvertisement({ advertisementId, ...params }),
    {
      ...options,
      enabled: !!advertisementId && (options?.enabled ?? true),
    },
    "advertisements"
  );
};
