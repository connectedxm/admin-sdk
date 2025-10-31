import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, SessionSummaryDownload } from "@src/interfaces";
import { SESSION_QUERY_KEY } from "./useGetSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_SUMMARY_QUERY_KEY = (sessionId: string) => [
  ...SESSION_QUERY_KEY(sessionId),
  "SUMMARY",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_SUMMARY_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_SUMMARY_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionSummary>>
) => {
  client.setQueryData(SESSION_SUMMARY_QUERY_KEY(...keyParams), response);
};

interface GetSessionSummaryParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionSummary = async ({
  sessionId,
  adminApiParams,
}: GetSessionSummaryParams): Promise<
  ConnectedXMResponse<SessionSummaryDownload>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/summary`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionSummary = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionSummary>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionSummary>>(
    SESSION_SUMMARY_QUERY_KEY(sessionId),
    (params) => GetSessionSummary({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
