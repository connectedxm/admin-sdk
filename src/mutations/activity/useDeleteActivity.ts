import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@interfaces";
import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a specific activity by its ID.
 * This function allows for the removal of an activity from the system, ensuring that all related queries are invalidated or removed.
 * It is designed to be used in applications where activity management is required, providing a way to maintain up-to-date data.
 * @name DeleteActivity
 * @param {string} activityId (path) - The ID of the activity to be deleted
 * @version 1.3
 **/
export interface DeleteActivityParams extends MutationParams {
  activityId: string;
}

export const DeleteActivity = async ({
  activityId,
  adminApiParams,
  queryClient,
}: DeleteActivityParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/activities/${activityId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
    queryClient.removeQueries({ queryKey: ACTIVITY_QUERY_KEY(activityId) });
  }
  return data;
};

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
  >(DeleteActivity, options, {
    domain: "activities",
    type: "del",
  });
};