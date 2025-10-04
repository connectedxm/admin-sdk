import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Webhook, ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_WEBHOOKS_QUERY_KEY } from "@src/queries/organization/useGetOrganizationWebhooks";
import { SET_ORGANIZATION_WEBHOOK_QUERY_DATA } from "@src/queries/organization/useGetOrganizationWebhook";

/**
 * @category Params
 * @group Organization
 */
export interface VerifyOrganizationWebhookParams extends MutationParams {
  webhookId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const VerifyOrganizationWebhook = async ({
  webhookId,
  adminApiParams,
  queryClient,
}: VerifyOrganizationWebhookParams): Promise<ConnectedXMResponse<Webhook>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Webhook>>(
    `/organization/webhooks/${webhookId}/verify`
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
export const useVerifyOrganizationWebhook = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof VerifyOrganizationWebhook>>,
      Omit<VerifyOrganizationWebhookParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    VerifyOrganizationWebhookParams,
    Awaited<ReturnType<typeof VerifyOrganizationWebhook>>
  >(VerifyOrganizationWebhook, options);
};
