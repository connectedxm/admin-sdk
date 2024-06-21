import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSectionQuestions";
import { EVENT_FAQ_SECTION_QUESTION_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSectionQuestion";

interface DeleteEventFAQSectionQuestionParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const DeleteEventFAQSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
}: DeleteEventFAQSectionQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.delete(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}`
  );
  return data;
};

export const useDeleteEventFAQSectionQuestion = (
  eventId: string,
  sectionId: string,
  questionId: string
) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useConnectedMutation<any>(
    () => DeleteEventFAQSectionQuestion({ eventId, sectionId, questionId }),
    {
      onSuccess: async (
        _response: Awaited<ReturnType<typeof DeleteEventFAQSectionQuestion>>
      ) => {
        await router.push(`/events/${eventId}/faqs/${sectionId}/questions`);
        queryClient.invalidateQueries(
          EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId)
        );
        queryClient.removeQueries(
          EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(eventId, sectionId, questionId)
        );
      },
    }
  );
};

export default useDeleteEventFAQSectionQuestion;
