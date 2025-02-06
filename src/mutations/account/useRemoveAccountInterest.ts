import { Account, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ACCOUNT_INTERESTS_QUERY_KEY,
  SET_ACCOUNT_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove an interest from a specified account.
 * This function allows the removal of a specific interest from an account by providing the account ID and the interest ID.
 * It is used in scenarios where account interests need to be dynamically managed and updated.
 * @name RemoveAccountInterest
 * @param {string} accountId (path) - The id of the account
 * @param {string} interestId (path) - The id of the interest to be removed
 * @version 1.3
 **/
export interface RemoveAccountInterestParams extends MutationParams {
  accountId: string;
  interestId: string;
}

export const RemoveAccountInterest = async ({
  accountId,
  interestId,
  adminApiParams,
  queryClient,
}: RemoveAccountInterestParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Account>>(
    `/accounts/${accountId}/interests/${interestId}`
  );
  if (queryClient && data.status === "ok") {
    SET_ACCOUNT_QUERY_DATA(queryClient, [accountId], data);
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_INTERESTS_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useRemoveAccountInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveAccountInterest>>,
      Omit<RemoveAccountInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveAccountInterestParams,
    Awaited<ReturnType<typeof RemoveAccountInterest>>
  >(RemoveAccountInterest, options, {
    domain: "accounts",
    type: "update",
  });
};