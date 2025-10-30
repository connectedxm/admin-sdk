import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Meeting } from "@src/interfaces";
import { MEETINGS_QUERY_KEY } from "./useGetMeetings";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_QUERY_KEY = (meetingId: string) => [
  ...MEETINGS_QUERY_KEY(),
  meetingId,
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeeting>>
) => {
  client.setQueryData(MEETING_QUERY_KEY(...keyParams), response);
};

interface GetMeetingParams extends SingleQueryParams {
  meetingId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeeting = async ({
  meetingId,
  adminApiParams,
}: GetMeetingParams): Promise<ConnectedXMResponse<Meeting>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/streams/v2/meetings/${meetingId}`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeeting = (
  meetingId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeeting>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeeting>>(
    MEETING_QUERY_KEY(meetingId),
    (params) => GetMeeting({ meetingId, ...params }),
    {
      ...options,
      enabled: !!meetingId && (options?.enabled ?? true),
    }
  );
};
