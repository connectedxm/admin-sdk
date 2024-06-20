import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { Content } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY } from "@context/queries/contents/useGetContentTypeContentAuthors";

interface AddContentTypeContentAuthorParams {
  contentId: string;
  accountId: string;
}

export const AddContentTypeContentAuthor = async ({
  contentId,
  accountId,
}: AddContentTypeContentAuthorParams): Promise<
  ConnectedXMResponse<Content>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/contents/${contentId}/authors/${accountId}`
  );
  return data;
};

export const useAddContentTypeContentAuthor = (
  contentTypeId: string,
  contentId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    (accountId: string) =>
      AddContentTypeContentAuthor({ contentId, accountId }),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(
          CONTENT_TYPE_CONTENT_AUTHORS_QUERY_KEY(contentTypeId, contentId)
        );
      },
    }
  );
};

export default useAddContentTypeContentAuthor;
