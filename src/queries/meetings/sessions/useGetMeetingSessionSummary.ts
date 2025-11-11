import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  MeetingSessionSummaryDownload,
} from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_SUMMARY_QUERY_KEY = (sessionId: string) => [
  ...MEETING_SESSION_QUERY_KEY(sessionId),
  "SUMMARY",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_SUMMARY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessionSummary>>
) => {
  client.setQueryData(
    MEETING_SESSION_SUMMARY_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingSessionSummaryParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessionSummary = async ({
  sessionId,
  adminApiParams,
}: GetMeetingSessionSummaryParams): Promise<
  ConnectedXMResponse<MeetingSessionSummaryDownload>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/meetings/sessions/${sessionId}/summary`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSessionSummary = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingSessionSummary>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingSessionSummary>>(
    MEETING_SESSION_SUMMARY_QUERY_KEY(sessionId),
    (params) => GetMeetingSessionSummary({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
