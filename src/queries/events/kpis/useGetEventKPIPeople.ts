import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EVENT_QUERY_KEY } from "../useGetEvent";

export const EVENT_QUERY_KPI_PEOPLE_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "KPI_PEOPLE",
];

interface GetEventKPIPeopleProps extends SingleQueryParams {
  eventId?: string;
}

interface PeopleCounts {
  total: number;
  primary: number;
  guests: number;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventKPIPeople = async ({
  eventId,
  adminApiParams,
}: GetEventKPIPeopleProps): Promise<ConnectedXMResponse<PeopleCounts>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/kpi/people`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventKPIPeople = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventKPIPeople>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventKPIPeople>>(
    EVENT_QUERY_KPI_PEOPLE_KEY(eventId),
    (params: SingleQueryParams) => GetEventKPIPeople({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    }
  );
};
