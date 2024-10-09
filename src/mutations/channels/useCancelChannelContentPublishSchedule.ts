import { ChannelContent, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  SET_CHANNEL_CONTENT_QUERY_DATA,
  CHANNEL_CONTENTS_QUERY_KEY,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface CancelChannelContentPublishScheduleParams
  extends MutationParams {
  contentId: string;
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const CancelChannelContentPublishSchedule = async ({
  contentId,
  channelId,
  adminApiParams,
  queryClient,
}: CancelChannelContentPublishScheduleParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<ChannelContent>
  >(`/channels/${channelId}/contents/${contentId}/schedule`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useCancelChannelContentPublishSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelChannelContentPublishSchedule>>,
      Omit<
        CancelChannelContentPublishScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelChannelContentPublishScheduleParams,
    Awaited<ReturnType<typeof CancelChannelContentPublishSchedule>>
  >(CancelChannelContentPublishSchedule, options, {
    domain: "contents",
    type: "update",
  });
};
