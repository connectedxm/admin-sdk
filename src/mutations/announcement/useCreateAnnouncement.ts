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
 * @category Params
 * @group Announcement
 */
export interface CreateAnnouncementParams extends MutationParams {
  announcement: AnnouncementCreateInputs;
}

/**
 * @category Methods
 * @group Announcement
 */
export const CreateAnnouncement = async ({
  announcement,
  adminApiParams,
  queryClient,
}: CreateAnnouncementParams): Promise<ConnectedXMResponse<Announcement>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<ConnectedXMResponse<Announcement>>(
    `/announcements`,
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
  >(CreateAnnouncement, options);
};
