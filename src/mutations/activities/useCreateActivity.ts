import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@interfaces";
import { ACTIVITIES_QUERY_KEY } from "@src/queries";
import { ActivityCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Activities
 * @param {string} accountId (bodyValue) The ID of the account associated with the activity
 * @param {ActivityCreateInputs} activity (bodyValue) The details of the activity to be created
 * @param {string} [imageDataUri] (bodyValue) Optional image data URI for the activity
 * @version 1.3
 */
export interface CreateActivityParams extends MutationParams {
  accountId: string;
  activity: ActivityCreateInputs;
  imageDataUri?: string;
}

export const CreateActivity = async ({
  accountId,
  activity,
  imageDataUri,
  adminApiParams,
  queryClient,
}: CreateActivityParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<null>>(
    `/activities`,
    { accountId, activity, imageUri: imageDataUri }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({ queryKey: ACTIVITIES_QUERY_KEY() });
  }

  return data;
};

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
  >(CreateActivity, options, {
    domain: "activities",
    type: "create",
  });
};
