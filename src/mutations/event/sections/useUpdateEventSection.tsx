import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SECTIONS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSections";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface UpdateEventSectionParams {
  eventId: string;
  sectionId: string;
  section: RegistrationSection;
}

export const UpdateEventSection = async ({
  eventId,
  sectionId,
  section,
}: UpdateEventSectionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await ConnectedXM();

  const { data } = await connectedXM.put(
    `/events/${eventId}/sections/${sectionId}`,
    {
      ...section,
      id: undefined,
      eventId: undefined,
      questions: undefined,
      eventTickets: undefined,
      accountTiers: undefined,
      _count: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateEventSection = (eventId: string, sectionId?: string) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<RegistrationSection>(
    (section: RegistrationSection) =>
      UpdateEventSection({
        eventId,
        sectionId: sectionId || section.id.toString(),
        section,
      }),
    {
      onSuccess: (response: Awaited<ReturnType<typeof UpdateEventSection>>) => {
        queryClient.invalidateQueries(EVENT_SECTIONS_QUERY_KEY(eventId));
        SET_EVENT_SECTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId || response.data?.id.toString()],
          response
        );
      },
    }
  );
};

export default useUpdateEventSection;
