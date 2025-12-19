import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { OrganizationMembership, ConnectedXMResponse } from "@src/interfaces";
import { SET_SELF_NOTIFICATION_PREFERENCES_QUERY_DATA } from "@src/queries";
import { AdminNotificationPreferencesUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Self
 */
export interface UpdateSelfNotificationPreferencesParams
  extends MutationParams {
  preferences: AdminNotificationPreferencesUpdateInputs;
}

/**
 * @category Methods
 * @group Self
 */
export const UpdateSelfNotificationPreferences = async ({
  preferences,
  adminApiParams,
  queryClient,
}: UpdateSelfNotificationPreferencesParams): Promise<
  ConnectedXMResponse<OrganizationMembership>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<OrganizationMembership>
  >(`/self/notification-preferences`, preferences);
  if (queryClient && data.status === "ok") {
    SET_SELF_NOTIFICATION_PREFERENCES_QUERY_DATA(queryClient, [], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Self
 */
export const useUpdateSelfNotificationPreferences = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateSelfNotificationPreferences>>,
      Omit<
        UpdateSelfNotificationPreferencesParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateSelfNotificationPreferencesParams,
    Awaited<ReturnType<typeof UpdateSelfNotificationPreferences>>
  >(UpdateSelfNotificationPreferences, options);
};
