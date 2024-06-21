import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_SECTION_QUERY_KEY } from "@context/queries/events/sections/useGetEventSection";
import { EVENT_SECTIONS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSections";

interface DeleteEventSectionParams {
  eventId: string;
  sectionId: string;
}

export const DeleteEventSection = async ({
  eventId,
  sectionId,
}: DeleteEventSectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sections/${sectionId}`
  );
  return data;
};

export const useDeleteEventSection = (eventId: string, sectionId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useConnectedMutation(
    () => DeleteEventSection({ eventId, sectionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventSection>>
      ) => {
        await router.push(`/events/${eventId}/sections`);
        queryClient.invalidateQueries(EVENT_SECTIONS_QUERY_KEY(eventId));
        queryClient.removeQueries(EVENT_SECTION_QUERY_KEY(eventId, sectionId));
      },
    }
  );
};

export default useDeleteEventSection;
