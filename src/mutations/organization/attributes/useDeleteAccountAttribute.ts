import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY } from "@src/queries/organization/attributes/useGetOrganizationAccountAttributes";
import { ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_KEY } from "@src/queries/organization/attributes/useGetOrganizationAccountAttribute";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";

/**
 * @category Params
 * @group Organization
 */
export interface DeleteAccountAttributeParams extends MutationParams {
  attributeId: string;
}

/**
 * @category Methods
 * @group Organization
 */
export const DeleteAccountAttribute = async ({
  attributeId,
  adminApiParams,
  queryClient,
}: DeleteAccountAttributeParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/organization/attributes/${attributeId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ORGANIZATION_ACCOUNT_ATTRIBUTES_QUERY_KEY(),
    });
    queryClient.removeQueries({
      queryKey: ORGANIZATION_ACCOUNT_ATTRIBUTE_QUERY_KEY(attributeId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Organization
 */
export const useDeleteAccountAttribute = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAccountAttribute>>,
      Omit<DeleteAccountAttributeParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAccountAttributeParams,
    Awaited<ReturnType<typeof DeleteAccountAttribute>>
  >(DeleteAccountAttribute, options);
};
