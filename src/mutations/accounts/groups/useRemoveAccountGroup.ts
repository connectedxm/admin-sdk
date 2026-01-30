import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_GROUPS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface RemoveAccountGroupParams extends MutationParams {
  accountId: string;
  groupId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const RemoveAccountGroup = async ({
  accountId,
  groupId,
  adminApiParams,
  queryClient,
}: RemoveAccountGroupParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/groups/${groupId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_GROUPS_QUERY_KEY(accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useRemoveAccountGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountGroup>>,
      Omit<RemoveAccountGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountGroupParams,
    Awaited<ReturnType<typeof RemoveAccountGroup>>
  >(RemoveAccountGroup, options);
};
