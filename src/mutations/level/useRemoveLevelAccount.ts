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
 * @category Params
 * @group Level
 */
export interface RemoveLevelAccountParams extends MutationParams {
  levelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Level
 */
export const RemoveLevelAccount = async ({
  levelId,
  accountId,
  adminApiParams,
  queryClient,
}: RemoveLevelAccountParams): Promise<ConnectedXMResponse<Level>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Level>>(
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

/**
 * @category Mutations
 * @group Level
 */
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
  >(RemoveLevelAccount, options);
};
