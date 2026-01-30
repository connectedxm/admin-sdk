import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";

/**
 * @category Params
 * @group Notifications
 */
export interface MarkNotificationsReadParams extends MutationParams {
  notificationIds: string[];
}

/**
 * @category Methods
 * @group Notifications
 */
export const MarkNotificationsRead = async ({
  notificationIds,
  adminApiParams,
  queryClient,
}: MarkNotificationsReadParams): Promise<
  ConnectedXMResponse<{ count: number }>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<{ count: number }>
  >(`/notifications/read`, { notificationIds });

  if (queryClient && data.status === "ok") {
    // Invalidate notifications queries
    queryClient.invalidateQueries({ queryKey: ["NOTIFICATIONS"] });
  }

  return data;
};

/**
 * @category Mutations
 * @group Notifications
 */
export const useMarkNotificationsRead = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof MarkNotificationsRead>>,
      Omit<MarkNotificationsReadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    MarkNotificationsReadParams,
    Awaited<ReturnType<typeof MarkNotificationsRead>>
  >(MarkNotificationsRead, options);
};
