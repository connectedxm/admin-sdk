import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, Video } from "@src/interfaces";
import { VIDEOS_QUERY_KEY, SET_VIDEO_QUERY_DATA } from "@src/queries";
import { VideoUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Videos
 */
export interface UpdateVideoParams extends MutationParams {
  videoId: string;
  video: VideoUpdateInputs;
}

/**
 * @category Methods
 * @group Videos
 */
export const UpdateVideo = async ({
  videoId,
  video,
  adminApiParams,
  queryClient,
}: UpdateVideoParams): Promise<ConnectedXMResponse<Video>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Video>>(
    `/videos/${videoId}`,
    video
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY() });
    SET_VIDEO_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Videos
 */
export const useUpdateVideo = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateVideo>>,
      Omit<UpdateVideoParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateVideoParams,
    Awaited<ReturnType<typeof UpdateVideo>>
  >(UpdateVideo, options);
};
