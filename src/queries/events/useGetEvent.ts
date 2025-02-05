import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Event } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENTS_QUERY_KEY } from "./useGetEvents";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Provides functions and hooks for querying event data, including fetching specific events and managing query data.
 * This module is designed to facilitate the retrieval and caching of event information within an application.
 * It includes utilities for setting query data and hooks for integrating with React Query.
 * @name GetEvent
 * @param {string} eventId - The id of the event
 * @version 1.2
 */

export const EVENT_QUERY_KEY = (eventId: string) => [
  ...EVENTS_QUERY_KEY(),
  eventId,
];

export const SET_EVENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEvent>>
) => {
  client.setQueryData(EVENT_QUERY_KEY(...keyParams), response);
};

interface GetEventProps extends SingleQueryParams {
  eventId: string;
}

export const GetEvent = async ({
  eventId,
  adminApiParams,
}: GetEventProps): Promise<ConnectedXMResponse<Event>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}`);
  return data;
};

export const useGetEvent = (
  eventId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEvent>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEvent>>(
    EVENT_QUERY_KEY(eventId),
    (params: SingleQueryParams) => GetEvent({ eventId, ...params }),
    {
      ...options,
      enabled: !!eventId && (options?.enabled ?? true),
    },
    "events"
  );
};