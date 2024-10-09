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
 * @category Params
 * @group Activities
 */
export interface AddActivityInterestParams extends MutationParams {
  activityId: string;
  interestId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const AddActivityInterest = async ({
  activityId,
  interestId,
  adminApiParams,
  queryClient,
}: AddActivityInterestParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Activity>>(
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
