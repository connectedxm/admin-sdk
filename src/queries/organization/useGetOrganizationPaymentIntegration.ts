import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, PaymentIntegrationType } from "@src/interfaces";
import { PaymentIntegration } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY } from "./useGetOrganizationPaymentIntegrations";

/**
 * Retrieves payment integration details for a specific organization.
 * This function fetches detailed information about a payment integration type associated with an organization.
 * It is intended for use in applications that require access to specific payment integration configurations.
 * @name GetOrganizationPaymentIntegration
 * @param {string} type (path) The type of the payment integration
 * @version 1.3
 **/

export const ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY = (type: string) => [
  ...ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
  type,
];

export const SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetOrganizationPaymentIntegration>>
) => {
  client.setQueryData(
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetOrganizationPaymentIntegrationProps extends SingleQueryParams {
  type: string;
}

export const GetOrganizationPaymentIntegration = async ({
  type,
  adminApiParams,
}: GetOrganizationPaymentIntegrationProps): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/organization/payment/${type}`);
  return data;
};

export const useGetOrganizationPaymentIntegration = (
  type: keyof typeof PaymentIntegrationType,
  options: SingleQueryOptions<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  > = {}
) => {
  return useConnectedSingleQuery<
    ReturnType<typeof GetOrganizationPaymentIntegration>
  >(
    ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(type),
    (params: SingleQueryParams) =>
      GetOrganizationPaymentIntegration({ type, ...params }),
    {
      ...options,
      enabled: !!type && (options?.enabled ?? true),
      retry: false,
    },
    "org"
  );
};