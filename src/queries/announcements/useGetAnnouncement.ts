import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Announcement } from "@src/interfaces";
import { ANNOUNCEMENTS_QUERY_KEY } from "./useGetAnnouncements";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * Fetches a specific announcement by its ID.
 * This function is designed to retrieve detailed information about a particular announcement within the system.
 * It is useful for applications that need to display or process information about a single announcement.
 * @name GetAnnouncement
 * @param {string} announcementId (path) - The ID of the announcement
 * @version 1.3
 **/

export const ANNOUNCEMENT_QUERY_KEY = (announcementId: string) => [
  ...ANNOUNCEMENTS_QUERY_KEY(),
  announcementId,
];

export const SET_ANNOUNCEMENT_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ANNOUNCEMENT_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncement>>
) => {
  client.setQueryData(ANNOUNCEMENT_QUERY_KEY(...keyParams), response);
};

interface GetAnnouncementProps extends SingleQueryParams {
  announcementId: string;
}

export const GetAnnouncement = async ({
  announcementId,
  adminApiParams,
}: GetAnnouncementProps): Promise<ConnectedXMResponse<Announcement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/announcements/${announcementId}`);
  return data;
};

export const useGetAnnouncement = (
  announcementId: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetAnnouncement>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAnnouncement>>(
    ANNOUNCEMENT_QUERY_KEY(announcementId),
    (params: SingleQueryParams) =>
      GetAnnouncement({ announcementId, ...params }),
    {
      ...options,
      enabled: !!announcementId && (options?.enabled ?? true),
    },
    "announcements"
  );
};