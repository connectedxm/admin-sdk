import { ConnectedXMResponse, Content } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_CONTENT_AUTHORS_QUERY_KEY } from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface RemoveChannelContentAuthorParams extends MutationParams {
  contentId: string;
  channelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const RemoveChannelContentAuthor = async ({
  contentId,
  accountId,
  channelId,
  adminApiParams,
  queryClient,
}: RemoveChannelContentAuthorParams): Promise<ConnectedXMResponse<Content>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Content>>(
    `/contents/${contentId}/authors/${accountId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_AUTHORS_QUERY_KEY(channelId, contentId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useRemoveChannelContentAuthor = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveChannelContentAuthor>>,
      Omit<RemoveChannelContentAuthorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(RemoveChannelContentAuthor, options);
};
