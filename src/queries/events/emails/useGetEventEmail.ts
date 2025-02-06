import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventEmail, EventEmailType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches event email data based on the specified type for a given event.
 * This function is designed to retrieve detailed information about event emails, 
 * which can be used in applications that require insights into specific types of event communications.
 * @name GetEventEmail
 * @param {string} eventId (path) - The id of the event
 * @param {EventEmailType} type (path) - The type of the event email
 * @version 1.3
 **/

export const EVENT_EMAIL_QUERY_KEY = (
  eventId: string,
  type: EventEmailType
) => [...EVENT_QUERY_KEY(eventId), "EVENT_EMAIL", type];

export const SET_EVENT_EMAIL_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_EMAIL_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventEmail>>
) => {
  client.setQueryData(EVENT_EMAIL_QUERY_KEY(...keyParams), response);
};

interface GetEventEmailProps extends SingleQueryParams {
  eventId: string;
  type: EventEmailType;
}

export const GetEventEmail = async ({
  eventId,
  type,
  adminApiParams,
}: GetEventEmailProps): Promise<ConnectedXMResponse<EventEmail>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/emails/${type}`);
  return data;
};

export const useGetEventEmail = (
  eventId: string = "",
  type: EventEmailType,
  options: SingleQueryOptions<ReturnType<typeof GetEventEmail>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventEmail>>(
    EVENT_EMAIL_QUERY_KEY(eventId, type),
    (params: SingleQueryParams) => GetEventEmail({ type, eventId, ...params }),
    {
      ...options,
      enabled: !!type && (options?.enabled ?? true),
    },
    "events"
  );
};