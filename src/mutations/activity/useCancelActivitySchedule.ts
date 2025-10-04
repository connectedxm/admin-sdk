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
export interface CancelActivityScheduleParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const CancelActivitySchedule = async ({
  activityId,
  adminApiParams,
  queryClient,
}: CancelActivityScheduleParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/schedule`
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
export const useCancelActivitySchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelActivitySchedule>>,
      Omit<CancelActivityScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelActivityScheduleParams,
    Awaited<ReturnType<typeof CancelActivitySchedule>>
  >(CancelActivitySchedule, options);
};
