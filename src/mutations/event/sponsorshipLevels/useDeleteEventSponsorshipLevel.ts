import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORSHIP_LEVELS_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevels";
import { EVENT_SPONSORSHIP_LEVEL_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevel";

/**
 * @category Params
 * @group Event-SponsorshipLevels
 */
export interface DeleteEventSponsorshipLevelParams extends MutationParams {
  eventId: string;
  levelId: string;
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels
 */
export const DeleteEventSponsorshipLevel = async ({
  eventId,
  levelId,
  adminApiParams,
  queryClient,
}: DeleteEventSponsorshipLevelParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sponsorshipLevels/${levelId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SPONSORSHIP_LEVEL_QUERY_KEY(eventId, levelId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-SponsorshipLevels
 */
export const useDeleteEventSponsorshipLevel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSponsorshipLevel>>,
      Omit<DeleteEventSponsorshipLevelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSponsorshipLevelParams,
    Awaited<ReturnType<typeof DeleteEventSponsorshipLevel>>
  >(DeleteEventSponsorshipLevel, options);
};
