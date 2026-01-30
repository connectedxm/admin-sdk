import { Announcement, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  ANNOUNCEMENTS_QUERY_KEY,
  SET_ANNOUNCEMENT_QUERY_DATA,
} from "@src/queries";
import { AnnouncementUpdateInputs } from "@src/params";

/**
 * @category Params
 * @group Announcement
 */
export interface UpdateAnnouncementParams extends MutationParams {
  announcementId: string;
  announcement: AnnouncementUpdateInputs;
}

/**
 * @category Methods
 * @group Announcement
 */
export const UpdateAnnouncement = async ({
  announcementId,
  announcement,
  adminApiParams,
  queryClient,
}: UpdateAnnouncementParams): Promise<ConnectedXMResponse<Announcement>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Announcement>>(
    `/announcements/${announcementId}`,
    announcement
  );
  if (queryClient && data.status === "ok") {
    SET_ANNOUNCEMENT_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY() });
  }
  return data;
};

/**
 * @category Mutations
 * @group Announcement
 */
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
  >(UpdateAnnouncement, options);
};
