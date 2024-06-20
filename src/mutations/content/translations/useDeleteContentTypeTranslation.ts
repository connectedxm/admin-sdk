import ConnectedXM from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { CONTENT_TYPE_TRANSLATION_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeTranslation";
import { CONTENT_TYPE_TRANSLATIONS_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeTranslations";
import { useQueryClient } from "@tanstack/react-query";

interface DeleteContentTypeTranslationProps {
  contentTypeId: string;
  locale: string;
}

export const DeleteContentTypeTranslation = async ({
  contentTypeId,
  locale,
}: DeleteContentTypeTranslationProps) => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.delete(
    `/contentTypes/${contentTypeId}/translations/${locale}`
  );

  return data;
};

export const useDeleteContentTypeTranslation = (
  contentTypeId: string,
  locale: string
) => {
  const queryClient = useQueryClient();
  return useConnectedMutation(DeleteContentTypeTranslation, {
    onSuccess: () => {
      queryClient.invalidateQueries(
        CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId)
      );
      queryClient.invalidateQueries(
        CONTENT_TYPE_TRANSLATION_QUERY_KEY(contentTypeId, locale)
      );
    },
  });
};

export default useDeleteContentTypeTranslation;
