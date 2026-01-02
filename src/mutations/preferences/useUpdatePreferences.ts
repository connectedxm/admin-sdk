import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import {
  AdminNotificationPreferences,
  ConnectedXMResponse,
} from "@src/interfaces";
import { SET_PREFERENCES_QUERY_DATA } from "@src/queries";
import { AdminNotificationPreferencesUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Preferences
 */
export interface UpdatePreferencesParams extends MutationParams {
  preferences: AdminNotificationPreferencesUpdateInputs;
}

/**
 * @category Methods
 * @group Preferences
 */
export const UpdatePreferences = async ({
  preferences,
  adminApiParams,
  queryClient,
}: UpdatePreferencesParams): Promise<
  ConnectedXMResponse<AdminNotificationPreferences>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<AdminNotificationPreferences>
  >(`/preferences`, preferences);
  if (queryClient && data.status === "ok") {
    SET_PREFERENCES_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Preferences
 */
export const useUpdatePreferences = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdatePreferences>>,
      Omit<UpdatePreferencesParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdatePreferencesParams,
    Awaited<ReturnType<typeof UpdatePreferences>>
  >(UpdatePreferences, options);
};
