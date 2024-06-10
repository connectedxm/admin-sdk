import { GetAdminAPI } from "@src/AdminAPI";
import { useConnectedSingleQuery } from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_PEOPLE_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_PEOPLE",
];

interface GetEventKPIPeopleProps {
  eventId?: string;
}

interface PeopleCounts {
  total: number;
  primary: number;
  guests: number;
}

export const GetEventKPIPeople = async ({
  eventId,
}: GetEventKPIPeopleProps): Promise<ConnectedXMResponse<PeopleCounts>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/people`);
  return data;
};

const useGetEventKPIPeople = (eventId: string) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPIPeople>>(
    EVENT_QUERY_KPI_PEOPLE_KEY(eventId),
    () => GetEventKPIPeople({ eventId }),
    {
      enabled: !!eventId,
    }
  );
};

export default useGetEventKPIPeople;
