import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@interfaces";
import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Activities
 */
export interface DeleteActivityParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const DeleteActivity = async ({
  activityId,
  adminApiParams,
  queryClient,
}: DeleteActivityParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/activities/${activityId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: ACTIVITY_QUERY_KEY(activityId) });
  }
  return data;
};

/**
 * @category Mutations
 * @group Activities
 */
export const useDeleteActivity = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteActivity>>,
      Omit<DeleteActivityParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteActivityParams,
    Awaited<ReturnType<typeof DeleteActivity>>
  >(DeleteActivity, options);
};
