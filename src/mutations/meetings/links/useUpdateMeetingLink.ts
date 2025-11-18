import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { MeetingLink, ConnectedXMResponse } from "@src/interfaces";
import { MEETING_LINKS_QUERY_KEY, SET_MEETING_LINK_QUERY_DATA } from "@src/queries";
import { MeetingLinkUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group StreamsV2
 */
export interface UpdateMeetingLinkParams extends MutationParams {
  meetingId: string;
  linkId: string;
  link: MeetingLinkUpdateInputs;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const UpdateMeetingLink = async ({
  meetingId,
  linkId,
  link,
  adminApiParams,
  queryClient,
}: UpdateMeetingLinkParams): Promise<ConnectedXMResponse<MeetingLink>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<MeetingLink>>(
    `/meetings/${meetingId}/links/${linkId}`,
    link
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: MEETING_LINKS_QUERY_KEY(meetingId) });
    SET_MEETING_LINK_QUERY_DATA(queryClient, [meetingId, linkId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useUpdateMeetingLink = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateMeetingLink>>,
      Omit<UpdateMeetingLinkParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateMeetingLinkParams,
    Awaited<ReturnType<typeof UpdateMeetingLink>>
  >(UpdateMeetingLink, options);
};

