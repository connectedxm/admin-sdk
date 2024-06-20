import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_DATA } from "@context/queries/contents/translations/useGetContentTypeContentTranslation";
import { CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeContentTranslations";
import { ContentTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface UpdateContentTypeContentTranslationProps {
  contentId: string;
  contentTranslation: ContentTranslation;
}

export const UpdateContentTypeContentTranslation = async ({
  contentId,
  contentTranslation,
}: UpdateContentTypeContentTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { locale, ...body } = contentTranslation;

  const { data } = await connectedXM.put(
    `/contents/${contentId}/translations/${contentTranslation.locale}`,
    body
  );

  return data;
};

export const useUpdateContentTypeContentTranslation = (
  contentTypeId: string,
  contentId: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation<ContentTranslation>(
    (contentTranslation: ContentTranslation) =>
      UpdateContentTypeContentTranslation({ contentId, contentTranslation }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof UpdateContentTypeContentTranslation>
        >
      ) => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(contentTypeId, contentId)
        );
        SET_CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_DATA(
          queryClient,
          [contentTypeId, contentId, response.data?.locale],
          response
        );
      },
    }
  );
};

export default useUpdateContentTypeContentTranslation;
