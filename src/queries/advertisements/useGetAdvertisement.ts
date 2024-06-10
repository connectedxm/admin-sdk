import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Advertisement } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ADVERTISEMENTS_QUERY_KEY } from "./useGetAdvertisements";

export const ADVERTISEMENT_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENTS_QUERY_KEY(),
  advertisementId,
];

export const SET_ADVERTISEMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ADVERTISEMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisement>>
) => {
  client.setQueryData(ADVERTISEMENT_QUERY_KEY(...keyParams), response);
};

interface GetAdvertisementProps {
  advertisementId: string;
}

export const GetAdvertisement = async ({
  advertisementId,
}: GetAdvertisementProps): Promise<ConnectedXMResponse<Advertisement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/advertisements/${advertisementId}`);
  return data;
};

const useGetAdvertisement = (advertisementId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisement>>(
    ADVERTISEMENT_QUERY_KEY(advertisementId),
    () => GetAdvertisement({ advertisementId }),
    {
      enabled: !!advertisementId,
    }
  );
};

export default useGetAdvertisement;
