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
 * @category Params
 * @group Activities
 */
export interface UpdateActivityParams extends MutationParams {
  activityId: string;
  activity: ActivityUpdateInputs;
}

/**
 * @category Methods
 * @group Activities
 */
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

/**
 * @category Mutations
 * @group Activities
 */
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
