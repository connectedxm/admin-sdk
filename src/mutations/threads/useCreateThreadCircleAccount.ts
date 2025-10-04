import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadCircleAccount } from "@src/interfaces";
import { ThreadCircleAccountCreateInputs } from "@src/params";
import { THREAD_CIRCLE_ACCOUNTS_QUERY_KEY } from "@src/queries/threads/useGetThreadCircleAccounts";

/**
 * @category Params
 * @group Threads
 */
export interface CreateThreadCircleAccountParams extends MutationParams {
  circleId: string;
  account: ThreadCircleAccountCreateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const CreateThreadCircleAccount = async ({
  circleId,
  account,
  adminApiParams,
  queryClient,
}: CreateThreadCircleAccountParams): Promise<
  ConnectedXMResponse<ThreadCircleAccount>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<ThreadCircleAccount>
  >(`/threads/circles/${circleId}/accounts`, account);
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
export const useCreateThreadCircleAccount = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateThreadCircleAccount>>,
      Omit<CreateThreadCircleAccountParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateThreadCircleAccountParams,
    Awaited<ReturnType<typeof CreateThreadCircleAccount>>
  >(CreateThreadCircleAccount, options);
};
