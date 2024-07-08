import { ConnectedXMResponse, ChannelContent } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_CONTENT_GUESTS_QUERY_KEY } from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface RemoveChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const RemoveChannelContentGuest = async ({
  contentId,
  accountId,
  channelId,
  adminApiParams,
  queryClient,
}: RemoveChannelContentGuestParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<ChannelContent>
  >(`/channels/${channelId}/contents/${contentId}/guests/${accountId}`);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_GUESTS_QUERY_KEY(channelId, contentId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useRemoveChannelContentGuest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveChannelContentGuest>>,
      Omit<RemoveChannelContentGuestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation(RemoveChannelContentGuest, options);
};
