import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { RegistrationSection } from "@interfaces";
import { EVENT_SECTION_QUESTIONS_QUERY_KEY } from "@context/queries/events/sections/useGetEventSectionQuestions";
import { SET_EVENT_SECTION_QUERY_DATA } from "@context/queries/events/sections/useGetEventSection";

interface RemoveEventSectionQuestionParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const RemoveEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
}: RemoveEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/sections/${sectionId}/questions/${questionId}`
  );
  return data;
};

export const useRemoveEventSectionQuestion = (
  eventId: string,
  sectionId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<string>(
    (questionId: string) =>
      RemoveEventSectionQuestion({ eventId, sectionId, questionId }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof RemoveEventSectionQuestion>>
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
    },
    undefined,
    true
  );
};

export default useRemoveEventSectionQuestion;
