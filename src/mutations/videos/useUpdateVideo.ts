import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Video } from "@src/interfaces";
import { VIDEOS_QUERY_KEY, SET_VIDEO_QUERY_DATA } from "@src/queries";
import { VideoUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing video with new information.
 * This function allows users to modify the details of a video by providing the video ID and the updated video inputs.
 * It ensures that the video data is updated in the system and invalidates the relevant queries to maintain data consistency.
 * @name UpdateVideo
 * @param {string} videoId (path) - The ID of the video to update
 * @param {VideoUpdateInputs} video (body) - The video update inputs
 * @version 1.3
 **/
export interface UpdateVideoParams extends MutationParams {
  videoId: string;
  video: VideoUpdateInputs;
}

export const UpdateVideo = async ({
  videoId,
  video,
  adminApiParams,
  queryClient,
}: UpdateVideoParams): Promise<ConnectedXMResponse<Video>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Video>>(
    `/videos/${videoId}`,
    video
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY() });
    SET_VIDEO_QUERY_DATA(queryClient, [data?.data?.id], data);
  }
  return data;
};

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
  >(UpdateVideo, options, {
    domain: "storage",
    type: "update",
  });
};