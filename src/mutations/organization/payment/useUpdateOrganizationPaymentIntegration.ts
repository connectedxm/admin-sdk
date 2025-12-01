import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, PaymentIntegration } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { OrganizationPaymentIntegrationUpdateInputs } from "@src/params";
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
  integrationId: string;
  integration: OrganizationPaymentIntegrationUpdateInputs;
}

/**
 * @category Methods
 * @group Organization-Payments
 */
export const UpdateOrganizationPaymentIntegration = async ({
  integration,
  integrationId,
  adminApiParams,
  queryClient,
}: UpdateOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<PaymentIntegration>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<PaymentIntegration>
  >(`/organization/payment/${integrationId}`, integration);
  if (queryClient && data.status === "ok") {
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
