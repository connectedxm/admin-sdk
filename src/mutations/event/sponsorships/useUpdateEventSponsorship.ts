import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSponsorship } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSponsorshipUpdateInputs } from "@src/params";
import { EVENT_SPONSORSHIPS_QUERY_KEY } from "@src/queries/events/sponsorships/useGetEventSponsorships";
import { SET_EVENT_SPONSORSHIP_QUERY_DATA } from "@src/queries/events/sponsorships/useGetEventSponsorship";

/**
 * @category Params
 * @group Event-Sponsorships
 */
export interface UpdateEventSponsorshipParams extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipId: string;
  sponsorship: EventSponsorshipUpdateInputs;
}

/**
 * @category Methods
 * @group Event-Sponsorships
 */
export const UpdateEventSponsorship = async ({
  eventId,
  levelId,
  sponsorshipId,
  sponsorship,
  adminApiParams,
  queryClient,
}: UpdateEventSponsorshipParams): Promise<
  ConnectedXMResponse<EventSponsorship>
> => {
  if (!sponsorshipId) throw new Error("Sponsorship ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<EventSponsorship>>(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships/${sponsorshipId}`,
    {
      ...sponsorship,
      id: undefined,
      event: undefined,
      eventId: undefined,
      createdAt: undefined,
      updatedAt: undefined,
      image: undefined,
    }
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIPS_QUERY_KEY(eventId, levelId),
    });
    SET_EVENT_SPONSORSHIP_QUERY_DATA(
      queryClient,
      [eventId, levelId, sponsorshipId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sponsorships
 */
export const useUpdateEventSponsorship = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSponsorship>>,
      Omit<UpdateEventSponsorshipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSponsorshipParams,
    Awaited<ReturnType<typeof UpdateEventSponsorship>>
  >(UpdateEventSponsorship, options, {
    domain: "events",
    type: "update",
  });
};
