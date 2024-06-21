import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { RegistrationSection } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_SECTIONS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSections";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface UpdateEventSectionQuestionParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  sortOrder: number;
}

export const UpdateEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  sortOrder,
}: UpdateEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/sections/${sectionId}/questions/${questionId}`,
    { sortOrder }
  );
  return data;
};

export const useUpdateEventSectionQuestion = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation(
    ({ questionId, sortOrder }: { questionId: string; sortOrder: number }) =>
      UpdateEventSectionQuestion({ eventId, sectionId, questionId, sortOrder }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventSectionQuestion>>
      ) => {
        queryClient.invalidateQueries(EVENT_SECTIONS_QUERY_KEY(eventId));
        SET_EVENT_SECTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId],
          response
        );
      },
    }
  );
};

export default useUpdateEventSectionQuestion;
