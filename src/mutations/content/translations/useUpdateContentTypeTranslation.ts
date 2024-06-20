import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA } from "@context/queries/contents/translations/useGetContentTypeTranslation";
import { CONTENT_TYPE_TRANSLATIONS_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeTranslations";
import { ContentTypeTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateContentTypeTranslationProps {
  contentTypeId: string;
  contentTypeTranslation: ContentTypeTranslation;
}

export const UpdateContentTypeTranslation = async ({
  contentTypeId,
  contentTypeTranslation,
}: UpdateContentTypeTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = contentTypeTranslation;

  const { data } = await connectedXM.put(
    `/contentTypes/${contentTypeId}/translations/${contentTypeTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateContentTypeTranslation = (contentTypeId: string) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<ContentTypeTranslation>(
    (contentTypeTranslation: ContentTypeTranslation) =>
      UpdateContentTypeTranslation({ contentTypeId, contentTypeTranslation }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateContentTypeTranslation>>
      ) => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId)
        );
        SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA(
          queryClient,
          [contentTypeId, response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateContentTypeTranslation;
