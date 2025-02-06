import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEOS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete multiple videos from the storage system.
 * This function allows users to remove several videos at once by providing their IDs.
 * It is designed for applications that require batch deletion of video content.
 * @name DeleteManyVideos
 * @param {string[]} videoIds (bodyValue) - The IDs of the videos to be deleted
 * @version 1.3
 **/

export interface DeleteManyVideosParams extends MutationParams {
  videoIds: string[];
}

export const DeleteManyVideos = async ({
  videoIds,
  adminApiParams,
  queryClient,
}: DeleteManyVideosParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<null>>(
    `/videos/delete`,
    { videoIds }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY("") });
  }
  return data;
};

export const useDeleteManyVideos = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteManyVideos>>,
      Omit<DeleteManyVideosParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteManyVideosParams,
    Awaited<ReturnType<typeof DeleteManyVideos>>
  >(DeleteManyVideos, options, {
    domain: "storage",
    type: "del",
  });
};