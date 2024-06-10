import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

export const EVENT_QUERY_KPI_REGISTRATIONS_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_REGISTRATIONS",
];

interface GetEventKPIRegistrationsProps extends SingleQueryParams {
  eventId?: string;
}

interface DateCount {
  day: string;
  count: number;
}

export const GetEventKPIRegistrations = async ({
  eventId,
  adminApiParams,
}: GetEventKPIRegistrationsProps): Promise<
  ConnectedXMResponse<DateCount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/registrations`);
  return data;
};

const useGetEventKPIRegistrations = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventKPIRegistrations>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPIRegistrations>>(
    EVENT_QUERY_KPI_REGISTRATIONS_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventKPIRegistrations({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};

export default useGetEventKPIRegistrations;
