import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  ChannelContentTranslation,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  CHANNEL_CONTENT_TRANSLATION_QUERY_KEY,
  SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

/**
 * @category Params
 * @group Channel-Translation
 */
export interface CreateChannelContentTranslationParams extends MutationParams {
  channelId: string;
  contentId: string;
  locale: string;
  autoTranslate?: boolean;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
export const CreateChannelContentTranslation = async ({
  channelId,
  contentId,
  locale,
  autoTranslate,
  adminApiParams,
  queryClient,
}: CreateChannelContentTranslationParams): Promise<
  ConnectedXMResponse<ChannelContentTranslation>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<
    ConnectedXMResponse<ChannelContentTranslation>
  >(`/channels/${channelId}/contents/${contentId}/translations`, {
    locale,
    autoTranslate,
  });

  if (queryClient && data.status === "ok") {
    //BOTH OF THESE FUNCTIONS ARE NOT DEFINED
    queryClient.invalidateQueries({
      queryKey: CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(
        channelId,
        contentId,
        data?.data.locale
      ),
    });
    SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA(
      queryClient,
      [channelId, contentId, data?.data.locale],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Channel-Translation
 */
export const useCreateChannelContentTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateChannelContentTranslation>>,
      Omit<
        CreateChannelContentTranslationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateChannelContentTranslationParams,
    Awaited<ReturnType<typeof CreateChannelContentTranslation>>
  >(CreateChannelContentTranslation, options);
};
