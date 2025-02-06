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
import { AnnouncementCreateInputs } from "@src/params";

/**
 * Endpoint to create a new announcement within the system.
 * This function allows users to submit details for a new announcement, which will be processed and stored.
 * It is designed to be used in applications where announcements need to be dynamically created and managed.
 * @name CreateAnnouncement
 * @param {AnnouncementCreateInputs} announcement (body) - The announcement details to be created
 * @version 1.3
 **/
export interface CreateAnnouncementParams extends MutationParams {
  announcement: AnnouncementCreateInputs;
}

export const CreateAnnouncement = async ({
  announcement,
  adminApiParams,
  queryClient,
}: CreateAnnouncementParams): Promise<ConnectedXMResponse<Announcement>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<ConnectedXMResponse<Announcement>>(
    `/announcements`,
    announcement
  );
  if (queryClient && data.status === "ok") {
    SET_ANNOUNCEMENT_QUERY_DATA(queryClient, [data?.data.id], data);
    queryClient.invalidateQueries({ queryKey: ANNOUNCEMENTS_QUERY_KEY() });
  }
  return data;
}

export const useCreateAnnouncement = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateAnnouncement>>,
      Omit<CreateAnnouncementParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateAnnouncementParams,
    Awaited<ReturnType<typeof CreateAnnouncement>>
  >(CreateAnnouncement, options, {
    domain: "announcements",
    type: "create",
  });
};