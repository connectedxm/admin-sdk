import {
  ConnectedXMResponse,
  ChannelContent,
  ContentPublishSchedule,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_CONTENTS_QUERY_KEY,
  SET_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries/channels";

/**
 * Endpoint to update the publish schedule for a specific channel content.
 * This function allows updating the schedule details for content within a channel, including date and notification settings.
 * It is designed to be used in applications where managing content schedules is required.
 * @name UpdateChannelContentPublishSchedule
 * @param {string} contentId (path) The id of the content
 * @param {string} channelId (path) The id of the channel
 * @param {ContentPublishSchedule} schedule (body) The schedule details
 * @version 1.3
 **/
export interface UpdateChannelContentPublishScheduleParams
  extends MutationParams {
  contentId: string;
  channelId: string;
  schedule: ContentPublishSchedule;
}

export const UpdateChannelContentPublishSchedule = async ({
  contentId,
  channelId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateChannelContentPublishScheduleParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post(
    `/channels/${channelId}/contents/${contentId}/schedule`,
    schedule
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data);
  }
  return data;
};

export const useUpdateChannelContentPublishSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContentPublishSchedule>>,
      Omit<
        UpdateChannelContentPublishScheduleParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentPublishScheduleParams,
    Awaited<ReturnType<typeof UpdateChannelContentPublishSchedule>>
  >(UpdateChannelContentPublishSchedule, options, {
    domain: "channels",
    type: "update",
  });
};
