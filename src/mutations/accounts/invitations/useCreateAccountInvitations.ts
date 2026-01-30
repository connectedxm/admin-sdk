import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_INVITATIONS_QUERY_KEY } from "@src/queries/accounts/invitations/useGetAccountInvitations";

/**
 * @category Params
 * @group Account
 */
export interface CreateAccountInvitationsParams extends MutationParams {
  emails: string[];
}

/**
 * @category Methods
 * @group Account
 */
export const CreateAccountInvitations = async ({
  emails,
  adminApiParams,
  queryClient,
}: CreateAccountInvitationsParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<null>>(
    `/accounts/invitations`,
    emails
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
export const useCreateAccountInvitations = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAccountInvitations>>,
      Omit<CreateAccountInvitationsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAccountInvitationsParams,
    Awaited<ReturnType<typeof CreateAccountInvitations>>
  >(CreateAccountInvitations, options);
};
