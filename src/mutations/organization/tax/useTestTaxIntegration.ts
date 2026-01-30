import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  TaxIntegration,
  ConnectedXMResponse,
  TaxIntegrationType,
} from "@src/interfaces";

/**
 * @category Params
 * @group Integration
 */
export interface TestTaxIntegrationParams extends MutationParams {
  type: keyof typeof TaxIntegrationType;
}

/**
 * @category Methods
 * @group Integration
 */
export const TestTaxIntegration = async ({
  type,
  adminApiParams,
}: TestTaxIntegrationParams): Promise<ConnectedXMResponse<TaxIntegration>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<TaxIntegration>>(
    `/organization/tax/${type}/test`
  );

  return data;
};

/**
 * @category Mutations
 * @group Integration
 */
export const useTestTaxIntegration = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof TestTaxIntegration>>,
      Omit<TestTaxIntegrationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    TestTaxIntegrationParams,
    Awaited<ReturnType<typeof TestTaxIntegration>>
  >(TestTaxIntegration, options);
};
