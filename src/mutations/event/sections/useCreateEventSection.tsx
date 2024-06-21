import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";
import { EVENT_SECTIONS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSections";

interface CreateEventSectionParams {
  eventId: string;
  section: RegistrationSection;
}

export const CreateEventSection = async ({
  eventId,
  section,
}: CreateEventSectionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sections`,
    section
  );
  return data;
};

export const useCreateEventSection = (eventId: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationSection>(
    (section: RegistrationSection) => CreateEventSection({ eventId, section }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof CreateEventSection>>) => {
        queryClient.invalidateQueries(EVENT_SECTIONS_QUERY_KEY(eventId));
        SET_EVENT_SECTION_QUERY_DATA(
          queryClient,
          [eventId, response.data.id.toString()],
          response
        );
      },
    }
  );
};

export default useCreateEventSection;
