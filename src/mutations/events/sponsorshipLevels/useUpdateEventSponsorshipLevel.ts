import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSponsorshipLevel } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSponsorshipLevelUpdateInputs } from "@src/params";
import { EVENT_SPONSORSHIP_LEVELS_QUERY_KEY } from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevels";
import { SET_EVENT_SPONSORSHIP_LEVEL_QUERY_DATA } from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevel";

/**
 * @category Params
 * @group Event-SponsorshipLevels
 */
export interface UpdateEventSponsorshipLevelParams extends MutationParams {
  eventId: string;
  levelId: string;
  sponsorshipLevel: EventSponsorshipLevelUpdateInputs;
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels
 */
export const UpdateEventSponsorshipLevel = async ({
  eventId,
  levelId,
  sponsorshipLevel,
  adminApiParams,
  queryClient,
}: UpdateEventSponsorshipLevelParams): Promise<
  ConnectedXMResponse<EventSponsorshipLevel>
> => {
  if (!levelId) throw new Error("Sponsorship Level ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSponsorshipLevel>
  >(`/events/${eventId}/sponsorshipLevels/${levelId}`, {
    ...sponsorshipLevel,
    id: undefined,
    event: undefined,
    eventId: undefined,
    createdAt: undefined,
    updatedAt: undefined,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId),
    });
    SET_EVENT_SPONSORSHIP_LEVEL_QUERY_DATA(
      queryClient,
      [eventId, levelId || data.data?.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-SponsorshipLevels
 */
export const useUpdateEventSponsorshipLevel = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSponsorshipLevel>>,
      Omit<UpdateEventSponsorshipLevelParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSponsorshipLevelParams,
    Awaited<ReturnType<typeof UpdateEventSponsorshipLevel>>
  >(UpdateEventSponsorshipLevel, options);
};
