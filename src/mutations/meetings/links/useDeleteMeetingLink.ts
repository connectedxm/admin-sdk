import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { MEETING_LINKS_QUERY_KEY, MEETING_LINK_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group StreamsV2
 */
export interface DeleteMeetingLinkParams extends MutationParams {
  meetingId: string;
  linkId: string;
}

/**
 * @category Methods
 * @group StreamsV2
 */
export const DeleteMeetingLink = async ({
  meetingId,
  linkId,
  adminApiParams,
  queryClient,
}: DeleteMeetingLinkParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/meetings/${meetingId}/links/${linkId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: MEETING_LINKS_QUERY_KEY(meetingId) });
    queryClient.removeQueries({ queryKey: MEETING_LINK_QUERY_KEY(meetingId, linkId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group StreamsV2
 */
export const useDeleteMeetingLink = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteMeetingLink>>,
      Omit<DeleteMeetingLinkParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteMeetingLinkParams,
    Awaited<ReturnType<typeof DeleteMeetingLink>>
  >(DeleteMeetingLink, options);
};

