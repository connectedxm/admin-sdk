import { ConnectedXMResponse } from "@src/interfaces";
import { EventPass } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_PASSES_QUERY_KEY } from "./useGetEventPasses";

/**
 * Fetches details for a specific event pass by its ID within a given event.
 * This function is designed to manage and retrieve information about event passes, allowing users to access detailed data about a specific pass associated with an event.
 * It is useful in applications where event management and pass details are required.
 * @name GetEventPass
 * @param {string} eventId (path) - The id of the event
 * @param {string} passId (path) - The id of the pass
 * @version 1.3
 **/

export const EVENT_PASS_QUERY_KEY = (eventId: string, passId: string) => [
  ...EVENT_PASSES_QUERY_KEY(eventId),
  passId,
];

export const SET_EVENT_PASS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_PASS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPass>>
) => {
  client.setQueryData(EVENT_PASS_QUERY_KEY(...keyParams), response);
};

interface GetEventPassProps extends SingleQueryParams {
  eventId: string;
  passId: string;
}

export const GetEventPass = async ({
  eventId,
  passId,
  adminApiParams,
}: GetEventPassProps): Promise<ConnectedXMResponse<EventPass>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/passes/${passId}`);
  return data;
};

export const useGetEventPass = (
  eventId: string = "",
  passId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPass>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPass>>(
    EVENT_PASS_QUERY_KEY(eventId, passId),
    (params: SingleQueryParams) =>
      GetEventPass({
        eventId,
        passId,
        ...params,
      }),
    {
      ...options,
      enabled: !!eventId && !!passId && (options?.enabled ?? true),
    },
    "events"
  );
};