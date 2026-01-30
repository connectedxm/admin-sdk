import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEO_CAPTIONS_QUERY_KEY } from "@src/queries/videos/captions/useGetVideoCaptions";

/**
 * @category Params
 * @group Videos
 */
export interface DeleteVideoCaptionParams extends MutationParams {
  videoId: string;
  language: string;
}

/**
 * @category Methods
 * @group Videos
 */
export const DeleteVideoCaption = async ({
  videoId,
  language,
  adminApiParams,
  queryClient,
}: DeleteVideoCaptionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/videos/${videoId}/captions/${language}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: VIDEO_CAPTIONS_QUERY_KEY(videoId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Videos
 */
export const useDeleteVideoCaption = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteVideoCaption>>,
      Omit<DeleteVideoCaptionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteVideoCaptionParams,
    Awaited<ReturnType<typeof DeleteVideoCaption>>
  >(DeleteVideoCaption, options);
};
