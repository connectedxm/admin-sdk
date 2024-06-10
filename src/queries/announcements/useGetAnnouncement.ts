import { useConnectedSingleQuery } from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { Announcement } from "@src/interfaces";
import { ANNOUNCEMENTS_QUERY_KEY } from "./useGetAnnouncements";
import { QueryClient } from "@tanstack/react-query";

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

interface GetAnnouncementProps {
  announcementId: string;
}

export const GetAnnouncement = async ({
  announcementId,
}: GetAnnouncementProps) => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/announcements/${announcementId}`);
  return data;
};

const useGetAnnouncement = (announcementId: string) => {
  return useConnectedSingleQuery<ConnectedXMResponse<Announcement>>(
    ANNOUNCEMENT_QUERY_KEY(announcementId),
    () => GetAnnouncement({ announcementId: announcementId || "unknown" }),
    {
      enabled: !!announcementId,
    }
  );
};

export default useGetAnnouncement;
