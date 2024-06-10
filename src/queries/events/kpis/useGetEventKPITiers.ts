import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_SALES_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_TIERS",
];

interface GetEventKPITiersProps {
  eventId?: string;
}

interface DateSumCount {
  label: string;
  value: number;
}

export const GetEventKPITiers = async ({
  eventId,
}: GetEventKPITiersProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/tiers`);
  return data;
};

const useGetEventKPITiers = (eventId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPITiers>>(
    EVENT_QUERY_KPI_SALES_KEY(eventId),
    () => GetEventKPITiers({ eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventKPITiers;
