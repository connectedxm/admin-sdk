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
 * Endpoint to cancel the scheduled publish of channel content.
 * This function allows users to cancel a previously scheduled publish operation for specific content within a channel.
 * It is useful in scenarios where content needs to be unscheduled due to changes in publishing plans or errors in the scheduling process.
 * @name CancelChannelContentPublishSchedule
 * @param {string} contentId (path) The id of the content
 * @param {string} channelId (path) The id of the channel
 * @version 1.3
 **/
export interface CancelChannelContentPublishScheduleParams
  extends MutationParams {
  contentId: string;
  channelId: string;
}

export const CancelChannelContentPublishSchedule = async ({
  contentId,
  channelId,
  adminApiParams,
  queryClient,
}: CancelChannelContentPublishScheduleParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<ChannelContent>>(
    `/channels/${channelId}/contents/${contentId}/schedule`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data);
  }
  return data;
};

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
    domain: "channels",
    type: "update",
  });
};