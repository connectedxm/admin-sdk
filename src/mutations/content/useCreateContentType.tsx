import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { ContentType } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENT_TYPES_QUERY_KEY } from "@queries/contents/useGetContentTypes";
import { SET_CONTENT_TYPE_QUERY_DATA } from "@context/queries/contents/useGetContentType";

interface CreateContentTypeParams {
  contentType: ContentType;
}

export const CreateContentType = async ({
  contentType,
}: CreateContentTypeParams): Promise<ConnectedXMResponse<ContentType>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(`/contentTypes`, contentType);
  return data;
};

export const useCreateContentType = () => {
  const queryClient = useQueryClient();

  return useConnectedMutation<ContentType>(
    (contentType: ContentType) => CreateContentType({ contentType }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateContentType>>) => {
        queryClient.invalidateQueries(CONTENT_TYPES_QUERY_KEY());
        SET_CONTENT_TYPE_QUERY_DATA(queryClient, [response.data.id], response);
      },
    }
  );
};

export default useCreateContentType;
