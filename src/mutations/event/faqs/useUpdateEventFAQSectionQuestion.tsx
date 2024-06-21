import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { FAQ } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSectionQuestions";
import { SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA } from "@context/queries/events/faqs/useGetEventFAQSectionQuestion";

interface UpdateEventFAQSectionQuestionParams {
  sectionId: string;
  eventId: string;
  questionId: string;
  faq: FAQ;
}

export const UpdateEventFAQSectionQuestion = async ({
  sectionId,
  eventId,
  questionId,
  faq,
}: UpdateEventFAQSectionQuestionParams): Promise<ConnectedXMResponse<FAQ>> => {
  if (!questionId) throw new Error("questionId is required");
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.put(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}`,
    {
      ...faq,
      id: undefined,
      organizationId: undefined,
      eventId: undefined,
      sectionId: undefined,
      section: undefined,
      createdAt: undefined,
      updatedAt: undefined,
    }
  );
  return data;
};

export const useUpdateEventFAQSectionQuestion = (
  eventId: string,
  sectionId: string,
  questionId?: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<FAQ>(
    (faq: FAQ) =>
      UpdateEventFAQSectionQuestion({
        sectionId,
        eventId,
        questionId: questionId || faq.id,
        faq,
      }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof UpdateEventFAQSectionQuestion>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId)
        );
        SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId, questionId || response.data.id],
          response
        );
      },
    }
  );
};

export default useUpdateEventFAQSectionQuestion;
