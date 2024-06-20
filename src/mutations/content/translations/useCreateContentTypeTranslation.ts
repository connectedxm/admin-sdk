import ConnectedXM, { ConnectedXMResponse } from "@context/api/ConnectedXM";
import useConnectedMutation from "@context/mutations/useConnectedMutation";
import { SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA } from "@context/queries/contents/translations/useGetContentTypeTranslation";
import { CONTENT_TYPE_TRANSLATIONS_QUERY_KEY } from "@context/queries/contents/translations/useGetContentTypeTranslations";
import { ContentTypeTranslation } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";

interface CreateContentTypeTranslationProps {
  contentTypeId: string;
  locale: string;
  autoTranslate?: boolean;
}

export const CreateContentTypeTranslation = async ({
  contentTypeId,
  locale,
  autoTranslate,
}: CreateContentTypeTranslationProps): Promise<
  ConnectedXMResponse<ContentTypeTranslation>
> => {
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.post(
    `/contentTypes/${contentTypeId}/translations`,
    {
      locale,
      autoTranslate,
    }
  );

  return data;
};

export const useCreateContentTypeTranslation = (contentTypeId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<
    Omit<CreateContentTypeTranslationProps, "contentTypeId">
  >(
    (props) => CreateContentTypeTranslation({ contentTypeId, ...props }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateContentTypeTranslation>>
      ) => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_TRANSLATIONS_QUERY_KEY(contentTypeId)
        );
        SET_CONTENT_TYPE_TRANSLATION_QUERY_DATA(
          queryClient,
          [contentTypeId, response.data.locale],
          response
        );
      },
    },
    "Hold on while we create a translation"
  );
};

export default useCreateContentTypeTranslation;
