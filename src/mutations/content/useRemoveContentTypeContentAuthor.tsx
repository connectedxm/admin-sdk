import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Content } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY } from "@context/queries/contents/useGetContentTypeContentAuthors";

interface RemoveContentTypeContentAuthorParams {
  contentId: string;
  accountId: string;
}

export const RemoveContentTypeContentAuthor = async ({
  contentId,
  accountId,
}: RemoveContentTypeContentAuthorParams): Promise<
  ConnectedXMResponse<Content>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/contents/${contentId}/authors/${accountId}`
  );
  return data;
};

export const useRemoveContentTypeContentAuthor = (
  contentTypeId: string,
  contentId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (accountId: string) =>
      RemoveContentTypeContentAuthor({ contentId, accountId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY(contentTypeId, contentId)
        );
      },
    },
    undefined,
    true
  );
};

export default useRemoveContentTypeContentAuthor;
