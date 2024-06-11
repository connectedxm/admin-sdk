import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";

export const ADVERTISEMENT_KPI_CLICKS_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENT_QUERY_KEY(advertisementId),
  "KPI_CLICKS",
];

export const SET_ADVERTISEMENT_KPI_CLICKS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ADVERTISEMENT_KPI_CLICKS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisementKPIClicks>>
) => {
  client.setQueryData(
    ADVERTISEMENT_KPI_CLICKS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetAdvertisementKPIClicksProps extends SingleQueryParams {
  advertisementId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetAdvertisementKPIClicks = async ({
  advertisementId,
  adminApiParams,
}: GetAdvertisementKPIClicksProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/advertisements/${advertisementId}/kpi/clicks`
  );
  return data;
};

const useGetAdvertisementKPIClicks = (
  advertisementId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAdvertisementKPIClicks>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisementKPIClicks>>(
    ADVERTISEMENT_KPI_CLICKS_QUERY_KEY(advertisementId),
    (params: SingleQueryParams) =>
      GetAdvertisementKPIClicks({ advertisementId, ...params }),
    {
      ...options,
      enabled: !!advertisementId && (options?.enabled ?? true),
    }
  );
};

export default useGetAdvertisementKPIClicks;
