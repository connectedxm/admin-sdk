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
 * @category Keys
 * @group Events
 */
export const EVENT_PASS_TYPE_QUERY_KEY = (
  eventId: string,
  passTypeId: string
) => [...EVENT_PASS_TYPES_QUERY_KEY(eventId), passTypeId];

/**
 * @category Setters
 * @group Events
 */
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

/**
 * @category Queries
 * @group Events
 */
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
/**
 * @category Hooks
 * @group Events
 */
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
