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
 * Endpoint to add an interest to a specific account.
 * This function allows the addition of a new interest to an account by specifying the account ID and the interest ID.
 * It is designed to update the account's interests and ensure the query data is refreshed accordingly.
 * @name AddAccountInterest
 * @param {string} accountId (path) The id of the account
 * @param {string} interestId (path) The id of the interest
 * @version 1.3
 **/
export interface AddAccountInterestParams extends MutationParams {
  accountId: string;
  interestId: string;
}

export const AddAccountInterest = async ({
  accountId,
  interestId,
  adminApiParams,
  queryClient,
}: AddAccountInterestParams): Promise<ConnectedXMResponse<Account>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Account>>(
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

export const useAddAccountInterest = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddAccountInterest>>,
      Omit<AddAccountInterestParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddAccountInterestParams,
    Awaited<ReturnType<typeof AddAccountInterest>>
  >(AddAccountInterest, options, {
    domain: "accounts",
    type: "update",
  });
};
