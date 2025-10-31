import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Participant } from "@src/interfaces";
import { MEETING_PARTICIPANTS_QUERY_KEY } from "./useGetMeetingParticipants";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_PARTICIPANT_QUERY_KEY = (
  meetingId: string,
  participantId: string
) => [...MEETING_PARTICIPANTS_QUERY_KEY(meetingId), participantId];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_PARTICIPANT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_PARTICIPANT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingParticipant>>
) => {
  client.setQueryData(MEETING_PARTICIPANT_QUERY_KEY(...keyParams), response);
};

interface GetMeetingParticipantParams extends SingleQueryParams {
  meetingId: string;
  participantId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingParticipant = async ({
  meetingId,
  participantId,
  adminApiParams,
}: GetMeetingParticipantParams): Promise<ConnectedXMResponse<Participant>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/participants/${participantId}`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingParticipant = (
  meetingId: string = "",
  participantId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingParticipant>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingParticipant>>(
    MEETING_PARTICIPANT_QUERY_KEY(meetingId, participantId),
    (params) => GetMeetingParticipant({ meetingId, participantId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!participantId && (options?.enabled ?? true),
    }
  );
};
