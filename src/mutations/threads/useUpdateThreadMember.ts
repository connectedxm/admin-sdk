import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import { ThreadMemberUpdateInputs } from "@src/params";
import { THREAD_MEMBERS_QUERY_KEY } from "@src/queries/threads/useGetThreadMembers";
import { THREAD_QUERY_KEY } from "@src/queries/threads/useGetThread";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
  member: ThreadMemberUpdateInputs;
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadMember = async ({
  threadId,
  accountId,
  member,
  adminApiParams,
  queryClient,
}: UpdateThreadMemberParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<ThreadMember>>(
    `/threads/${threadId}/members/${accountId}`,
    member
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
    queryClient.invalidateQueries({
      queryKey: THREAD_QUERY_KEY(threadId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Threads
 */
export const useUpdateThreadMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateThreadMember>>,
      Omit<UpdateThreadMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateThreadMemberParams,
    Awaited<ReturnType<typeof UpdateThreadMember>>
  >(UpdateThreadMember, options);
};
