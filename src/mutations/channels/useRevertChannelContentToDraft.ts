import { ChannelContent, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  SET_CHANNEL_CONTENT_QUERY_DATA,
  CHANNEL_CONTENT_QUERY_KEY,
  CHANNEL_CONTENTS_QUERY_KEY,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface RevertChannelContentToDraftParams extends MutationParams {
  contentId: string;
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const RevertChannelContentToDraft = async ({
  contentId,
  channelId,
  adminApiParams,
  queryClient,
}: RevertChannelContentToDraftParams): Promise<
  ConnectedXMResponse<ChannelContent>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<ChannelContent>>(
    `/channels/${channelId}/contents/${contentId}/revertToDraft`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_QUERY_KEY(channelId, contentId),
    });
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
export const useRevertChannelContentToDraft = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RevertChannelContentToDraft>>,
      Omit<RevertChannelContentToDraftParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RevertChannelContentToDraftParams,
    Awaited<ReturnType<typeof RevertChannelContentToDraft>>
  >(RevertChannelContentToDraft, options);
};
