import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
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
 * @category Params
 * @group Organization-Payments
 */
export interface DeleteOrganizationPaymentIntegrationParams
  extends MutationParams {
  integrationId: string;
}

/**
 * @category Methods
 * @group Organization-Payments
 */
export const DeleteOrganizationPaymentIntegration = async ({
  integrationId,
  adminApiParams,
  queryClient,
}: DeleteOrganizationPaymentIntegrationParams): Promise<
  ConnectedXMResponse<any>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<any>>(
    `/organization/payment/${integrationId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_PAYMENT_INTEGRATIONS_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: ORGANIZATION_PAYMENT_INTEGRATION_QUERY_KEY(integrationId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization-Payments
 */
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
  >(DeleteOrganizationPaymentIntegration, options);
};
