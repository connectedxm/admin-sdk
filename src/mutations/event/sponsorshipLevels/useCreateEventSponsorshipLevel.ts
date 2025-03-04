import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSponsorshipLevel } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSponsorshipLevelCreateInputs } from "@src/params";
import { EVENT_SPONSORSHIP_LEVELS_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevels";
import { SET_EVENT_SPONSORSHIP_LEVEL_QUERY_DATA } from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevel";

/**
 * @category Params
 * @group Event-SponsorshipLevels
 */
export interface CreateEventSponsorshipLevelParams extends MutationParams {
  eventId: string;
  sponsorshipLevel: EventSponsorshipLevelCreateInputs;
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels
 */
export const CreateEventSponsorshipLevel = async ({
  eventId,
  sponsorshipLevel,
  adminApiParams,
  queryClient,
}: CreateEventSponsorshipLevelParams): Promise<
  ConnectedXMResponse<EventSponsorshipLevel>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSponsorshipLevel>
  >(`/events/${eventId}/sponsorshipLevels`, sponsorshipLevel);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId),
    });
    SET_EVENT_SPONSORSHIP_LEVEL_QUERY_DATA(
      queryClient,
      [eventId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-SponsorshipLevels
 */
export const useCreateEventSponsorshipLevel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSponsorshipLevel>>,
      Omit<CreateEventSponsorshipLevelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSponsorshipLevelParams,
    Awaited<ReturnType<typeof CreateEventSponsorshipLevel>>
  >(CreateEventSponsorshipLevel, options, {
    domain: "events",
    type: "update",
  });
};
