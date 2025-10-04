import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { Activity, ConnectedXMResponse } from "@interfaces";
import { ACTIVITIES_QUERY_KEY } from "@src/queries";
import { ActivityCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Activities
 */
export interface CreateActivityParams extends MutationParams {
  accountId: string;
  activity: ActivityCreateInputs;
  imageDataUri?: string;
}

/**
 * @category Methods
 * @group Activities
 */
export const CreateActivity = async ({
  accountId,
  activity,
  imageDataUri,
  adminApiParams,
  queryClient,
}: CreateActivityParams): Promise<ConnectedXMResponse<Activity>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Activity>>(
    `/activities`,
    { accountId, activity, imageUri: imageDataUri }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
  }

  return data;
};

/**
 * @category Mutations
 * @group Activities
 */
export const useCreateActivity = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateActivity>>,
      Omit<CreateActivityParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateActivityParams,
    Awaited<ReturnType<typeof CreateActivity>>
  >(CreateActivity, options);
};
