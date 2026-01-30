import { GetAdminAPI } from "@src/AdminAPI";
import { EventSponsorshipLevel, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SPONSORSHIP_LEVELS_QUERY_KEY,
  SET_EVENT_SPONSORSHIP_LEVELS_QUERY_DATA,
} from "@src/queries/events/sponsorshipLevels/useGetEventSponsorshipLevels";

/**
 * @category Params
 * @group Event-SponsorshipLevels
 */
export interface ReorderEventSponsorshipLevelsParams extends MutationParams {
  eventId: string;
  levelIds: string[];
}

/**
 * @category Methods
 * @group Event-SponsorshipLevels
 */
export const ReorderEventSponsorshipLevels = async ({
  eventId,
  levelIds,
  adminApiParams,
  queryClient,
}: ReorderEventSponsorshipLevelsParams): Promise<
  ConnectedXMResponse<EventSponsorshipLevel[]>
> => {
  if (!eventId) throw new Error("Event ID is undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSponsorshipLevel[]>
  >(`/events/${eventId}/sponsorshipLevels/reorder`, {
    levelIds,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SPONSORSHIP_LEVELS_QUERY_KEY(eventId),
    });
    SET_EVENT_SPONSORSHIP_LEVELS_QUERY_DATA(queryClient, [eventId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-SponsorshipLevels
 */
export const useReorderEventSponsorshipLevels = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSponsorshipLevels>>,
      Omit<
        ReorderEventSponsorshipLevelsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSponsorshipLevelsParams,
    Awaited<ReturnType<typeof ReorderEventSponsorshipLevels>>
  >(ReorderEventSponsorshipLevels, options);
};
