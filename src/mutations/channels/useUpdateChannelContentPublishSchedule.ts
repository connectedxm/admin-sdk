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
 * @category Params
 * @group Channel
 */
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

/**
 * @category Methods
 * @group Channel
 */
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

/**
 * @category Mutations
 * @group Channel
 */
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
