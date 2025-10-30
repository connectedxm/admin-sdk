import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingSession } from "@src/interfaces";
import { MEETING_SESSIONS_QUERY_KEY } from "./useGetMeetingSessions";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_QUERY_KEY = (
  meetingId: string,
  sessionId: string
) => [...MEETING_SESSIONS_QUERY_KEY(meetingId), sessionId];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSession>>
) => {
  client.setQueryData(MEETING_SESSION_QUERY_KEY(...keyParams), response);
};

interface GetMeetingSessionParams extends SingleQueryParams {
  meetingId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSession = async ({
  meetingId,
  sessionId,
  adminApiParams,
}: GetMeetingSessionParams): Promise<ConnectedXMResponse<MeetingSession>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSession = (
  meetingId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingSession>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingSession>>(
    MEETING_SESSION_QUERY_KEY(meetingId, sessionId),
    (params) => GetMeetingSession({ meetingId, sessionId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
