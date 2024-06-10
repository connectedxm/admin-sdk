import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation, ContentTranslation } from "@src/interfaces";
import { CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY } from "./useGetChannelContentTranslations";

export const CHANNEL_CONTENT_TRANSLATION_QUERY_KEY = (
  channelId: string,
  contentId: string,
  locale: string
) => [
  ...CHANNEL_CONTENT_TRANSLATIONS_QUERY_KEY(channelId, contentId),
  locale,
];

export const SET_CHANNEL_CONTENT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CHANNEL_CONTENT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetChannelContentTranslation>>
) => {
  client.setQueryData(
    CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetChannelContentTranslationProps {
  contentId: string;
  locale: string;
}

export const GetChannelContentTranslation = async ({
  contentId,
  locale,
}: GetChannelContentTranslationProps): Promise<
  ConnectedXMResponse<ContentTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contents/${contentId}/translations/${locale}`
  );
  return data;
};

const useGetChannelContentTranslation = (
  channelId: string,
  contentId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetChannelContentTranslation>>((
    CHANNEL_CONTENT_TRANSLATION_QUERY_KEY(
      channelId,
      contentId,
      locale
    ),
    () =>
      GetChannelContentTranslation({
        contentId,
        locale,
      }),
    {
      enabled: !!channelId && !!contentId && !!locale,
    }
  );
};

export default useGetChannelContentTranslation;
