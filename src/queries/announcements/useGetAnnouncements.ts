import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { Announcement } from "@src/interfaces";
import {
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

export const ANNOUNCEMENTS_QUERY_KEY = (filters?: string) => {
  let keys = ["ANNOUNCEMENTS"];
  if (filters) keys.push(filters);
  return keys;
};

export const SET_ANNOUNCEMENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ANNOUNCEMENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncements>>
) => {
  client.setQueryData(ANNOUNCEMENTS_QUERY_KEY(...keyParams), response);
};

interface GetAnnouncementsProps extends InfiniteQueryParams {
  filters?: string;
}

export const GetAnnouncements = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  filters,
}: GetAnnouncementsProps): Promise<ConnectedXMResponse<Announcement[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/announcements`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      filters: filters || undefined,
    },
  });
  return data;
};

const useGetAnnouncements = (filters?: string) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAnnouncements>>
  >(
    ANNOUNCEMENTS_QUERY_KEY(filters),
    (params: any) => GetAnnouncements(params),
    {
      filters,
    },
    {}
  );
};

export default useGetAnnouncements;
