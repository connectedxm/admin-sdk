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
 * @category Params
 * @group Activities
 */
export interface RemoveActivityInterestParams extends MutationParams {
  activityId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Activities
 */
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

/**
 * @category Mutations
 * @group Activities
 */
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
