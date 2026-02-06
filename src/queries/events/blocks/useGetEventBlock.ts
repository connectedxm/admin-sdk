import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "@src/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventBlock } from "@src/interfaces";
import { EVENT_BLOCKS_QUERY_KEY } from "./useGetEventBlocks";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_BLOCK_QUERY_KEY = (eventId: string, blockId: string) => [
  ...EVENT_BLOCKS_QUERY_KEY(eventId),
  blockId,
];

/**
 * @category Queries
 * @group Events
 */
export const SET_EVENT_BLOCK_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_BLOCK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventBlock>>
) => {
  client.setQueryData(EVENT_BLOCK_QUERY_KEY(...keyParams), response);
};

interface GetEventBlockProps extends SingleQueryParams {
  eventId: string;
  blockId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventBlock = async ({
  eventId,
  blockId,
  adminApiParams,
}: GetEventBlockProps): Promise<ConnectedXMResponse<EventBlock>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/blocks/${blockId}`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventBlock = (
  eventId: string = "",
  blockId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetEventBlock>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventBlock>>(
    EVENT_BLOCK_QUERY_KEY(eventId, blockId),
    (params) => GetEventBlock({ eventId, blockId, ...params }),
    {
      ...options,
      enabled: !!eventId && !!blockId && (options?.enabled ?? true),
    }
  );
};
