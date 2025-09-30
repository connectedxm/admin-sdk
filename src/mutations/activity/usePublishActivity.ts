import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACTIVITIES_QUERY_KEY, ACTIVITY_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Activities
 */
export interface PublishActivityParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const PublishActivity = async ({
  activityId,
  adminApiParams,
  queryClient,
}: PublishActivityParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<null>>(
    `/activities/${activityId}/publish`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
    queryClient.invalidateQueries({
      queryKey: ACTIVITY_QUERY_KEY(activityId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Activities
 */
export const usePublishActivity = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof PublishActivity>>,
      Omit<PublishActivityParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    PublishActivityParams,
    Awaited<ReturnType<typeof PublishActivity>>
  >(PublishActivity, options, {
    domain: "activities",
    type: "update",
  });
};
