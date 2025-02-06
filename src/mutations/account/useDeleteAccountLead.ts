import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_LEAD_QUERY_KEY, ACCOUNT_LEADS_QUERY_KEY } from "@src/queries";

/**
 * Endpoint to delete a lead associated with a specific account.
 * This function allows the removal of a lead from an account by specifying the account and lead identifiers.
 * It is intended for use in scenarios where account management requires the deletion of associated leads.
 * @name DeleteAccountLead
 * @param {string} accountId (path) - The id of the account
 * @param {string} leadId (path) - The id of the lead
 * @version 1.3
 **/
export interface DeleteAccountLeadParams extends MutationParams {
  accountId: string;
  leadId: string;
}

export const DeleteAccountLead = async ({
  accountId,
  leadId,
  adminApiParams,
  queryClient,
}: DeleteAccountLeadParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
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
  >(DeleteAccountLead, options, {
    domain: "accounts",
    type: "update",
  });
};