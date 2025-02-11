import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PaymentIntegrationType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to create and manage payment integration for an organization.
 * This function allows the creation of a payment integration setup for an organization by specifying the type of integration and optional credentials.
 * It is designed to facilitate the management of payment integrations within organizational settings.
 * @name CreateOrganizationPaymentIntegration
 * @param {keyof typeof PaymentIntegrationType} type (path) The type of payment integration
 * @param {string} [clientId] (bodyValue) Optional client ID
 * @param {string} [clientPublicKey] (bodyValue) Optional client public key
 * @param {string} [clientSecret] (bodyValue) Optional client secret
 * @version 1.3
 **/

export interface CreateOrganizationPaymentIntegrationParams
  extends MutationParams {
  type: keyof typeof PaymentIntegrationType;
  clientId?: string;
  clientPublicKey?: string;
  clientSecret?: string;
}

export const CreateOrganizationPaymentIntegration = async ({
  type,
  clientId,
  clientPublicKey,
  clientSecret,
  adminApiParams,
  queryClient,
}: CreateOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<any>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<any>>(
    `/organization/payment/${type}`,
    {
      clientId,
      clientPublicKey,
      clientSecret,
    }
  );
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA(queryClient, [type], data);
  }
  return data;
};

export const useCreateOrganizationPaymentIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateOrganizationPaymentIntegration>>,
      Omit<
        CreateOrganizationPaymentIntegrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateOrganizationPaymentIntegrationParams,
    Awaited<ReturnType<typeof CreateOrganizationPaymentIntegration>>
  >(CreateOrganizationPaymentIntegration, options, {
    domain: "org",
    type: "update",
  });
};
