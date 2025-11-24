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
 * @category Params
 * @group Organization-Payments
 */
export interface UpdateOrganizationPaymentIntegrationParams
  extends MutationParams {
  type: keyof typeof PaymentIntegrationType;
  clientId?: string;
  clientPublicKey?: string;
  clientSecret?: string;
  integrationId: string;
  name?: string | null;
  currencyCode?: string | null;
}

/**
 * @category Methods
 * @group Organization-Payments
 */
export const UpdateOrganizationPaymentIntegration = async ({
  type,
  clientId,
  clientPublicKey,
  clientSecret,
  name,
  currencyCode,
  integrationId,
  adminApiParams,
  queryClient,
}: UpdateOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<PaymentIntegration>
  >(`/organization/payment/${integrationId}`, {
    clientId,
    clientPublicKey,
    clientSecret,
    name,
    currencyCode,
  });
  if (queryClient && data.status === "ok") {
    SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA(queryClient, [type], data);
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Payments
 */
export const useUpdateOrganizationPaymentIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateOrganizationPaymentIntegration>>,
      Omit<
        UpdateOrganizationPaymentIntegrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateOrganizationPaymentIntegrationParams,
    Awaited<ReturnType<typeof UpdateOrganizationPaymentIntegration>>
  >(UpdateOrganizationPaymentIntegration, options);
};
