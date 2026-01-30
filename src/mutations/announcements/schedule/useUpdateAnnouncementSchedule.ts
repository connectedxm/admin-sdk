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

/**
 * @category Params
 * @group Announcement
 */
export interface UpdateAnnouncementScheduleParams extends MutationParams {
  announcementId: string;
  schedule: {
    date: string;
    email?: boolean;
    push?: boolean;
  };
}

/**
 * @category Methods
 * @group Announcement
 */
export const UpdateAnnouncementSchedule = async ({
  announcementId,
  schedule,
  adminApiParams,
  queryClient,
}: UpdateAnnouncementScheduleParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Announcement>>(
    `/announcements/${announcementId}/schedule`,
    schedule
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
export const useUpdateAnnouncementSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateAnnouncementSchedule>>,
      Omit<UpdateAnnouncementScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateAnnouncementScheduleParams,
    Awaited<ReturnType<typeof UpdateAnnouncementSchedule>>
  >(UpdateAnnouncementSchedule, options);
};
