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
 * Creates a new translation for channel content in a specified locale.
 * This function allows for the creation of a translation for a specific piece of content within a channel,
 * optionally using automatic translation. It is designed to be used in applications that manage multilingual content.
 * @name PostChannelContentTranslation
 * @param {string} channelId - The ID of the channel
 * @param {string} contentId - The ID of the content
 * @param {string} locale - The locale for the translation
 * @param {boolean} [autoTranslate] - Whether to use automatic translation
 * @version 1.2
 **/

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
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<
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
  >(CreateChannelContentTranslation, options, {
    domain: "channels",
    type: "update",
  });
};
