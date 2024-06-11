import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Advertisements
 */
export const ADVERTISEMENT_KPI_VIEWS_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENT_QUERY_KEY(advertisementId),
  "KPI_VIEWS",
];

/**
 * @category Setters
 * @group Advertisements
 */
export const SET_ADVERTISEMENT_KPI_VIEWS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ADVERTISEMENT_KPI_VIEWS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAdvertisementKPIViews>>
) => {
  client.setQueryData(
    ADVERTISEMENT_KPI_VIEWS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetAdvertisementKPIViewsProps extends SingleQueryParams {
  advertisementId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

/**
 * @category Queries
 * @group Advertisements
 */
export const GetAdvertisementKPIViews = async ({
  advertisementId,
  adminApiParams,
}: GetAdvertisementKPIViewsProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/advertisements/${advertisementId}/kpi/views`
  );
  return data;
};
/**
 * @category Hooks
 * @group Advertisements
 */
export const useGetAdvertisementKPIViews = (
  advertisementId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAdvertisementKPIViews>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisementKPIViews>>(
    ADVERTISEMENT_KPI_VIEWS_QUERY_KEY(advertisementId),
    (params: SingleQueryParams) =>
      GetAdvertisementKPIViews({ advertisementId, ...params }),
    {
      ...options,
      enabled: !!advertisementId,
    }
  );
};
