import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEOS_QUERY_KEY, VIDEO_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Videos
 */
export interface DeleteVideoParams extends MutationParams {
  videoId: string;
}

/**
 * @category Methods
 * @group Videos
 */
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

/**
 * @category Mutations
 * @group Videos
 */
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
