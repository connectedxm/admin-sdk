import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Webhook } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_WEBHOOKS_QUERY_KEY } from "./useGetOrganizationWebhooks";

/**
 * @category Keys
 * @group Organization
 */
export const ORGANIZATION_WEBHOOK_QUERY_KEY = (webhookId: string) => [
  ...ORGANIZATION_WEBHOOKS_QUERY_KEY(),
  webhookId,
];

/**
 * @category Setters
 * @group Organization
 */
export const SET_ORGANIZATION_WEBHOOK_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_WEBHOOK_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationWebhook>>
) => {
  client.setQueryData(ORGANIZATION_WEBHOOK_QUERY_KEY(...keyParams), response);
};

interface GetOrganizationWebhookProps extends SingleQueryParams {
  webhookId: string;
}

/**
 * @category Queries
 * @group Organization
 */
export const GetOrganizationWebhook = async ({
  webhookId,
  adminApiParams,
}: GetOrganizationWebhookProps): Promise<ConnectedXMResponse<Webhook>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/webhooks/${webhookId}`);
  return data;
};

/**
 * @category Hooks
 * @group Organization
 */
export const useGetOrganizationWebhook = (
  webhookId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetOrganizationWebhook>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetOrganizationWebhook>>(
    ORGANIZATION_WEBHOOK_QUERY_KEY(webhookId),
    (params: SingleQueryParams) =>
      GetOrganizationWebhook({ ...params, webhookId }),
    {
      ...options,
      enabled: !!webhookId && (options.enabled ?? true),
    }
  );
};
