import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTIONS_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSections";
import { useRouter } from "next/router";
import { EVENT_FAQ_SECTION_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSection";

interface DeleteEventFAQSectionParams {
  eventId: string;
  sectionId: string;
}

export const DeleteEventFAQSection = async ({
  eventId,
  sectionId,
}: DeleteEventFAQSectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/faqs/${sectionId}`
  );
  return data;
};

export const useDeleteEventFAQSection = (
  eventId: string,
  sectionId: string
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    () => DeleteEventFAQSection({ eventId, sectionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventFAQSection>>
      ) => {
        await router.push(`/events/${eventId}/faqs`);
        queryClient.invalidateQueries(EVENT_FAQ_SECTIONS_QUERY_KEY(eventId));
        queryClient.removeQueries(
          EVENT_FAQ_SECTION_QUERY_KEY(eventId, sectionId)
        );
      },
    }
  );
};

export default useDeleteEventFAQSection;
