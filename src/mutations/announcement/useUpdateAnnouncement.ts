import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "../useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ANNOUNCEMENTS_QUERY_KEY,
  SET_ANNOUNCEMENT_QUERY_DATA,
} from "@src/queries";
import { AnnouncementUpdateInputs } from "@src/params";

/**
 * Endpoint to update an existing announcement.
 * This function allows users to modify the details of a specific announcement by providing the announcement ID and the updated inputs.
 * It ensures that the announcement data is updated in the system and the relevant queries are invalidated to reflect the changes.
 * @name UpdateAnnouncement
 * @param {string} announcementId - The ID of the announcement
 * @param {AnnouncementUpdateInputs} announcement - The announcement update inputs
 * @version 1.2
 **/
export interface UpdateAnnouncementParams extends MutationParams {
  announcementId: string;
  announcement: AnnouncementUpdateInputs;
}

export const UpdateAnnouncement = async ({
  announcementId,
  announcement,
  adminApiParams,
  queryClient,
}: UpdateAnnouncementParams): Promise<ConnectedXMResponse<Announcement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Announcement>>(
    `/announcements/${announcementId}`,
    announcement
  );
  if (queryClient && data.status === "ok") {
    SET_ANNOUNCEMENT_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY() });
  }
  return data;
};

export const useUpdateAnnouncement = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAnnouncement>>,
      Omit<UpdateAnnouncementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAnnouncementParams,
    Awaited<ReturnType<typeof UpdateAnnouncement>>
  >(UpdateAnnouncement, options, {
    domain: "announcements",
    type: "update",
  });
};