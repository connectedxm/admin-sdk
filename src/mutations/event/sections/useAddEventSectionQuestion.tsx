import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationSection } from "@interfaces";
import { EVENT_SECTION_QUESTIONS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSectionQuestions";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface AddEventSectionQuestionParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const AddEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
}: AddEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/sections/${sectionId}/questions/${questionId}`
  );
  return data;
};

export const useAddEventSectionQuestion = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (questionId: string) =>
      AddEventSectionQuestion({ eventId, sectionId, questionId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof AddEventSectionQuestion>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId)
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

export default useAddEventSectionQuestion;
