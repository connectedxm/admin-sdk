import { GetAdminAPI } from "@src/AdminAPI";
import {
  ChannelTranslation,
  ConnectedXMResponse,
  ISupportedLocale,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ChannelTranslationUpdateInputs } from "@src/params";
import {
  CHANNEL_TRANSLATION_QUERY_KEY,
  SET_CHANNEL_TRANSLATION_QUERY_DATA,
} from "@src/queries/channels";

/**
 * Updates the translation for a specific channel in a given locale.
 * This function allows for updating the translation details of a channel, 
 * which is useful for maintaining multilingual support within the application.
 * It ensures that the channel's translation is updated in the backend and 
 * invalidates the relevant queries to keep the client-side data in sync.
 * @name UpdateChannelTranslation
 * @param {string} channelId (path) - The ID of the channel
 * @param {ISupportedLocale} locale (path) - The locale for which the translation is being updated
 * @param {ChannelTranslationUpdateInputs} channelTranslation (body) - The translation details to update
 * @version 1.3
 **/

export interface UpdateChannelTranslationParams extends MutationParams {
  channelId: string;
  locale: ISupportedLocale;
  channelTranslation: ChannelTranslationUpdateInputs;
}

export const UpdateChannelTranslation = async ({
  channelId,
  channelTranslation,
  locale,
  adminApiParams,
  queryClient,
}: UpdateChannelTranslationParams): Promise<
  ConnectedXMResponse<ChannelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<ChannelTranslation>>(
    `/channels/${channelId}/translations/${locale}`,
    channelTranslation
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: CHANNEL_TRANSLATION_QUERY_KEY(channelId, data?.data.locale),
    });
    SET_CHANNEL_TRANSLATION_QUERY_DATA(
      queryClient,
      [channelId, data?.data.id],
      data
    );
  }

  return data;
};

export const useUpdateChannelTranslation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateChannelTranslation>>,
      Omit<UpdateChannelTranslationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateChannelTranslationParams,
    Awaited<ReturnType<typeof UpdateChannelTranslation>>
  >(UpdateChannelTranslation, options, {
    domain: "channels",
    type: "update",
  });
};