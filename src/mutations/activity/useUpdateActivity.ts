import { Activity, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACTIVITIES_QUERY_KEY, SET_ACTIVITY_QUERY_DATA } from "@src/queries";
import { ActivityUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing activity with new data.
 * This function allows users to modify the details of a specific activity by providing the activity ID and the updated data.
 * It ensures that the activity information is current and accurate within the system.
 * @name UpdateActivity
 * @param {string} activityId - The ID of the activity to update
 * @param {ActivityUpdateInputs} activity - The updated activity data
 * @version 1.2
 **/

export interface UpdateActivityParams extends MutationParams {
  activityId: string;
  activity: ActivityUpdateInputs;
}

export const UpdateActivity = async ({
  activityId,
  activity,
  adminApiParams,
  queryClient,
}: UpdateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}`,
    activity
  );
  if (queryClient && data.status === "ok") {
    SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], data);
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
  }

  return data;
};

export const useUpdateActivity = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateActivity>>,
      Omit<UpdateActivityParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateActivityParams,
    Awaited<ReturnType<typeof UpdateActivity>>
  >(UpdateActivity, options, {
    domain: "activities",
    type: "update",
  });
};