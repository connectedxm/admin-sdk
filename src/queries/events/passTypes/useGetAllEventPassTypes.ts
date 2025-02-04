import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * Endpoint to retrieve all event pass types for a specific event.
 * This function fetches a list of all pass types associated with a given event, 
 * allowing users to understand the different access levels or categories available for that event.
 * It is useful in scenarios where detailed information about event pass types is required.
 * @name GetAllEventPassTypes
 * @param {string} eventId - The id of the event
 * @version 1.2
 **/

export const ALL_EVENT_PASS_TYPES_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ALL_PASS_TYPES",
];

export const SET_ALL_EVENT_PASS_TYPES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ALL_EVENT_PASS_TYPES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAllEventPassTypes>>
) => {
  client.setQueryData(ALL_EVENT_PASS_TYPES_QUERY_KEY(...keyParams), response);
};

interface GetAllEventPassTypesParams extends SingleQueryParams {
  eventId: string;
}

export const GetAllEventPassTypes = async ({
  eventId,
  adminApiParams,
}: GetAllEventPassTypesParams): Promise<
  ConnectedXMResponse<EventPassType[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/passTypes`, {
    params: {
      pageSize: 100,
    },
  });
  return data;
};

export const useGetAllEventPassTypes = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAllEventPassTypes>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAllEventPassTypes>>(
    ALL_EVENT_PASS_TYPES_QUERY_KEY(eventId),
    (params: SingleQueryParams) => GetAllEventPassTypes({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    },
    "events"
  );
};