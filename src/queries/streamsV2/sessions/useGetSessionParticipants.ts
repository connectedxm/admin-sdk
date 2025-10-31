import { GetAdminAPI } from "@src/AdminAPI";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { ConnectedXMResponse, Participant } from "@src/interfaces";
import { SESSION_QUERY_KEY } from "./useGetSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const SESSION_PARTICIPANTS_QUERY_KEY = (sessionId: string) => [
  ...SESSION_QUERY_KEY(sessionId),
  "PARTICIPANTS",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_SESSION_PARTICIPANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SESSION_PARTICIPANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSessionParticipants>>
) => {
  client.setQueryData(SESSION_PARTICIPANTS_QUERY_KEY(...keyParams), response);
};

interface GetSessionParticipantsParams extends SingleQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetSessionParticipants = async ({
  sessionId,
  adminApiParams,
}: GetSessionParticipantsParams): Promise<
  ConnectedXMResponse<Participant[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/streams/v2/sessions/${sessionId}/participants`
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetSessionParticipants = (
  sessionId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetSessionParticipants>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetSessionParticipants>>(
    SESSION_PARTICIPANTS_QUERY_KEY(sessionId),
    (params) => GetSessionParticipants({ sessionId, ...params }),
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
