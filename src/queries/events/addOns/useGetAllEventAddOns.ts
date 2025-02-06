import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_QUERY_KEY } from "../useGetEvent";

/**
 * Retrieves all add-ons associated with a specific event.
 * This function is used to fetch and manage event add-ons, allowing applications to access detailed information about each add-on linked to an event.
 * It supports setting query data for efficient data management and retrieval.
 * @name GetAllEventAddOns
 * @param {string} eventId (path) The id of the event
 * @version 1.3
 **/

export const ALL_EVENT_ADD_ON_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "ALL_ADD_ONS",
];

export const SET_ALL_EVENT_ADD_ON_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ALL_EVENT_ADD_ON_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAllEventAddOns>>
) => {
  client.setQueryData(ALL_EVENT_ADD_ON_QUERY_KEY(...keyParams), response);
};

interface GetAllEventAddOnsProps extends SingleQueryParams {
  eventId: string;
}

export const GetAllEventAddOns = async ({
  eventId,
  adminApiParams,
}: GetAllEventAddOnsProps): Promise<ConnectedXMResponse<EventAddOn[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/addOns`, {
    params: {
      pageSize: 100,
    },
  });
  return data;
};

export const useGetAllEventAddOns = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAllEventAddOns>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAllEventAddOns>>(
    ALL_EVENT_ADD_ON_QUERY_KEY(eventId),
    (params: SingleQueryParams) => GetAllEventAddOns({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    },
    "events"
  );
};
