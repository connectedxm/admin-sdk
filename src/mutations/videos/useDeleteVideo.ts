import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEOS_QUERY_KEY, VIDEO_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific video by its ID.
 * This function allows for the removal of a video from the system, ensuring that associated queries are invalidated and removed.
 * It is intended for use in applications where video management is required, providing a mechanism to delete videos securely.
 * @name DeleteVideo
 * @param {string} videoId (path) The ID of the video to be deleted
 * @version 1.3
 **/

export interface DeleteVideoParams extends MutationParams {
  videoId: string;
}

export const DeleteVideo = async ({
  videoId,
  adminApiParams,
  queryClient,
}: DeleteVideoParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/videos/${videoId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: VIDEO_QUERY_KEY(videoId) });
  }
  return data;
};

export const useDeleteVideo = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteVideo>>,
      Omit<DeleteVideoParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteVideoParams,
    Awaited<ReturnType<typeof DeleteVideo>>
  >(DeleteVideo, options, {
    domain: "storage",
    type: "del",
  });
};
