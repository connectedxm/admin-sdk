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
 * @category Params
 * @group Channel-Translation
 */
export interface UpdateChannelTranslationParams extends MutationParams {
  channelId: string;
  locale: ISupportedLocale;
  channelTranslation: ChannelTranslationUpdateInputs;
}

/**
 * @category Methods
 * @group Channel-Translation
 */
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

/**
 * @category Mutations
 * @group Channel-Translation
 */
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
