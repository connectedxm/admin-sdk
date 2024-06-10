import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_SALES_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_SALES",
];

interface GetEventKPISalesProps {
  eventId?: string;
}

interface DateSumCount {
  day: string;
  sales: number;
  revenue: number;
}

export const GetEventKPISales = async ({
  eventId,
}: GetEventKPISalesProps): Promise<ConnectedXMResponse<DateSumCount[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/sales`);
  return data;
};

const useGetEventKPISales = (eventId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPISales>>(
    EVENT_QUERY_KPI_SALES_KEY(eventId),
    () => GetEventKPISales({ eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventKPISales;
