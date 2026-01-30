import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_WEBHOOKS_QUERY_KEY } from "@src/queries/organization/webhooks/useGetOrganizationWebhooks";
import { ORGANIZATION_WEBHOOK_QUERY_KEY } from "@src/queries/organization/webhooks/useGetOrganizationWebhook";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteOrganizationWebhookParams extends MutationParams {
  webhookId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteOrganizationWebhook = async ({
  webhookId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationWebhookParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/webhooks/${webhookId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_WEBHOOKS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: ORGANIZATION_WEBHOOK_QUERY_KEY(webhookId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteOrganizationWebhook = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationWebhook>>,
      Omit<DeleteOrganizationWebhookParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationWebhookParams,
    Awaited<ReturnType<typeof DeleteOrganizationWebhook>>
  >(DeleteOrganizationWebhook, options);
};
