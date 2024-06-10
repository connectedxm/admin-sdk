import useConnectedSingleQuery from "@/context/queries/useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { GroupTranslation, ContentTypeTranslation } from "@src/interfaces";
import { CONTENT_TYPE_TRANSLATIONS_QUERY_KEY } from "./useGetContentTypeTranslations";

export const CONTENT_TYPE_TRANSLATION_QUERY_KEY = (
  contentTypeId: string,
  locale: string
) => [...CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId), locale];

export const SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof CONTENT_TYPE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContentTypeTranslation>>
) => {
  client.setQueryData(
    CONTENT_TYPE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetContentTypeTranslationProps {
  contentTypeId: string;
  locale: string;
}

export const GetContentTypeTranslation = async ({
  contentTypeId,
  locale,
}: GetContentTypeTranslationProps): Promise<
  ConnectedXMResponse<ContentTypeTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/contentTypes/${contentTypeId}/translations/${locale}`
  );
  return data;
};

const useGetContentTypeTranslation = (
  contentTypeId: string,
  locale: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetContentTypeTranslation>>((
    CONTENT_TYPE_TRANSLATION_QUERY_KEY(contentTypeId, locale),
    () =>
      GetContentTypeTranslation({
        contentTypeId,
        locale,
      }),
    {
      enabled: !!contentTypeId && !!locale,
    }
  );
};

export default useGetContentTypeTranslation;
