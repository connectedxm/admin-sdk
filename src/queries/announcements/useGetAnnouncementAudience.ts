import { GetAdminAPI } from "@src/AdminAPI";
import { BaseAccount, ConnectedXMResponse } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ANNOUNCEMENT_QUERY_KEY } from "./useGetAnnouncement";

/**
 * @category Keys
 * @group Announcements
 */
export const ANNOUNCEMENT_AUDIENCE_QUERY_KEY = (announcementId: string) => {
  const queryKey = [...ANNOUNCEMENT_QUERY_KEY(announcementId), "AUDIENCE"];

  return queryKey;
};

/**
 * @category Setters
 * @group Announcements
 */
export const SET_ANNOUNCEMENT_AUDIENCE_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ANNOUNCEMENT_AUDIENCE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncementAudience>>
) => {
  client.setQueryData(ANNOUNCEMENT_AUDIENCE_QUERY_KEY(...keyParams), response);
};

interface GetAnnouncementAudienceProps extends InfiniteQueryParams {
  announcementId: string;
}

/**
 * @category Queries
 * @group Announcements
 */
export const GetAnnouncementAudience = async ({
  announcementId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAnnouncementAudienceProps): Promise<
  ConnectedXMResponse<BaseAccount[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/announcements/${announcementId}/audience`,
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
 * @group Announcements
 */
export const useGetAnnouncementAudience = (
  announcementId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAnnouncementAudience>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAnnouncementAudience>>
  >(
    ANNOUNCEMENT_AUDIENCE_QUERY_KEY(announcementId),
    (params: InfiniteQueryParams) =>
      GetAnnouncementAudience({ announcementId, ...params }),
    params,
    {
      ...options,
      enabled: !!announcementId && (options.enabled ?? true),
    }
  );
};
