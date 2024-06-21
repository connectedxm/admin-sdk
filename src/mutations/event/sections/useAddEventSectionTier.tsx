import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";
import { EVENT_SECTION_TIERS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSectionTiers";
import { RegistrationSection } from "@interfaces";

interface AddEventSectionTierParams {
  eventId: string;
  sectionId: string;
  tierId: string;
}

export const AddEventSectionTier = async ({
  eventId,
  sectionId,
  tierId,
}: AddEventSectionTierParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sections/${sectionId}/tiers/${tierId}`
  );
  return data;
};

export const useAddEventSectionTier = (eventId: string, sectionId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (tierId: string) => AddEventSectionTier({ eventId, sectionId, tierId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSectionTier>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SECTION_TIERS_QUERY_KEY(eventId, sectionId)
        );
        SET_EVENT_SECTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId],
          response
        );
      },
    }
  );
};

export default useAddEventSectionTier;
