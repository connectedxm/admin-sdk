import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_INVITATIONS_QUERY_KEY } from "@src/queries/accounts/useGetAccountInvitations";

/**
 * @category Params
 * @group Account
 */
export interface DeleteAccountInvitationParams extends MutationParams {
  email: string;
}

/**
 * @category Methods
 * @group Account
 */
export const DeleteAccountInvitation = async ({
  email,
  adminApiParams,
  queryClient,
}: DeleteAccountInvitationParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/accounts/invitations/${email}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_INVITATIONS_QUERY_KEY(),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useDeleteAccountInvitation = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAccountInvitation>>,
      Omit<DeleteAccountInvitationParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAccountInvitationParams,
    Awaited<ReturnType<typeof DeleteAccountInvitation>>
  >(DeleteAccountInvitation, options, {
    domain: "accounts",
    type: "del",
  });
};
