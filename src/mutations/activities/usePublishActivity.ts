import { ActivityStatus, ConnectedXMResponse, Activity } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACTIVITIES_QUERY_KEY, SET_ACTIVITY_QUERY_DATA } from "@src/queries";

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
}: PublishActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/publish`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACTIVITIES_QUERY_KEY(),
      exact: true,
    });
    SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], {
      ...data,
      data: { ...data.data, status: ActivityStatus.published },
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
  >(PublishActivity, options);
};
