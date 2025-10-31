import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import {
  ConnectedXMResponse,
  SessionTranscriptDownload,
} from "@src/interfaces";
import { SESSION_QUERY_KEY } from "./useGetSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_TRANSCRIPT_QUERY_KEY = (sessionId: string) => [
  ...SESSION_QUERY_KEY(sessionId),
  "TRANSCRIPT",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_TRANSCRIPT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_TRANSCRIPT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionTranscript>>
) => {
  client.setQueryData(SESSION_TRANSCRIPT_QUERY_KEY(...keyParams), response);
};

interface GetSessionTranscriptParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionTranscript = async ({
  sessionId,
  adminApiParams,
}: GetSessionTranscriptParams): Promise<
  ConnectedXMResponse<SessionTranscriptDownload>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/transcript`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionTranscript = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionTranscript>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionTranscript>>(
    SESSION_TRANSCRIPT_QUERY_KEY(sessionId),
    (params) => GetSessionTranscript({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
