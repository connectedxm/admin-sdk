import { ConnectedXM, ConnectedXMResponse } from "src/context/api/ConnectedXM";
import useConnectedMutation from "../../useConnectedMutation";
import { FAQ } from "@interfaces";
import { useQueryClient } from "@tanstack/react-query";
import { EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY } from "@context/queries/events/faqs/useGetEventFAQSectionQuestions";
import { SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA } from "@context/queries/events/faqs/useGetEventFAQSectionQuestion";

interface CreateEventFAQSectionQuestionParams {
  sectionId: string;
  eventId: string;
  faq: FAQ;
}

export const CreateEventFAQSectionQuestion = async ({
  sectionId,
  eventId,
  faq,
}: CreateEventFAQSectionQuestionParams): Promise<ConnectedXMResponse<FAQ>> => {
  const connectedXM = await ConnectedXM();
  const { data } = await connectedXM.post(
    `/events/${eventId}/faqs/${sectionId}/questions`,
    faq
  );
  return data;
};

export const useCreateEventFAQSectionQuestion = (
  sectionId: string,
  eventId: string
) => {
  const queryClient = useQueryClient();

  return useConnectedMutation<FAQ>(
    (faq: FAQ) => CreateEventFAQSectionQuestion({ sectionId, eventId, faq }),
    {
      onSuccess: (
        response: Awaited<ReturnType<typeof CreateEventFAQSectionQuestion>>
      ) => {
        queryClient.invalidateQueries(
          EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId)
        );
        SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA(
          queryClient,
          [eventId, sectionId, response.data.id],
          response
        );
      },
    }
  );
};

export default useCreateEventFAQSectionQuestion;
