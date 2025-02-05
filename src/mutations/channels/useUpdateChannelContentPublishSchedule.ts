import { ConnectedXMResponse, ChannelContent } from "@src/interfaces";
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
 * @param {string} contentId - The id of the content
 * @param {string} channelId - The id of the channel
 * @param {object} schedule - The schedule details
 * @param {string} schedule.date - The date of the schedule
 * @param {boolean} schedule.email - Email notification flag
 * @param {boolean} schedule.push - Push notification flag
 * @param {boolean} schedule.visible - Visibility flag
 * @version 1.2
 **/
export interface UpdateChannelContentPublishScheduleParams
  extends MutationParams {
  contentId: string;
  channelId: string;
  schedule: {
    date: string;
    email: boolean;
    push: boolean;
    visible: boolean;
  };
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