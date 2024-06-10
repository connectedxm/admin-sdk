import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation, ContentTranslation } from "@src/interfaces";
import { CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY } from "./useGetContentTypeContentTranslations";

export const CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_KEY = (
  contentTypeId: string,
  contentId: string,
  locale: string
) => [
  ...CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(contentTypeId, contentId),
  locale,
];

export const SET_CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeContentTranslation>>
) => {
  client.setQueryData(
    CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeContentTranslationProps {
  contentId: string;
  locale: string;
}

export const GetContentTypeContentTranslation = async ({
  contentId,
  locale,
}: GetContentTypeContentTranslationProps): Promise<
  ConnectedXMResponse<ContentTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contents/${contentId}/translations/${locale}`
  );
  return data;
};

const useGetContentTypeContentTranslation = (
  contentTypeId: string,
  contentId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentTypeContentTranslation>>((
    CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_KEY(
      contentTypeId,
      contentId,
      locale
    ),
    () =>
      GetContentTypeContentTranslation({
        contentId,
        locale,
      }),
    {
      enabled: !!contentTypeId && !!contentId && !!locale,
    }
  );
};

export default useGetContentTypeContentTranslation;
