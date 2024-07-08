import { ConnectedXMResponse, Content } from "@src/interfaces";
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
export interface AddChannelContentGuestParams extends MutationParams {
  contentId: string;
  channelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Channel
 */
export const AddChannelContentGuest = async ({
  contentId,
  channelId,
  accountId,
  adminApiParams,
  queryClient,
}: AddChannelContentGuestParams): Promise<ConnectedXMResponse<Content>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Content>>(
    `/channels/${channelId}/contents/${contentId}/guests/${accountId}`
  );

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
export const useAddChannelContentGuest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddChannelContentGuest>>,
      Omit<AddChannelContentGuestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddChannelContentGuestParams,
    Awaited<ReturnType<typeof AddChannelContentGuest>>
  >(AddChannelContentGuest, options);
};
