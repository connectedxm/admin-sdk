import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_CONTENT_TYPE_CONTENT_TRANSLATION_QUERY_DATA } from "@context/queries/contents/translations/useGetContentTypeContentTranslation";
import { CONTENT_TYPE_CONTENT_TRANSLATIONS_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeContentTranslations";
import { ContentTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateContentTypeContentTranslationProps {
  contentId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateContentTypeContentTranslation = async ({
  contentId,
  locale,
  autoTranslate,
}: CreateContentTypeContentTranslationProps): Promise<
  ConnectedXMResponse<ContentTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/contents/${contentId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateContentTypeContentTranslation = (
  contentTypeId: string,
  contentId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateContentTypeContentTranslationProps, "contentId">
  >(
    (props) => CreateContentTypeContentTranslation({ contentId, ...props }),
    {
      onSuccess: (
        response: Awaited<
          ReturnType<typeof CreateContentTypeContentTranslation>
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
    },
    "Hold on while we create a translation"
  );
};

export default useCreateContentTypeContentTranslation;
