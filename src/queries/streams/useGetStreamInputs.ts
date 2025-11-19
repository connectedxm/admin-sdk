import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../useConnectedInfiniteQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamInput } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_INPUTS_QUERY_KEY = (
  eventId?: string,
  sessionId?: string,
  groupId?: string,
  meetingId?: string
) => {
  const key = ["STREAMS"];
  if (eventId) key.push(eventId);
  if (sessionId) key.push(sessionId);
  if (groupId) key.push(groupId);
  if (meetingId) key.push(meetingId);
  return key;
};

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_INPUTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_INPUTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamInputs>>
) => {
  client.setQueryData(STREAM_INPUTS_QUERY_KEY(...keyParams), response);
};

interface GetStreamInputsParams extends InfiniteQueryParams {
  eventId?: string;
  sessionId?: string;
  groupId?: string;
  meetingId?: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamInputs = async ({
  eventId,
  sessionId,
  groupId,
  meetingId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetStreamInputsParams): Promise<ConnectedXMResponse<StreamInput[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      eventId: eventId || undefined,
      sessionId: sessionId || undefined,
      groupId: groupId || undefined,
      meetingId: meetingId || undefined,
    },
  });

  return data;
};
/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamInputs = (
  eventId?: string,
  sessionId?: string,
  groupId?: string,
  meetingId?: string,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetStreamInputs>>
  > = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetStreamInputs>>>(
    STREAM_INPUTS_QUERY_KEY(eventId, sessionId, groupId, meetingId),
    (params: InfiniteQueryParams) =>
      GetStreamInputs({ ...params, eventId, sessionId, groupId, meetingId }),
    params,
    options
  );
};
