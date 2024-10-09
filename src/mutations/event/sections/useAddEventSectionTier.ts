import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TIERS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface AddEventSectionTierParams extends MutationParams {
  eventId: string;
  sectionId: string;
  tierId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const AddEventSectionTier = async ({
  eventId,
  sectionId,
  tierId,
  adminApiParams,
  queryClient,
}: AddEventSectionTierParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post(
    `/events/${eventId}/sections/${sectionId}/tiers/${tierId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TIERS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useAddEventSectionTier = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSectionTier>>,
      Omit<AddEventSectionTierParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSectionTierParams,
    Awaited<ReturnType<typeof AddEventSectionTier>>
  >(AddEventSectionTier, options, {
    domain: "events",
    type: "update",
  });
};
