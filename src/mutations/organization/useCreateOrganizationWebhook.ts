import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { Webhook, ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_WEBHOOKS_QUERY_KEY } from "@src/queries/organization/useGetOrganizationWebhooks";
import { SET_ORGANIZATION_WEBHOOK_QUERY_DATA } from "@src/queries/organization/useGetOrganizationWebhook";
import { WebhookCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface CreateOrganizationWebhookParams extends MutationParams {
  webhook: WebhookCreateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const CreateOrganizationWebhook = async ({
  webhook,
  adminApiParams,
  queryClient,
}: CreateOrganizationWebhookParams): Promise<ConnectedXMResponse<Webhook>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Webhook>>(
    `/organization/webhooks`,
    webhook
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_WEBHOOKS_QUERY_KEY(),
    });
    SET_ORGANIZATION_WEBHOOK_QUERY_DATA(queryClient, [data.data.id], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useCreateOrganizationWebhook = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateOrganizationWebhook>>,
      Omit<CreateOrganizationWebhookParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateOrganizationWebhookParams,
    Awaited<ReturnType<typeof CreateOrganizationWebhook>>
  >(CreateOrganizationWebhook, options);
};
