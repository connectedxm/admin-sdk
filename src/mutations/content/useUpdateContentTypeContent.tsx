import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Content } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENTS_QUERY_KEY } from "@context/queries/contents/useGetContentTypeContents";
import { SET_CONTENT_TYPE_CONTENT_QUERY_DATA } from "@context/queries/contents/useGetContentTypeContent";

interface UpdateContentTypeContentParams {
  contentId: string;
  content: Content;
}

export const UpdateContentTypeContent = async ({
  contentId,
  content,
}: UpdateContentTypeContentParams): Promise<ConnectedXMResponse<Content>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/contents/${contentId}`, content);
  return data;
};

export const useUpdateContentTypeContent = (
  contentTypeId: string,
  contentId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Content>(
    (content: Content) => UpdateContentTypeContent({ contentId, content }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateContentTypeContent>>
      ) => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId)
        );
        SET_CONTENT_TYPE_CONTENT_QUERY_DATA(
          queryClient,
          [contentTypeId, contentId],
          response
        );
      },
    }
  );
};

export default useUpdateContentTypeContent;
