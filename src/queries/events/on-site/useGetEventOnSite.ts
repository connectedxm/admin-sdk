import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventOnSite } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "../useGetEvents";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_ON_SITE_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(),
  eventId,
  "ON_SITE",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_ON_SITE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_ON_SITE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventOnSite>>
) => {
  client.setQueryData(EVENT_ON_SITE_QUERY_KEY(...keyParams), response);
};

interface GetEventOnSiteProps extends SingleQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventOnSite = async ({
  eventId,
  adminApiParams,
}: GetEventOnSiteProps): Promise<ConnectedXMResponse<EventOnSite | null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/on-site`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventOnSite = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventOnSite>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventOnSite>>(
    EVENT_ON_SITE_QUERY_KEY(eventId),
    (params: SingleQueryParams) => GetEventOnSite({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    },
    "events"
  );
};
