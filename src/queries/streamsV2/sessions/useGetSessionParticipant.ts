import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingParticipant } from "@src/interfaces";
import { SESSION_PARTICIPANTS_QUERY_KEY } from "./useGetSessionParticipants";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_PARTICIPANT_QUERY_KEY = (
  meetingId: string,
  sessionId: string,
  participantId: string
) => [...SESSION_PARTICIPANTS_QUERY_KEY(meetingId, sessionId), participantId];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_PARTICIPANT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_PARTICIPANT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionParticipant>>
) => {
  client.setQueryData(SESSION_PARTICIPANT_QUERY_KEY(...keyParams), response);
};

interface GetSessionParticipantParams extends SingleQueryParams {
  meetingId: string;
  sessionId: string;
  participantId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionParticipant = async ({
  meetingId,
  sessionId,
  participantId,
  adminApiParams,
}: GetSessionParticipantParams): Promise<
  ConnectedXMResponse<MeetingParticipant>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/sessions/${sessionId}/participants/${participantId}`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionParticipant = (
  meetingId: string = "",
  sessionId: string = "",
  participantId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionParticipant>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionParticipant>>(
    SESSION_PARTICIPANT_QUERY_KEY(meetingId, sessionId, participantId),
    (params) =>
      GetSessionParticipant({ meetingId, sessionId, participantId, ...params }),
    {
      ...options,
      enabled:
        !!meetingId &&
        !!sessionId &&
        !!participantId &&
        (options?.enabled ?? true),
    }
  );
};
