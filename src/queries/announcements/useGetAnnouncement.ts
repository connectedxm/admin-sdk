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
 * @category Keys
 * @group Announcements
 */
export const ANNOUNCEMENT_QUERY_KEY = (announcementId: string) => [
  ...ANNOUNCEMENTS_QUERY_KEY(),
  announcementId,
];

/**
 * @category Setters
 * @group Announcements
 */
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

/**
 * @category Queries
 * @group Announcements
 */
export const GetAnnouncement = async ({
  announcementId,
  adminApiParams,
}: GetAnnouncementProps): Promise<ConnectedXMResponse<Announcement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/announcements/${announcementId}`);
  return data;
};
/**
 * @category Hooks
 * @group Announcements
 */
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
    }
  );
};
