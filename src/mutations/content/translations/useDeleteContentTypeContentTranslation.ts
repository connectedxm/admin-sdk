import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeContentTranslation";
import { CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeContentTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteContentTypeContentTranslationProps {
  contentId: string;
  locale: string;
}

export const DeleteContentTypeContentTranslation = async ({
  contentId,
  locale,
}: DeleteContentTypeContentTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/contents/${contentId}/translations/${locale}`
  );

  return data;
};

export const useDeleteContentTypeContentTranslation = (
  contentTypeId: string,
  contentId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteContentTypeContentTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY(contentTypeId, contentId)
      );
      queryClient.invalidateQueries(
        CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_KEY(
          contentTypeId,
          contentId,
          locale
        )
      );
    },
  });
};

export default useDeleteContentTypeContentTranslation;
