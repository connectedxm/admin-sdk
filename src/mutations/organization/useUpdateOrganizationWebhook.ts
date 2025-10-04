import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Webhook, ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_WEBHOOKS_QUERY_KEY } from "@src/queries/organization/useGetOrganizationWebhooks";
import { SET_ORGANIZATION_WEBHOOK_QUERY_DATA } from "@src/queries/organization/useGetOrganizationWebhook";
import { WebhookUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateOrganizationWebhookParams extends MutationParams {
  webhookId: string;
  webhook: WebhookUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateOrganizationWebhook = async ({
  webhookId,
  webhook,
  adminApiParams,
  queryClient,
}: UpdateOrganizationWebhookParams): Promise<ConnectedXMResponse<Webhook>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Webhook>>(
    `/organization/webhooks/${webhookId}`,
    webhook
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_WEBHOOKS_QUERY_KEY(),
    });
    SET_ORGANIZATION_WEBHOOK_QUERY_DATA(queryClient, [webhookId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateOrganizationWebhook = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationWebhook>>,
      Omit<UpdateOrganizationWebhookParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationWebhookParams,
    Awaited<ReturnType<typeof UpdateOrganizationWebhook>>
  >(UpdateOrganizationWebhook, options);
};
