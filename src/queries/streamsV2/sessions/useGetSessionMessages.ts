import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SessionChatData } from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_MESSAGES_QUERY_KEY = (
  meetingId: string,
  sessionId: string
) => [...MEETING_SESSION_QUERY_KEY(meetingId, sessionId), "MESSAGES"];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionMessages>>
) => {
  client.setQueryData(SESSION_MESSAGES_QUERY_KEY(...keyParams), response);
};

interface GetSessionMessagesParams extends SingleQueryParams {
  meetingId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionMessages = async ({
  meetingId,
  sessionId,
  adminApiParams,
}: GetSessionMessagesParams): Promise<ConnectedXMResponse<SessionChatData>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}/messages`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionMessages = (
  meetingId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionMessages>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionMessages>>(
    SESSION_MESSAGES_QUERY_KEY(meetingId, sessionId),
    (params) => GetSessionMessages({ meetingId, sessionId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
