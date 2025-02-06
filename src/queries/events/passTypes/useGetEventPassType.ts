import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPassType } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PASS_TYPES_QUERY_KEY } from "./useGetEventPassTypes";

/**
 * Fetches data for a specific event pass type by event and pass type IDs.
 * This function is used to retrieve detailed information about a particular pass type associated with an event.
 * It is designed for applications that require access to event pass type details.
 * @name GetEventPassType
 * @param {string} eventId (path) The ID of the event
 * @param {string} passTypeId (path) The ID of the pass type
 * @version 1.3
 **/

export const EVENT_PASS_TYPE_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPES_QUERY_KEY(eventId), passTypeId];

export const SET_EVENT_PASS_TYPE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PASS_TYPE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPassType>>
) => {
  client.setQueryData(EVENT_PASS_TYPE_QUERY_KEY(...keyParams), response);
};

interface GetEventPassTypeParams extends SingleQueryParams {
  eventId: string;
  passTypeId: string;
}

export const GetEventPassType = async ({
  eventId,
  passTypeId,
  adminApiParams,
}: GetEventPassTypeParams): Promise<ConnectedXMResponse<EventPassType>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/passTypes/${passTypeId}`
  );
  return data;
};

export const useGetEventPassType = (
  eventId: string = "",
  passTypeId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventPassType>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPassType>>(
    EVENT_PASS_TYPE_QUERY_KEY(eventId, passTypeId),
    (params: SingleQueryParams) =>
      GetEventPassType({ eventId, passTypeId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!passTypeId && (options?.enabled ?? true),
    },
    "events"
  );
};
