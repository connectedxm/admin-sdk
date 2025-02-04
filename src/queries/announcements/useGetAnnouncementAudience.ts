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
 * Endpoint to fetch the audience for a specific announcement.
 * This function retrieves the list of audience members associated with a given announcement ID.
 * It is designed to be used in applications where understanding the reach or participants of an announcement is necessary.
 * @name GetAnnouncementAudience
 * @param {string} announcementId - The ID of the announcement
 * @version 1.2
 **/

export const ANNOUNCEMENT_AUDIENCE_QUERY_KEY = (announcementId: string) => {
  const queryKey = [...ANNOUNCEMENT_QUERY_KEY(announcementId), "AUDIENCE"];

  return queryKey;
};

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
    },
    "announcements"
  );
};