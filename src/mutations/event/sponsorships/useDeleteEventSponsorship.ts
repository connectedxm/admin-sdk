import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EVENT_SPONSORSHIPS_QUERY_KEY } from "@src/queries/events/sponsorships/useGetEventSponsorships";
import { EVENT_SPONSORSHIP_QUERY_KEY } from "@src/queries/events/sponsorships/useGetEventSponsorship";

/**
 * @category Params
 * @group Event-Sponsorships
 */
export interface DeleteEventSponsorshipParams extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
}

/**
 * @category Methods
 * @group Event-Sponsorships
 */
export const DeleteEventSponsorship = async ({
  eventId,
  levelId,
  sponsorshipId,
  adminApiParams,
  queryClient,
}: DeleteEventSponsorshipParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIPS_QUERY_KEY(eventId, levelId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_SPONSORSHIP_QUERY_KEY(eventId, levelId, sponsorshipId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sponsorships
 */
export const useDeleteEventSponsorship = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventSponsorship>>,
      Omit<DeleteEventSponsorshipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventSponsorshipParams,
    Awaited<ReturnType<typeof DeleteEventSponsorship>>
  >(DeleteEventSponsorship, options, {
    domain: "events",
    type: "update",
  });
};
