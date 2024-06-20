import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { ContentType } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { CONTENT_TYPES_QUERY_KEY } from "@context/queries/contents/useGetContentTypes";
import { CONTENT_TYPE_QUERY_KEY } from "@context/queries/contents/useGetContentType";

interface DeleteContentTypeParams {
  contentTypeId: string;
}

export const DeleteContentType = async ({
  contentTypeId,
}: DeleteContentTypeParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(`/contentTypes/${contentTypeId}`);
  return data;
};

export const useDeleteContentType = (contentTypeId: string) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useConnectedMutation<ContentType>(
    () => DeleteContentType({ contentTypeId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteContentType>>
      ) => {
        await router.push("/content");
        queryClient.invalidateQueries(CONTENT_TYPES_QUERY_KEY());
        queryClient.removeQueries(CONTENT_TYPE_QUERY_KEY(contentTypeId));
      },
    }
  );
};

export default useDeleteContentType;
