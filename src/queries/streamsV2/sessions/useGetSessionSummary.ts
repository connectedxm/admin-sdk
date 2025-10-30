import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SessionSummaryData } from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_SUMMARY_QUERY_KEY = (
  meetingId: string,
  sessionId: string
) => [...MEETING_SESSION_QUERY_KEY(meetingId, sessionId), "SUMMARY"];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_SUMMARY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionSummary>>
) => {
  client.setQueryData(SESSION_SUMMARY_QUERY_KEY(...keyParams), response);
};

interface GetSessionSummaryParams extends SingleQueryParams {
  meetingId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionSummary = async ({
  meetingId,
  sessionId,
  adminApiParams,
}: GetSessionSummaryParams): Promise<
  ConnectedXMResponse<SessionSummaryData>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}/summary`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionSummary = (
  meetingId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionSummary>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionSummary>>(
    SESSION_SUMMARY_QUERY_KEY(meetingId, sessionId),
    (params) => GetSessionSummary({ meetingId, sessionId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
