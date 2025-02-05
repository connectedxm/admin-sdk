import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Level } from "@src/interfaces";
import {
  ACCOUNT_LEVELS_QUERY_KEY,
  LEVEL_ACCOUNTS_QUERY_KEY,
  SET_LEVEL_QUERY_DATA,
} from "@src/queries";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";

/**
 * Adds an account to a specified level, facilitating the management of account-level associations.
 * This function is used to associate an account with a particular level, enabling the organization to manage permissions and access based on levels.
 * It is particularly useful in scenarios where accounts need to be dynamically assigned to different levels for access control.
 * @name AddLevelAccount
 * @param {string} levelId - The id of the level
 * @param {string} accountId - The id of the account
 * @version 1.2
 **/

export interface AddLevelAccountParams extends MutationParams {
  levelId: string;
  accountId: string;
}

export const AddLevelAccount = async ({
  levelId,
  accountId,
  adminApiParams,
  queryClient,
}: AddLevelAccountParams): Promise<ConnectedXMResponse<Level>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Level>>(
    `/levels/${levelId}/accounts/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: LEVEL_ACCOUNTS_QUERY_KEY(levelId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEVELS_QUERY_KEY(accountId),
    });
    SET_LEVEL_QUERY_DATA(queryClient, [levelId], data);
  }
  return data;
};

export const useAddLevelAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddLevelAccount>>,
      Omit<AddLevelAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddLevelAccountParams,
    Awaited<ReturnType<typeof AddLevelAccount>>
  >(AddLevelAccount, options, {
    domain: "sponsors",
    type: "update",
  });
};