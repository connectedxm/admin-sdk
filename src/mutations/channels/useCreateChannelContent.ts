import { ConnectedXMResponse, Content } from "@src/interfaces";
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
export interface CreateChannelContentParams extends MutationParams {
  content: Content;
  channelId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const CreateChannelContent = async ({
  content,
  channelId,
  adminApiParams,
  queryClient,
}: CreateChannelContentParams): Promise<ConnectedXMResponse<Content>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Content>>(
    `/contents`,
    content
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENTS_QUERY_KEY(channelId),
    });
    SET_CHANNEL_CONTENT_QUERY_DATA(
      queryClient,
      [channelId, data?.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel
 */
export const useCreateChannelContent = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannelContent>>,
      Omit<CreateChannelContentParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentParams,
    Awaited<ReturnType<typeof CreateChannelContent>>
  >(CreateChannelContent, options);
};
