import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_REGISTRATIONS_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_REGISTRATIONS",
];

interface GetEventKPIRegistrationsProps {
  eventId?: string;
}

interface DateCount {
  day: string;
  count: number;
}

export const GetEventKPIRegistrations = async ({
  eventId,
}: GetEventKPIRegistrationsProps): Promise<
  ConnectedXMResponse<DateCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/registrations`);
  return data;
};

const useGetEventKPIRegistrations = (eventId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPIRegistrations>>((
    EVENT_QUERY_KPI_REGISTRATIONS_KEY(eventId),
    () => GetEventKPIRegistrations({ eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventKPIRegistrations;
