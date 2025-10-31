import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SessionChatDownload } from "@src/interfaces";
import { SESSION_QUERY_KEY } from "./useGetSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_MESSAGES_QUERY_KEY = (sessionId: string) => [
  ...SESSION_QUERY_KEY(sessionId),
  "MESSAGES",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_MESSAGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_MESSAGES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionMessages>>
) => {
  client.setQueryData(SESSION_MESSAGES_QUERY_KEY(...keyParams), response);
};

interface GetSessionMessagesParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionMessages = async ({
  sessionId,
  adminApiParams,
}: GetSessionMessagesParams): Promise<
  ConnectedXMResponse<SessionChatDownload>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/messages`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionMessages = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionMessages>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionMessages>>(
    SESSION_MESSAGES_QUERY_KEY(sessionId),
    (params) => GetSessionMessages({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
