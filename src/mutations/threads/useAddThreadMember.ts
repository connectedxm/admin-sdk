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
export interface AddThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
  role: "moderator" | "member";
}

/**
 * @category Methods
 * @group Threads
 */
export const AddThreadMember = async ({
  threadId,
  accountId,
  role,
  adminApiParams,
  queryClient,
}: AddThreadMemberParams): Promise<ConnectedXMResponse<ThreadMember>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<ThreadMember>>(
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
export const useAddThreadMember = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddThreadMember>>,
      Omit<AddThreadMemberParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddThreadMemberParams,
    Awaited<ReturnType<typeof AddThreadMember>>
  >(AddThreadMember, options, {
    domain: "threads",
    type: "update",
  });
};
