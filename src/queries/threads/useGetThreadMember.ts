import { ConnectedXMResponse, ThreadMember } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { THREADS_QUERY_KEY } from "./useGetThreads";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @thread Thread Members
 */
export const THREAD_MEMBER_QUERY_KEY = (
  threadId: string,
  accountId: string
) => [...THREADS_QUERY_KEY(), "MEMBER", threadId, accountId];

interface GetThreadMemberProps extends SingleQueryParams {
  threadId: string;
  accountId: string;
}

/**
 * @category Queries
 * @thread Thread Members
 */
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

/**
 * @category Hooks
 * @thread Thread Members
 */
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
