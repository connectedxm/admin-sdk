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
 * @category Params
 * @group Level
 */
export interface AddLevelAccountParams extends MutationParams {
  levelId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Level
 */
export const AddLevelAccount = async ({
  levelId,
  accountId,
  adminApiParams,
  queryClient,
}: AddLevelAccountParams): Promise<ConnectedXMResponse<Level>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Level>>(
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

/**
 * @category Mutations
 * @group Level
 */
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
  >(AddLevelAccount, options);
};
