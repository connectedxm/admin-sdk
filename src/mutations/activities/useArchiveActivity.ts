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
export interface ArchiveActivityParams extends MutationParams {
  activityId: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const ArchiveActivity = async ({
  activityId,
  adminApiParams,
  queryClient,
}: ArchiveActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Activity>>(
    `/activities/${activityId}/archive`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACTIVITIES_QUERY_KEY(),
      exact: true,
    });
    SET_ACTIVITY_QUERY_DATA(queryClient, [activityId], {
      ...data,
      data: { ...data.data, status: ActivityStatus.archived },
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Activities
 */
export const useArchiveActivity = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ArchiveActivity>>,
      Omit<ArchiveActivityParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ArchiveActivityParams,
    Awaited<ReturnType<typeof ArchiveActivity>>
  >(ArchiveActivity, options);
};
