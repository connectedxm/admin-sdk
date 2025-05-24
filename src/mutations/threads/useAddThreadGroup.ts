import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import { THREAD_GROUPS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface AddThreadGroupParams extends MutationParams {
  threadId: string;
  groupId: string;
}

/**
 * @category Methods
 * @group Threads
 */
export const AddThreadGroup = async ({
  threadId,
  groupId,
  adminApiParams,
  queryClient,
}: AddThreadGroupParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMember>>(
    `/threads/${threadId}/groups/${groupId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_GROUPS_QUERY_KEY(threadId),
    });
  }

  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useAddThreadGroup = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddThreadGroup>>,
      Omit<AddThreadGroupParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddThreadGroupParams,
    Awaited<ReturnType<typeof AddThreadGroup>>
  >(AddThreadGroup, options, {
    domain: "threads",
    type: "update",
  });
};
