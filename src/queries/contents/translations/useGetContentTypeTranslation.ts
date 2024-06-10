import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation, ChannelTranslation } from "@src/interfaces";
import { CHANNEL_TRANSLATIONS_QUERY_KEY } from "./useGetChannelTranslations";

export const CHANNEL_TRANSLATION_QUERY_KEY = (
  channelId: string,
  locale: string
) => [...CHANNEL_TRANSLATIONS_QUERY_KEY(channelId), locale];

export const SET_CHANNEL_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelTranslation>>
) => {
  client.setQueryData(
    CHANNEL_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelTranslationProps {
  channelId: string;
  locale: string;
}

export const GetChannelTranslation = async ({
  channelId,
  locale,
}: GetChannelTranslationProps): Promise<
  ConnectedXMResponse<ChannelTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/channels/${channelId}/translations/${locale}`
  );
  return data;
};

const useGetChannelTranslation = (
  channelId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelTranslation>>((
    CHANNEL_TRANSLATION_QUERY_KEY(channelId, locale),
    () =>
      GetChannelTranslation({
        channelId,
        locale,
      }),
    {
      enabled: !!channelId && !!locale,
    }
  );
};

export default useGetChannelTranslation;
