import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMResponse,
  PaymentIntegration,
  PaymentIntegrationType,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA,
  ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY,
} from "@src/queries";

/**
 * Toggles the payment integration for an organization and updates the query client with new data.
 * This function allows the modification of payment integration settings for an organization by specifying the type of integration.
 * It ensures that the query client is updated with the latest data after the integration is toggled.
 * @name ToggleOrganizationPaymentIntegration
 * @param {keyof typeof PaymentIntegrationType} type (path) - The type of payment integration
 * @version 1.3
 **/

export interface ToggleOrganizationPaymentIntegrationParams extends MutationParams {
  type: keyof typeof PaymentIntegrationType;
}

export const ToggleOrganizationPaymentIntegration = async ({
  type,
  adminApiParams,
  queryClient,
}: ToggleOrganizationPaymentIntegrationParams): Promise<ConnectedXMResponse<PaymentIntegration>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<PaymentIntegration>>(`/organization/payment/${type}`);
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA(queryClient, [type], data);
    queryClient.invalidateQueries({ queryKey: ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY() });
  }
  return data;
};

export const useToggleOrganizationPaymentIntegration = (
  options: Omit<ConnectedXMMutationOptions<Awaited<ReturnType<typeof ToggleOrganizationPaymentIntegration>>, Omit<ToggleOrganizationPaymentIntegrationParams, "queryClient" | "adminApiParams">>, "mutationFn"> = {}
) => {
  return useConnectedMutation<ToggleOrganizationPaymentIntegrationParams, Awaited<ReturnType<typeof ToggleOrganizationPaymentIntegration>>>(ToggleOrganizationPaymentIntegration, options, {
    domain: "org",
    type: "update",
  });
};