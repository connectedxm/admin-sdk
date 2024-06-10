import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { ADVERTISEMENT_QUERY_KEY } from "./useGetAdvertisement";

export const ADVERTISEMENT_KPI_VIEWS_QUERY_KEY = (advertisementId: string) => [
  ...ADVERTISEMENT_QUERY_KEY(advertisementId),
  "KPI_VIEWS",
];

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

interface GetAdvertisementKPIViewsProps {
  advertisementId?: string;
}

interface DateSumCount {
  day: string;
  count: number;
}

export const GetAdvertisementKPIViews = async ({
  advertisementId,
}: GetAdvertisementKPIViewsProps): Promise<
  ConnectedXMResponse<DateSumCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/advertisements/${advertisementId}/kpi/views`
  );
  return data;
};

const useGetAdvertisementKPIViews = (advertisementId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAdvertisementKPIViews>>((
    ADVERTISEMENT_KPI_VIEWS_QUERY_KEY(advertisementId),
    () => GetAdvertisementKPIViews({ advertisementId }),
    {
      enabled: !!advertisementId,
    }
  );
};

export default useGetAdvertisementKPIViews;
