import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, Level } from "@src/interfaces";
import {
  SET_LEVEL_QUERY_DATA,
  LEVEL_ACCOUNTS_QUERY_KEY,
  ACCOUNT_LEVELS_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to remove an account from a specified level within the system.
 * This function facilitates the removal of an account from a particular level, ensuring that the associated data is updated accordingly.
 * It is intended for use in administrative contexts where managing account-level associations is necessary.
 * @name RemoveLevelAccount
 * @param {string} levelId (path) - The id of the level
 * @param {string} accountId (path) - The id of the account
 * @version 1.3
 **/
export interface RemoveLevelAccountParams extends MutationParams {
  levelId: string;
  accountId: string;
}

export const RemoveLevelAccount = async ({
  levelId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveLevelAccountParams): Promise<ConnectedXMResponse<Level>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<Level>>(
    `/levels/${levelId}/accounts/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    SET_LEVEL_QUERY_DATA(queryClient, [levelId], data);
    queryClient.invalidateQueries({
      queryKey: LEVEL_ACCOUNTS_QUERY_KEY(levelId),
    });
    queryClient.invalidateQueries({
      queryKey: ACCOUNT_LEVELS_QUERY_KEY(accountId),
    });
  }
  return data;
};

export const useRemoveLevelAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveLevelAccount>>,
      Omit<RemoveLevelAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveLevelAccountParams,
    Awaited<ReturnType<typeof RemoveLevelAccount>>
  >(RemoveLevelAccount, options, {
    domain: "sponsors",
    type: "update",
  });
};