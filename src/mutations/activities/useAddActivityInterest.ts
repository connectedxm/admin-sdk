import { ConnectedXMResponse } from "@interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Activity } from "@interfaces";

import { GetAdminAPI } from "@src/AdminAPI";
import {
  ACTIVITY_INTERESTS_QUERY_KEY,
  SET_ACTIVITY_QUERY_DATA,
} from "@src/queries";

/**
 * Adds an interest to a specific activity and updates the query client.
 * This function allows users to associate an interest with a given activity,
 * ensuring that the query client is updated to reflect this change.
 * It is useful in scenarios where activities need to be dynamically linked with interests.
 * @name AddActivityInterest
 * @param {string} activityId (path) The id of the activity
 * @param {string} interestId (path) The id of the interest
 * @version 1.3
 **/
export interface AddActivityInterestParams extends MutationParams {
  activityId: string;
  interestId: string;
}

export const AddActivityInterest = async ({
  activityId,
  interestId,
  adminApiParams,
  queryClient,
}: AddActivityInterestParams): Promise<ConnectedXMResponse<Activity>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Activity>>(
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

export const useAddActivityInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddActivityInterest>>,
      Omit<AddActivityInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddActivityInterestParams,
    Awaited<ReturnType<typeof AddActivityInterest>>
  >(AddActivityInterest, options, {
    domain: "activities",
    type: "update",
  });
};
