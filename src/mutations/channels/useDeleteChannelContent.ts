import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  CHANNEL_SUBSCRIBERS_QUERY_KEY,
  CHANNEL_CONTENT_QUERY_KEY,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface DeleteChannelContentParams extends MutationParams {
  contentId: string;
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const DeleteChannelContent = async ({
  contentId,
  channelId,
  adminApiParams,
  queryClient,
}: DeleteChannelContentParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/channels/${channelId}/contents/${contentId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_SUBSCRIBERS_QUERY_KEY(channelId),
    });
    queryClient.removeQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useDeleteChannelContent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteChannelContent>>,
      Omit<DeleteChannelContentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteChannelContentParams,
    Awaited<ReturnType<typeof DeleteChannelContent>>
  >(DeleteChannelContent, options);
};
