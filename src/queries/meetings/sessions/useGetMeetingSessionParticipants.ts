import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedInfiniteQuery,
  InfiniteQueryParams,
  InfiniteQueryOptions,
} from "../../useConnectedInfiniteQuery";
import {
  ConnectedXMResponse,
  BaseMeetingSessionParticipant,
} from "@src/interfaces";
import { MEETING_SESSION_QUERY_KEY } from "./useGetMeetingSession";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group StreamsV2
 */
export const MEETING_SESSION_PARTICIPANTS_QUERY_KEY = (sessionId: string) => [
  ...MEETING_SESSION_QUERY_KEY(sessionId),
  "PARTICIPANTS",
];

/**
 * @category Setters
 * @group StreamsV2
 */
export const SET_MEETING_SESSION_PARTICIPANTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof MEETING_SESSION_PARTICIPANTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetMeetingSessionParticipants>>
) => {
  client.setQueryData(
    MEETING_SESSION_PARTICIPANTS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetMeetingSessionParticipantsParams extends InfiniteQueryParams {
  sessionId: string;
}

/**
 * @category Queries
 * @group StreamsV2
 */
export const GetMeetingSessionParticipants = async ({
  sessionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetMeetingSessionParticipantsParams): Promise<
  ConnectedXMResponse<BaseMeetingSessionParticipant[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/meetings/sessions/${sessionId}/participants`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );

  return data;
};

/**
 * @category Hooks
 * @group StreamsV2
 */
export const useGetMeetingSessionParticipants = (
  sessionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetMeetingSessionParticipants>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetMeetingSessionParticipants>>
  >(
    MEETING_SESSION_PARTICIPANTS_QUERY_KEY(sessionId),
    (params: InfiniteQueryParams) =>
      GetMeetingSessionParticipants({ ...params, sessionId }),
    params,
    {
      ...options,
      enabled: !!sessionId && (options?.enabled ?? true),
    }
  );
};
