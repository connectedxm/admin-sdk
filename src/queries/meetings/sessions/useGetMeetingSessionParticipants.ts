import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Participant } from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_PARTICIPANTS_QUERY_KEY = (sessionId: string) => [
  ...MEETING_SESSION_QUERY_KEY(sessionId),
  "PARTICIPANTS",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_PARTICIPANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_PARTICIPANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessionParticipants>>
) => {
  client.setQueryData(
    MEETING_SESSION_PARTICIPANTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingSessionParticipantsParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessionParticipants = async ({
  sessionId,
  adminApiParams,
}: GetMeetingSessionParticipantsParams): Promise<
  ConnectedXMResponse<Participant[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/meetings/sessions/${sessionId}/participants`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSessionParticipants = (
  sessionId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetMeetingSessionParticipants>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetMeetingSessionParticipants>
  >(
    MEETING_SESSION_PARTICIPANTS_QUERY_KEY(sessionId),
    (params) => GetMeetingSessionParticipants({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
