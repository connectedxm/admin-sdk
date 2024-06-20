import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Content } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENTS_QUERY_KEY } from "@context/queries/contents/useGetContentTypeContents";
import { SET_CONTENT_TYPE_CONTENT_QUERY_DATA } from "@context/queries/contents/useGetContentTypeContent";

interface CreateContentTypeContentParams {
  content: Content;
}

export const CreateContentTypeContent = async ({
  content,
}: CreateContentTypeContentParams): Promise<ConnectedXMResponse<Content>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/contents`, content);
  return data;
};

export const useCreateContentTypeContent = (contentTypeId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<Content>(
    (content: Content) => CreateContentTypeContent({ content }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateContentTypeContent>>
      ) => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId)
        );
        SET_CONTENT_TYPE_CONTENT_QUERY_DATA(
          queryClient,
          [contentTypeId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateContentTypeContent;
