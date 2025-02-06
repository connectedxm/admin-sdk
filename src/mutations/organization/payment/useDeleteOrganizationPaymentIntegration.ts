import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PaymentIntegrationType } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY,
  ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a payment integration for an organization.
 * This function allows the removal of a specified payment integration type from an organization.
 * It is designed to be used in applications where managing payment integrations is required.
 * @name DeleteOrganizationPaymentIntegration
 * @param {keyof typeof PaymentIntegrationType} type (path) - The type of payment integration
 * @version 1.3
 **/
export interface DeleteOrganizationPaymentIntegrationParams
  extends MutationParams {
  type: keyof typeof PaymentIntegrationType;
}

export const DeleteOrganizationPaymentIntegration = async ({
  type,
  adminApiParams,
  queryClient,
}: DeleteOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<any>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<any>>(
    `/organization/payment/${type}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(type),
    });
  }
  return data;
};

export const useDeleteOrganizationPaymentIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteOrganizationPaymentIntegration>>,
      Omit<
        DeleteOrganizationPaymentIntegrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteOrganizationPaymentIntegrationParams,
    Awaited<ReturnType<typeof DeleteOrganizationPaymentIntegration>>
  >(DeleteOrganizationPaymentIntegration, options, {
    domain: "org",
    type: "update",
  });
};