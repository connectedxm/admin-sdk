import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { StreamSessionChatMessage } from "@src/interfaces";
import {
  CursorQueryOptions,
  CursorQueryParams,
  useConnectedCursorQuery,
} from "../useConnectedCursorQuery";
import { STREAM_SESSION_QUERY_KEY } from "./useGetStreamSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Streams
 */
export const STREAM_SESSION_CHAT_QUERY_KEY = (
  streamId: string,
  sessionId: string
) => [...STREAM_SESSION_QUERY_KEY(streamId, sessionId), "CHAT"];

/**
 * @category Setters
 * @group Streams
 */
export const SET_STREAM_SESSION_CHAT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof STREAM_SESSION_CHAT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetStreamSessionChat>>
) => {
  client.setQueryData(STREAM_SESSION_CHAT_QUERY_KEY(...keyParams), response);
};

interface GetStreamSessionChatParams extends CursorQueryParams {
  streamId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group Streams
 */
export const GetStreamSessionChat = async ({
  streamId,
  sessionId,
  cursor,
  pageSize,
  adminApiParams,
}: GetStreamSessionChatParams): Promise<
  ConnectedXMResponse<StreamSessionChatMessage[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/${streamId}/sessions/${sessionId}/chat`,
    {
      params: {
        cursor: cursor || undefined,
        pageSize: pageSize || undefined,
      },
    }
  );

  // Map nextCursor to cursor for compatibility with useConnectedCursorQuery
  // The API returns nextCursor but ConnectedXMResponse expects cursor
  const response = data as any;
  if (response && response.nextCursor !== undefined) {
    return {
      ...response,
      cursor: response.nextCursor,
    } as ConnectedXMResponse<StreamSessionChatMessage[]>;
  }

  return data;
};

/**
 * @category Hooks
 * @group Streams
 */
export const useGetStreamSessionChat = (
  streamId: string = "",
  sessionId: string = "",
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "adminApiParams"
  > = {},
  options: CursorQueryOptions<
    Awaited<ReturnType<typeof GetStreamSessionChat>>
  > = {}
) => {
  return useConnectedCursorQuery<
    Awaited<ReturnType<typeof GetStreamSessionChat>>
  >(
    STREAM_SESSION_CHAT_QUERY_KEY(streamId, sessionId),
    (params: CursorQueryParams) =>
      GetStreamSessionChat({
        ...params,
        streamId,
        sessionId,
      }),
    params,
    {
      ...options,
      enabled: !!streamId && !!sessionId && (options.enabled ?? true),
    }
  );
};
