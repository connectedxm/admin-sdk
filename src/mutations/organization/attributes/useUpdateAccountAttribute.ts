import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { AccountAttribute, ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY } from "@src/queries/organization/attributes/useGetOrganizationAccountAttributes";
import { SET_ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_DATA } from "@src/queries/organization/attributes/useGetOrganizationAccountAttribute";
import { AccountAttributeUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Organization
 */
export interface UpdateAccountAttributeParams extends MutationParams {
  attributeId: string;
  attribute: AccountAttributeUpdateInputs;
}

/**
 * @category Methods
 * @group Organization
 */
export const UpdateAccountAttribute = async ({
  attributeId,
  attribute,
  adminApiParams,
  queryClient,
}: UpdateAccountAttributeParams): Promise<
  ConnectedXMResponse<AccountAttribute>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<AccountAttribute>>(
    `/organization/attributes/${attributeId}`,
    attribute
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY(),
    });
    SET_ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_DATA(
      queryClient,
      [attributeId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useUpdateAccountAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAccountAttribute>>,
      Omit<UpdateAccountAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountAttributeParams,
    Awaited<ReturnType<typeof UpdateAccountAttribute>>
  >(UpdateAccountAttribute, options);
};
