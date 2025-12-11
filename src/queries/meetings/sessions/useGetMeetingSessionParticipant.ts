import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  MeetingSessionParticipant,
} from "@src/interfaces";
import { MEETING_SESSION_PARTICIPANTS_QUERY_KEY } from "./useGetMeetingSessionParticipants";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_PARTICIPANT_QUERY_KEY = (
  sessionId: string,
  participantId: string
) => [...MEETING_SESSION_PARTICIPANTS_QUERY_KEY(sessionId), participantId];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_PARTICIPANT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_PARTICIPANT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessionParticipant>>
) => {
  client.setQueryData(
    MEETING_SESSION_PARTICIPANT_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingSessionParticipantParams extends SingleQueryParams {
  sessionId: string;
  participantId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessionParticipant = async ({
  sessionId,
  participantId,
  adminApiParams,
}: GetMeetingSessionParticipantParams): Promise<
  ConnectedXMResponse<MeetingSessionParticipant>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/meetings/sessions/${sessionId}/participants/${participantId}`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSessionParticipant = (
  sessionId: string = "",
  participantId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetMeetingSessionParticipant>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetMeetingSessionParticipant>
  >(
    MEETING_SESSION_PARTICIPANT_QUERY_KEY(sessionId, participantId),
    (params) =>
      GetMeetingSessionParticipant({ sessionId, participantId, ...params }),
    {
      ...options,
      enabled: !!sessionId && !!participantId && (options?.enabled ?? true),
    }
  );
};
