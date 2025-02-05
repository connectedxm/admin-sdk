import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { THREADS_QUERY_KEY } from "./useGetThreads";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Retrieves detailed information about a specific member of a thread.
 * This function is designed to fetch data for a particular thread member using their thread and account IDs.
 * It is useful in applications where thread member details are required for display or processing.
 * @name GetThreadMember
 * @param {string} threadId - The ID of the thread
 * @param {string} accountId - The ID of the account
 * @version 1.2
 **/

export const THREAD_MEMBER_QUERY_KEY = (
  threadId: string,
  accountId: string
) => [...THREADS_QUERY_KEY(), "MEMBER", threadId, accountId];

interface GetThreadMemberProps extends SingleQueryParams {
  threadId: string;
  accountId: string;
}

export const GetThreadMember = async ({
  threadId,
  accountId,
  adminApiParams,
}: GetThreadMemberProps): Promise<ConnectedXMResponse<ThreadMember>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/threads/${threadId}/members/${accountId}`
  );
  return data;
};

export const useGetThreadMember = (
  threadId: string = "",
  accountId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetThreadMember>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetThreadMember>>(
    THREAD_MEMBER_QUERY_KEY(threadId, accountId),
    (params: SingleQueryParams) =>
      GetThreadMember({ threadId, accountId, ...params }),
    {
      ...options,
      enabled: !!threadId && !!accountId && (options?.enabled ?? true),
    },
    "threads"
  );
};