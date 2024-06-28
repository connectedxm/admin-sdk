import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { VIDEOS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Videos
 */
export interface DeleteManyVideosParams extends MutationParams {
  videoIds: string[];
}

/**
 * @category Methods
 * @group Videos
 */
export const DeleteManyVideos = async ({
  videoIds,
  adminApiParams,
  queryClient,
}: DeleteManyVideosParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/videos/delete`,
    { videoIds }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: VIDEOS_QUERY_KEY("") });
  }
  return data;
};

/**
 * @category Mutations
 * @group Videos
 */
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
  >(DeleteManyVideos, options);
};
