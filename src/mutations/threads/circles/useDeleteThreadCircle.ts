import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_CIRCLE_QUERY_KEY } from "@src/queries/threads/circles/useGetThreadCircle";
import { THREAD_CIRCLES_QUERY_KEY } from "@src/queries/threads/circles/useGetThreadCircles";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadCircleParams extends MutationParams {
  circleId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadCircle = async ({
  circleId,
  adminApiParams,
  queryClient,
}: DeleteThreadCircleParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/threads/circles/${circleId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_CIRCLE_QUERY_KEY(circleId),
    });
    queryClient.invalidateQueries({
      queryKey: THREAD_CIRCLES_QUERY_KEY(),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThreadCircle = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThreadCircle>>,
      Omit<DeleteThreadCircleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadCircleParams,
    Awaited<ReturnType<typeof DeleteThreadCircle>>
  >(DeleteThreadCircle, options);
};
