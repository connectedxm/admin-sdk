import { ConnectedXMResponse, Content } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { CHANNEL_CONTENT_AUTHORS_QUERY_KEY } from "@src/queries/channels";

/**
 * @category Params
 * @group Channel
 */
export interface AddChannelContentAuthorParams extends MutationParams {
  contentId: string;
  channelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const AddChannelContentAuthor = async ({
  contentId,
  channelId,
  accountId,
  adminApiParams,
  queryClient,
}: AddChannelContentAuthorParams): Promise<ConnectedXMResponse<Content>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Content>>(
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
export const useAddChannelContentAuthor = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddChannelContentAuthor>>,
      Omit<AddChannelContentAuthorParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddChannelContentAuthorParams,
    Awaited<ReturnType<typeof AddChannelContentAuthor>>
  >(AddChannelContentAuthor, options);
};
