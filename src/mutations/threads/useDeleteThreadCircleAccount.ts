import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse } from "@src/interfaces";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleAccounts";
import { THREAD_CIRCLE_ACCOUNT_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleAccount";

/**
 * @category Params
 * @group Threads
 */
export interface DeleteThreadCircleAccountParams extends MutationParams {
  circleId: string;
  accountId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const DeleteThreadCircleAccount = async ({
  circleId,
  accountId,
  adminApiParams,
  queryClient,
}: DeleteThreadCircleAccountParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/threads/circles/${circleId}/accounts/${accountId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId),
    });
    queryClient.removeQueries({
      queryKey: THREAD_CIRCLE_ACCOUNT_QUERY_KEY(circleId, accountId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useDeleteThreadCircleAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteThreadCircleAccount>>,
      Omit<DeleteThreadCircleAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteThreadCircleAccountParams,
    Awaited<ReturnType<typeof DeleteThreadCircleAccount>>
  >(DeleteThreadCircleAccount, options, {
    domain: "threads",
    type: "del",
  });
};
