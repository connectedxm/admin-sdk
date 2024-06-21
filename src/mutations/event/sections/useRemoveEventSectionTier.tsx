import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationSection } from "@interfaces";
import { EVENT_SECTION_TIERS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSectionTiers";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface RemoveEventSectionTierParams {
  eventId: string;
  sectionId: string;
  tierId: string;
}

export const RemoveEventSectionTier = async ({
  eventId,
  sectionId,
  tierId,
}: RemoveEventSectionTierParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sections/${sectionId}/tiers/${tierId}`
  );
  return data;
};

export const useRemoveEventSectionTier = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (tierId: string) => RemoveEventSectionTier({ eventId, sectionId, tierId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSectionTier>>
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
    },
    undefined,
    true
  );
};

export default useRemoveEventSectionTier;
