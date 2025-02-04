import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";

import { Activity, ConnectedXMResponse } from "@interfaces";

import { GetAdminAPI } from "@src/AdminAPI";
import {
  SET_ACTIVITY_QUERY_DATA,
  ACTIVITY_INTERESTS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to remove an interest from a specific activity.
 * This function allows the removal of a specified interest from an activity by providing the activity and interest IDs.
 * It is designed to be used in applications where managing activity interests is required.
 * @name RemoveActivityInterest
 * @param {string} activityId - The id of the activity
 * @param {string} interestId - The id of the interest
 * @version 1.2
 **/
export interface RemoveActivityInterestParams extends MutationParams {
  activityId: string;
  interestId: string;
}

export const RemoveActivityInterest = async ({
  activityId,
  interestId,
  adminApiParams,
  queryClient,
}: RemoveActivityInterestParams): Promise<ConnectedXMResponse<Activity>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete(
    `/activities/${activityId}/interests/${interestId}`
  );
  if (queryClient && data.status === "ok") {
    SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], data);
    queryClient.invalidateQueries({
      queryKey: ACTIVITY_INTERESTS_QUERY_KEY(activityId),
    });
  }

  return data;
};

export const useRemoveActivityInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveActivityInterest>>,
      Omit<RemoveActivityInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveActivityInterestParams,
    Awaited<ReturnType<typeof RemoveActivityInterest>>
  >(RemoveActivityInterest, options, {
    domain: "activities",
    type: "update",
  });
};