import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import {
  THREAD_MEMBERS_QUERY_KEY,
  THREAD_MODERATORS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Threads
 */
export interface UpdateThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
  role: "moderator" | "member";
}

/**
 * @category Methods
 * @group Threads
 */
export const UpdateThreadMember = async ({
  threadId,
  accountId,
  role,
  adminApiParams,
  queryClient,
}: UpdateThreadMemberParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<ThreadMember>>(
    `/threads/${threadId}/members/${accountId}`,
    {
      role,
    }
  );
  if (queryClient && data.status === "ok" && role === "member") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MEMBERS_QUERY_KEY(threadId),
    });
  }

  if (queryClient && data.status === "ok" && role === "moderator") {
    queryClient.invalidateQueries({
      queryKey: THREAD_MODERATORS_QUERY_KEY(threadId),
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
  >(UpdateThreadMember, options, {
    domain: "threads",
    type: "update",
  });
};
