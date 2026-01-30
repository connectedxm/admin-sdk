import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_LEAD_QUERY_KEY, ACCOUNT_LEADS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Account
 */
export interface DeleteAccountLeadParams extends MutationParams {
  accountId: string;
  leadId: string;
}

/**
 * @category Methods
 * @group Account
 */
export const DeleteAccountLead = async ({
  accountId,
  leadId,
  adminApiParams,
  queryClient,
}: DeleteAccountLeadParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/accounts/${accountId}/leads/${leadId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEADS_QUERY_KEY(accountId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEAD_QUERY_KEY(accountId, leadId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Account
 */
export const useDeleteAccountLead = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteAccountLead>>,
      Omit<DeleteAccountLeadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteAccountLeadParams,
    Awaited<ReturnType<typeof DeleteAccountLead>>
  >(DeleteAccountLead, options);
};
