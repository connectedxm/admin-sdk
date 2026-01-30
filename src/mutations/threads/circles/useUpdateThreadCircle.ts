import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, ThreadCircle } from "@src/interfaces";
import { ThreadCircleUpdateInputs } from "@src/params";
import { THREAD_CIRCLE_QUERY_KEY } from "@src/queries/threads/circles/useGetThreadCircle";
import { THREAD_CIRCLES_QUERY_KEY } from "@src/queries/threads/circles/useGetThreadCircles";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadCircleParams extends MutationParams {
  circleId: string;
  circle: ThreadCircleUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadCircle = async ({
  circleId,
  circle,
  adminApiParams,
  queryClient,
}: UpdateThreadCircleParams): Promise<ConnectedXMResponse<ThreadCircle>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<ThreadCircle>>(
    `/threads/circles/${circleId}`,
    circle
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
export const useUpdateThreadCircle = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateThreadCircle>>,
      Omit<UpdateThreadCircleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadCircleParams,
    Awaited<ReturnType<typeof UpdateThreadCircle>>
  >(UpdateThreadCircle, options);
};
