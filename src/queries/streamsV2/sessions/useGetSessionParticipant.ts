import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Participant } from "@src/interfaces";
import { SESSION_PARTICIPANTS_QUERY_KEY } from "./useGetSessionParticipants";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_PARTICIPANT_QUERY_KEY = (
  sessionId: string,
  participantId: string
) => [...SESSION_PARTICIPANTS_QUERY_KEY(sessionId), participantId];

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
  sessionId: string;
  participantId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionParticipant = async ({
  sessionId,
  participantId,
  adminApiParams,
}: GetSessionParticipantParams): Promise<ConnectedXMResponse<Participant>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/participants/${participantId}`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionParticipant = (
  sessionId: string = "",
  participantId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionParticipant>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionParticipant>>(
    SESSION_PARTICIPANT_QUERY_KEY(sessionId, participantId),
    (params) => GetSessionParticipant({ sessionId, participantId, ...params }),
    {
      ...options,
      enabled: !!sessionId && !!participantId && (options?.enabled ?? true),
    }
  );
};
