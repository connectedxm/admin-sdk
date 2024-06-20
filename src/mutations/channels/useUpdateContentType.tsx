import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../useConnectedMutation";
import { ContentType } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { CONTENT_TYPES_QUERY_KEY } from "@context/queries/contents/useGetContentTypes";
import { SET_CONTENT_TYPE_QUERY_DATA } from "@context/queries/contents/useGetContentType";

interface UpdateContentTypeParams {
  contentTypeId: string;
  contentType: ContentType;
}

export const UpdateContentType = async ({
  contentTypeId,
  contentType,
}: UpdateContentTypeParams): Promise<ConnectedXMResponse<ContentType>> => {
  if (!contentTypeId) throw new Error("Content Type ID Undefined");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(`/contentTypes/${contentTypeId}`, {
    ...contentType,
    id: undefined,
    image: undefined,
    hosts: undefined,
    _count: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });
  return data;
};

export const useUpdateContentType = (contentTypeId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<ContentType>(
    (contentType: ContentType) =>
      UpdateContentType({
        contentTypeId: contentTypeId || contentType?.id,
        contentType,
      }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateContentType>>) => {
        queryClient.invalidateQueries(CONTENT_TYPES_QUERY_KEY());
        SET_CONTENT_TYPE_QUERY_DATA(
          queryClient,
          [contentTypeId || response.data?.id],
          response
        );
      },
    }
  );
};

export default useUpdateContentType;
