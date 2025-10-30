import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingParticipant } from "@src/interfaces";
import { MEETING_QUERY_KEY } from "../meetings/useGetMeeting";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_PARTICIPANTS_QUERY_KEY = (meetingId: string) => [
  ...MEETING_QUERY_KEY(meetingId),
  "PARTICIPANTS",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_PARTICIPANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_PARTICIPANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingParticipants>>
) => {
  client.setQueryData(MEETING_PARTICIPANTS_QUERY_KEY(...keyParams), response);
};

interface GetMeetingParticipantsParams extends SingleQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingParticipants = async ({
  meetingId,
  adminApiParams,
}: GetMeetingParticipantsParams): Promise<
  ConnectedXMResponse<MeetingParticipant[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/meetings/${meetingId}/participants`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingParticipants = (
  meetingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingParticipants>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingParticipants>>(
    MEETING_PARTICIPANTS_QUERY_KEY(meetingId),
    (params) => GetMeetingParticipants({ meetingId, ...params }),
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
