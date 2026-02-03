import { GetAdminAPI } from "@src/AdminAPI";
import { EVENT_SESSIONS_QUERY_KEY } from "../useGetEventSessions";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventSessionBlock } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_SESSION_BLOCK_QUERY_KEY = (
  eventId: string,
  blockId: string
) => [...EVENT_SESSIONS_QUERY_KEY(eventId), blockId];

/**
 * @category Queries
 * @group Events
 */
export const SET_EVENT_SESSION_BLOCK_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SESSION_BLOCK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSessionBlock>>
) => {
  client.setQueryData(EVENT_SESSION_BLOCK_QUERY_KEY(...keyParams), response);
};

interface GetEventSessionBlockProps extends SingleQueryParams {
  eventId: string;
  blockId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventSessionBlock = async ({
  eventId,
  blockId,
  adminApiParams,
}: GetEventSessionBlockProps): Promise<
  ConnectedXMResponse<EventSessionBlock>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/blocks/${blockId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventSessionBlock = (
  eventId: string = "",
  blockId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventSessionBlock>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventSessionBlock>>(
    EVENT_SESSION_BLOCK_QUERY_KEY(eventId, blockId),
    (params) => GetEventSessionBlock({ eventId, blockId, ...params }),
    { ...options, enabled: !!eventId && !!blockId }
  );
};
