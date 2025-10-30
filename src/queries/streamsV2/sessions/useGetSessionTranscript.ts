import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SessionTranscriptData } from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_TRANSCRIPT_QUERY_KEY = (
  meetingId: string,
  sessionId: string
) => [...MEETING_SESSION_QUERY_KEY(meetingId, sessionId), "TRANSCRIPT"];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_TRANSCRIPT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_TRANSCRIPT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionTranscript>>
) => {
  client.setQueryData(SESSION_TRANSCRIPT_QUERY_KEY(...keyParams), response);
};

interface GetSessionTranscriptParams extends SingleQueryParams {
  meetingId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionTranscript = async ({
  meetingId,
  sessionId,
  adminApiParams,
}: GetSessionTranscriptParams): Promise<
  ConnectedXMResponse<SessionTranscriptData>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}/transcript`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionTranscript = (
  meetingId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionTranscript>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionTranscript>>(
    SESSION_TRANSCRIPT_QUERY_KEY(meetingId, sessionId),
    (params) => GetSessionTranscript({ meetingId, sessionId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
