import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { AccountAttribute, ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY } from "@src/queries/organization/useGetOrganizationAccountAttributes";
import { SET_ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_DATA } from "@src/queries/organization/useGetOrganizationAccountAttribute";
import { AccountAttributeCreateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface CreateAccountAttributeParams extends MutationParams {
  attribute: AccountAttributeCreateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const CreateAccountAttribute = async ({
  attribute,
  adminApiParams,
  queryClient,
}: CreateAccountAttributeParams): Promise<
  ConnectedXMResponse<AccountAttribute>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<AccountAttribute>
  >(`/organization/attributes`, attribute);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY(),
    });
    SET_ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_DATA(
      queryClient,
      [data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useCreateAccountAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAccountAttribute>>,
      Omit<CreateAccountAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAccountAttributeParams,
    Awaited<ReturnType<typeof CreateAccountAttribute>>
  >(CreateAccountAttribute, options);
};
