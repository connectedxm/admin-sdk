import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  MeetingSessionTranscriptDownload,
} from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_TRANSCRIPT_QUERY_KEY = (sessionId: string) => [
  ...MEETING_SESSION_QUERY_KEY(sessionId),
  "TRANSCRIPT",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_TRANSCRIPT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_TRANSCRIPT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessionTranscript>>
) => {
  client.setQueryData(
    MEETING_SESSION_TRANSCRIPT_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingSessionTranscriptParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessionTranscript = async ({
  sessionId,
  adminApiParams,
}: GetMeetingSessionTranscriptParams): Promise<
  ConnectedXMResponse<MeetingSessionTranscriptDownload>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/transcript`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSessionTranscript = (
  sessionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetMeetingSessionTranscript>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetMeetingSessionTranscript>
  >(
    MEETING_SESSION_TRANSCRIPT_QUERY_KEY(sessionId),
    (params) => GetMeetingSessionTranscript({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
