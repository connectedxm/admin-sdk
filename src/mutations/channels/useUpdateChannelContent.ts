import { ConnectedXMResponse, ChannelContent } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
  SET_CHANNEL_CONTENT_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface UpdateChannelContentParams extends MutationParams {
  contentId: string;
  content: ChannelContent;
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const UpdateChannelContent = async ({
  contentId,
  channelId,
  content,
  adminApiParams,
  queryClient,
}: UpdateChannelContentParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put(
    `/channels/${channelId}/contents/${contentId}`,
    content
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(queryClient, [channelId, contentId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useUpdateChannelContent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelContent>>,
      Omit<UpdateChannelContentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelContentParams,
    Awaited<ReturnType<typeof UpdateChannelContent>>
  >(UpdateChannelContent, options);
};
