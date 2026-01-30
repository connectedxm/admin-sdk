import { ConnectedXMResponse, Lead } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import { ACCOUNT_LEADS_QUERY_KEY } from "@src/queries";
import { LeadUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Account
 */
export interface UpdateAccountLeadParams extends MutationParams {
  accountId: string;
  leadId: string;
  lead: LeadUpdateInputs;
}

/**
 * @category Methods
 * @group Account
 */
export const UpdateAccountLead = async ({
  accountId,
  leadId,
  lead,
  adminApiParams,
  queryClient,
}: UpdateAccountLeadParams): Promise<ConnectedXMResponse<Lead>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Lead>>(
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

/**
 * @category Mutations
 * @group Account
 */
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
  >(UpdateAccountLead, options);
};
