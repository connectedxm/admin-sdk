import { GetAdminAPI } from "@src/AdminAPI";
import { EventSponsorship, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SPONSORSHIPS_QUERY_DATA } from "@src/queries/events/sponsorships/useGetEventSponsorships";

/**
 * @category Params
 * @group Event-Sponsorships
 */
export interface ReorderEventSponsorshipsParams extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipIds: string[];
}

/**
 * @category Methods
 * @group Event-Sponsorships
 */
export const ReorderEventSponsorships = async ({
  eventId,
  levelId,
  sponsorshipIds,
  adminApiParams,
  queryClient,
}: ReorderEventSponsorshipsParams): Promise<
  ConnectedXMResponse<EventSponsorship[]>
> => {
  if (!eventId) throw new Error("Event ID is undefined");
  if (!levelId) throw new Error("Level ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSponsorship[]>
  >(`/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/reorder`, {
    sponsorshipIds,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_SPONSORSHIPS_QUERY_DATA(queryClient, [eventId, levelId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sponsorships
 */
export const useReorderEventSponsorships = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSponsorships>>,
      Omit<ReorderEventSponsorshipsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSponsorshipsParams,
    Awaited<ReturnType<typeof ReorderEventSponsorships>>
  >(ReorderEventSponsorships, options, {
    domain: "events",
    type: "update",
  });
};
