import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { MeetingLink, ConnectedXMResponse } from "@src/interfaces";
import { MEETING_LINKS_QUERY_KEY, SET_MEETING_LINK_QUERY_DATA } from "@src/queries";
import { MeetingLinkCreateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface CreateMeetingLinkParams extends MutationParams {
  meetingId: string;
  link: MeetingLinkCreateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const CreateMeetingLink = async ({
  meetingId,
  link,
  adminApiParams,
  queryClient,
}: CreateMeetingLinkParams): Promise<ConnectedXMResponse<MeetingLink>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<MeetingLink>>(
    `/meetings/${meetingId}/links`,
    link
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: MEETING_LINKS_QUERY_KEY(meetingId) });
    SET_MEETING_LINK_QUERY_DATA(queryClient, [meetingId, data?.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useCreateMeetingLink = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateMeetingLink>>,
      Omit<CreateMeetingLinkParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateMeetingLinkParams,
    Awaited<ReturnType<typeof CreateMeetingLink>>
  >(CreateMeetingLink, options);
};

