import { ConnectedXMResponse, Lead } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_LEADS_QUERY_KEY } from "@src/queries";
import { LeadUpdateInputs } from "@src/params";

/**
 * Endpoint to update a lead associated with a specific account.
 * This function allows updating the details of a lead linked to a particular account using the provided account and lead identifiers.
 * It is designed to be used in applications where lead information needs to be modified.
 * @name UpdateAccountLead
 * @param {string} accountId - The id of the account
 * @param {string} leadId - The id of the lead
 * @param {LeadUpdateInputs} lead - The lead update inputs
 * @version 1.2
 **/
export interface UpdateAccountLeadParams extends MutationParams {
  accountId: string;
  leadId: string;
  lead: LeadUpdateInputs;
}

export const UpdateAccountLead = async ({
  accountId,
  leadId,
  lead,
  adminApiParams,
  queryClient,
}: UpdateAccountLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Lead>>(
    `/accounts/${accountId}/leads/${leadId}`,
    lead
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEADS_QUERY_KEY(accountId),
    });
  }

  return data;
};

export const useUpdateAccountLead = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAccountLead>>,
      Omit<UpdateAccountLeadParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAccountLeadParams,
    Awaited<ReturnType<typeof UpdateAccountLead>>
  >(UpdateAccountLead, options, {
    domain: "accounts",
    type: "update",
  });
};