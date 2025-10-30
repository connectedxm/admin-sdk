import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingParticipant } from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_PARTICIPANTS_QUERY_KEY = (
  meetingId: string,
  sessionId: string
) => [...MEETING_SESSION_QUERY_KEY(meetingId, sessionId), "PARTICIPANTS"];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_PARTICIPANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_PARTICIPANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionParticipants>>
) => {
  client.setQueryData(SESSION_PARTICIPANTS_QUERY_KEY(...keyParams), response);
};

interface GetSessionParticipantsParams extends SingleQueryParams {
  meetingId: string;
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionParticipants = async ({
  meetingId,
  sessionId,
  adminApiParams,
}: GetSessionParticipantsParams): Promise<
  ConnectedXMResponse<MeetingParticipant[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}/participants`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionParticipants = (
  meetingId: string = "",
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionParticipants>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionParticipants>>(
    SESSION_PARTICIPANTS_QUERY_KEY(meetingId, sessionId),
    (params) => GetSessionParticipants({ meetingId, sessionId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!sessionId && (options?.enabled ?? true),
    }
  );
};
