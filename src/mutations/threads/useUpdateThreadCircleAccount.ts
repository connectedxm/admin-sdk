import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadCircleAccount } from "@src/interfaces";
import { ThreadCircleAccountUpdateInputs } from "@src/params";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleAccounts";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadCircleAccountParams extends MutationParams {
  circleId: string;
  accountId: string;
  account: ThreadCircleAccountUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadCircleAccount = async ({
  circleId,
  accountId,
  account,
  adminApiParams,
  queryClient,
}: UpdateThreadCircleAccountParams): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<ThreadCircleAccount>
  >(`/threads/circles/${circleId}/accounts/${accountId}`, account);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_CIRCLE_ACCOUNTS_QUERY_KEY(circleId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useUpdateThreadCircleAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateThreadCircleAccount>>,
      Omit<UpdateThreadCircleAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadCircleAccountParams,
    Awaited<ReturnType<typeof UpdateThreadCircleAccount>>
  >(UpdateThreadCircleAccount, options, {
    domain: "threads",
    type: "update",
  });
};
