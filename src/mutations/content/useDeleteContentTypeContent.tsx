import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Content } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { CONTENT_TYPE_CONTENTS_QUERY_KEY } from "@context/queries/contents/useGetContentTypeContents";
import { CONTENT_TYPE_CONTENT_QUERY_KEY } from "@context/queries/contents/useGetContentTypeContent";

interface DeleteContentTypeContentParams {
  contentId: string;
}

export const DeleteContentTypeContent = async ({
  contentId,
}: DeleteContentTypeContentParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/contents/${contentId}`);
  return data;
};

export const useDeleteContentTypeContent = (
  contentTypeId: string,
  contentId: string
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useConnectedMutation<Content>(
    () => DeleteContentTypeContent({ contentId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteContentTypeContent>>
      ) => {
        await router.push(`/content/${contentTypeId}/contents`);
        queryClient.invalidateQueries(
          CONTENT_TYPE_CONTENTS_QUERY_KEY(contentTypeId)
        );
        queryClient.removeQueries(
          CONTENT_TYPE_CONTENT_QUERY_KEY(contentTypeId, contentId)
        );
      },
    }
  );
};

export default useDeleteContentTypeContent;
