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
 * Adds a member or moderator to a specified thread.
 * This function allows the addition of a user to a thread with a specific role, either as a member or a moderator.
 * It is designed to be used in applications where thread membership management is required.
 * @name AddThreadMember
 * @param {string} threadId (path) The id of the thread
 * @param {string} accountId (path) The id of the account
 * @param {("moderator" | "member")} role (bodyValue) The role to assign
 * @version 1.3
 **/

export interface AddThreadMemberParams extends MutationParams {
  threadId: string;
  accountId: string;
  role: "moderator" | "member";
}

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
