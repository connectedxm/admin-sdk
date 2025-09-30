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
}: ArchiveActivityParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<null>>(
    `/activities/${activityId}/archive`
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
  >(ArchiveActivity, options, {
    domain: "activities",
    type: "update",
  });
};
