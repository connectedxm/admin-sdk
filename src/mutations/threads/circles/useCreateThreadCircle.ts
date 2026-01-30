import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse, ThreadCircle } from "@src/interfaces";
import { ThreadCircleCreateInputs } from "@src/params";
import { THREAD_CIRCLES_QUERY_KEY } from "@src/queries/threads/circles/useGetThreadCircles";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadCircleParams extends MutationParams {
  circle: ThreadCircleCreateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadCircle = async ({
  circle,
  adminApiParams,
  queryClient,
}: CreateThreadCircleParams): Promise<ConnectedXMResponse<ThreadCircle>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadCircle>>(
    `/threads/circles`,
    circle
  );
  if (queryClient && data.status === "ok") {
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
export const useCreateThreadCircle = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadCircle>>,
      Omit<CreateThreadCircleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadCircleParams,
    Awaited<ReturnType<typeof CreateThreadCircle>>
  >(CreateThreadCircle, options);
};
