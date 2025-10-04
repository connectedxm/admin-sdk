import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSponsorship } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSponsorshipCreateInputs } from "@src/params";
import { EVENT_SPONSORSHIPS_QUERY_KEY } from "@src/queries/events/sponsorships/useGetEventSponsorships";
import { SET_EVENT_SPONSORSHIP_QUERY_DATA } from "@src/queries/events/sponsorships/useGetEventSponsorship";

/**
 * @category Params
 * @group Event-Sponsorships
 */
export interface CreateEventSponsorshipParams extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorship: EventSponsorshipCreateInputs;
}

/**
 * @category Methods
 * @group Event-Sponsorships
 */
export const CreateEventSponsorship = async ({
  eventId,
  levelId,
  sponsorship,
  adminApiParams,
  queryClient,
}: CreateEventSponsorshipParams): Promise<
  ConnectedXMResponse<EventSponsorship>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSponsorship>
  >(
    `/events/${eventId}/sponsorshipLevels/${levelId}/sponsorships`,
    sponsorship
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIPS_QUERY_KEY(eventId, levelId),
    });
    SET_EVENT_SPONSORSHIP_QUERY_DATA(
      queryClient,
      [eventId, levelId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sponsorships
 */
export const useCreateEventSponsorship = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSponsorship>>,
      Omit<CreateEventSponsorshipParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSponsorshipParams,
    Awaited<ReturnType<typeof CreateEventSponsorship>>
  >(CreateEventSponsorship, options);
};
