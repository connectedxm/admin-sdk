import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, ChannelTranslation } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_TRANSLATION_QUERY_KEY,
  SET_CHANNEL_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel-Translation
 */
export interface CreateChannelTranslationParams extends MutationParams {
  channelId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const CreateChannelTranslation = async ({
  channelId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateChannelTranslationParams): Promise<
  ConnectedXMResponse<ChannelTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<ChannelTranslation>
  >(`/channels/${channelId}/translations`, {
    locale,
    autoTranslate,
  });
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATION_QUERY_KEY(channelId, data?.data.locale),
    });
    SET_CHANNEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [channelId, data?.data.locale],
      data
    );
  }

  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useCreateChannelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannelTranslation>>,
      Omit<CreateChannelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelTranslationParams,
    Awaited<ReturnType<typeof CreateChannelTranslation>>
  >(CreateChannelTranslation, options);
};
