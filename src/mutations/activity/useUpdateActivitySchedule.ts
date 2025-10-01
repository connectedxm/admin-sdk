import { Activity, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACTIVITIES_QUERY_KEY, SET_ACTIVITY_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Activities
 */
export interface UpdateActivityScheduleParams extends MutationParams {
  activityId: string;
  schedule: {
    date: string;
  };
}

/**
 * @category Methods
 * @group Activities
 */
export const UpdateActivitySchedule = async ({
  activityId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateActivityScheduleParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/schedule`,
    schedule
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
export const useUpdateActivitySchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateActivitySchedule>>,
      Omit<UpdateActivityScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateActivityScheduleParams,
    Awaited<ReturnType<typeof UpdateActivitySchedule>>
  >(UpdateActivitySchedule, options, {
    domain: "activities",
    type: "update",
  });
};
