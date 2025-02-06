import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse, Lead } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { ACCOUNT_LEADS_QUERY_KEY } from "./useGetAccountLeads";

/**
 * Endpoint to fetch a specific lead from an account.
 * This function retrieves detailed information about a lead associated with a particular account.
 * It is designed for applications that require access to specific lead data within an account.
 * @name GetAccountLead
 * @param {string} accountId (path) - The id of the account
 * @param {string} leadId (path) - The id of the lead
 * @version 1.3
 **/

export const ACCOUNT_LEAD_QUERY_KEY = (accountId: string, leadId: string) => [
  ...ACCOUNT_LEADS_QUERY_KEY(accountId),
  leadId,
];

export const SET_ACCOUNT_LEAD_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ACCOUNT_LEAD_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAccountLead>>
) => {
  client.setQueryData(ACCOUNT_LEAD_QUERY_KEY(...keyParams), response);
};

interface GetAccountLeadProps extends SingleQueryParams {
  accountId: string;
  leadId: string;
}

export const GetAccountLead = async ({
  accountId = "",
  leadId = "",
  adminApiParams,
}: GetAccountLeadProps): Promise<ConnectedXMResponse<Lead>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/accounts/${accountId}/leads/${leadId}`);
  return data;
};

export const useGetAccountLead = (
  accountId: string = "",
  leadId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAccountLead>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAccountLead>>(
    ACCOUNT_LEAD_QUERY_KEY(accountId, leadId),
    (params: SingleQueryParams) =>
      GetAccountLead({ accountId, leadId, ...params }),
    {
      ...options,
      enabled: !!accountId && !!leadId && (options?.enabled ?? true),
    },
    "accounts"
  );
};