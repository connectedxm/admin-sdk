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

/**
 * @category Params
 * @group Announcement
 */
export interface CancelAnnouncementScheduleParams extends MutationParams {
  announcementId: string;
}

/**
 * @category Methods
 * @group Announcement
 */
export const CancelAnnouncementSchedule = async ({
  announcementId,
  adminApiParams,
  queryClient,
}: CancelAnnouncementScheduleParams): Promise<
  ConnectedXMResponse<Announcement>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<Announcement>>(
    `/announcements/${announcementId}/schedule`
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
export const useCancelAnnouncementSchedule = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CancelAnnouncementSchedule>>,
      Omit<CancelAnnouncementScheduleParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CancelAnnouncementScheduleParams,
    Awaited<ReturnType<typeof CancelAnnouncementSchedule>>
  >(CancelAnnouncementSchedule, options, {
    domain: "announcements",
    type: "update",
  });
};
