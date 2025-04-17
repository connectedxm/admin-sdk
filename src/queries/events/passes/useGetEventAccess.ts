import { ConnectedXMResponse, EventAccess } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSIONS_QUERY_KEY } from "../sessions";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ACCESS_QUERY_KEY = (eventId: string, accessId: string) => [
  ...EVENT_SESSIONS_QUERY_KEY(eventId),
  "ACCESSES",
  accessId,
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ACCESS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_ACCESS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventAccess>>
) => {
  client.setQueryData(EVENT_ACCESS_QUERY_KEY(...keyParams), response);
};

interface GetEventAccessProps extends SingleQueryParams {
  eventId: string;
  accessId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventAccess = async ({
  eventId,
  accessId,
  adminApiParams,
}: GetEventAccessProps): Promise<ConnectedXMResponse<EventAccess>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/accesses/${accessId}`
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventAccess = (
  eventId: string = "",
  accessId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventAccess>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventAccess>>(
    EVENT_ACCESS_QUERY_KEY(eventId, accessId),
    (params: SingleQueryParams) =>
      GetEventAccess({
        eventId,
        accessId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!accessId && (options?.enabled ?? true),
    },
    "events"
  );
};
