import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  MeetingSessionChatDownload,
} from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_MESSAGES_QUERY_KEY = (sessionId: string) => [
  ...MEETING_SESSION_QUERY_KEY(sessionId),
  "MESSAGES",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessionMessages>>
) => {
  client.setQueryData(
    MEETING_SESSION_MESSAGES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingSessionMessagesParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessionMessages = async ({
  sessionId,
  adminApiParams,
}: GetMeetingSessionMessagesParams): Promise<
  ConnectedXMResponse<MeetingSessionChatDownload>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/messages`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSessionMessages = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingSessionMessages>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingSessionMessages>>(
    MEETING_SESSION_MESSAGES_QUERY_KEY(sessionId),
    (params) => GetMeetingSessionMessages({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
