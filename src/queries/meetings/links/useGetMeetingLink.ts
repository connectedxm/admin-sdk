import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, MeetingLink } from "@src/interfaces";
import { MEETING_LINKS_QUERY_KEY } from "./useGetMeetingLinks";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_LINK_QUERY_KEY = (meetingId: string, linkId: string) => [
  ...MEETING_LINKS_QUERY_KEY(meetingId),
  linkId,
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_LINK_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_LINK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingLink>>
) => {
  client.setQueryData(MEETING_LINK_QUERY_KEY(...keyParams), response);
};

interface GetMeetingLinkParams extends SingleQueryParams {
  meetingId: string;
  linkId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingLink = async ({
  meetingId,
  linkId,
  adminApiParams,
}: GetMeetingLinkParams): Promise<ConnectedXMResponse<MeetingLink>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/meetings/${meetingId}/links/${linkId}`);

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingLink = (
  meetingId: string = "",
  linkId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetMeetingLink>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetMeetingLink>>(
    MEETING_LINK_QUERY_KEY(meetingId, linkId),
    (params) => GetMeetingLink({ meetingId, linkId, ...params }),
    {
      ...options,
      enabled: !!meetingId && !!linkId && (options?.enabled ?? true),
    }
  );
};

