import { ConnectedXMResponse, GroupMembership } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_GROUPS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface AddAccountGroupParams extends MutationParams {
  accountId: string;
  groupId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const AddAccountGroup = async ({
  accountId,
  groupId,
  adminApiParams,
  queryClient,
}: AddAccountGroupParams): Promise<ConnectedXMResponse<GroupMembership>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
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
export const useAddAccountGroup = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof AddAccountGroup>>,
      Omit<AddAccountGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountGroupParams,
    Awaited<ReturnType<typeof AddAccountGroup>>
  >(AddAccountGroup, options);
};
