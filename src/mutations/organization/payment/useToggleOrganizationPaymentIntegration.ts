import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PaymentIntegration } from "@src/interfaces";
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
export interface ToggleOrganizationPaymentIntegrationParams
  extends MutationParams {
  integrationId: string;
}

/**
 * @category Methods
 * @group Organization-Payments
 */
export const ToggleOrganizationPaymentIntegration = async ({
  integrationId,
  adminApiParams,
  queryClient,
}: ToggleOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<PaymentIntegration>
  >(`/organization/payment/${integrationId}/toggle`);
  if (queryClient && data.status === "ok" && data.data) {
    SET_ORGANIZATION_PAYMENT_INTEGRATION_QUERY_DATA(
      queryClient,
      [integrationId],
      data
    );
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
export const useToggleOrganizationPaymentIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ToggleOrganizationPaymentIntegration>>,
      Omit<
        ToggleOrganizationPaymentIntegrationParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ToggleOrganizationPaymentIntegrationParams,
    Awaited<ReturnType<typeof ToggleOrganizationPaymentIntegration>>
  >(ToggleOrganizationPaymentIntegration, options);
};
