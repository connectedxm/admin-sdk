import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Faq } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionQuestionUpdateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update a specific question in the FAQ section of an event.
 * This function allows for the modification of a question within a specified FAQ section of an event.
 * It is designed to be used in scenarios where event organizers need to update the content of FAQ questions.
 * @name UpdateEventFaqSectionQuestion
 * @param {string} sectionId - The id of the FAQ section
 * @param {string} eventId - The id of the event
 * @param {string} questionId - The id of the question
 * @param {EventFaqSectionQuestionUpdateInputs} faq - The FAQ update inputs
 * @version 1.2
 **/
export interface UpdateEventFaqSectionQuestionParams extends MutationParams {
  sectionId: string;
  eventId: string;
  questionId: string;
  faq: EventFaqSectionQuestionUpdateInputs;
}

export const UpdateEventFaqSectionQuestion = async ({
  sectionId,
  eventId,
  questionId,
  faq,
  adminApiParams,
  queryClient,
}: UpdateEventFaqSectionQuestionParams): Promise<ConnectedXMResponse<Faq>> => {
  if (!questionId) throw new Error("questionId is required");
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<Faq>>(
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

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, questionId || data.data.id],
      data
    );
  }
  return data;
};

export const useUpdateEventFaqSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFaqSectionQuestion>>,
      Omit<
        UpdateEventFaqSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFaqSectionQuestionParams,
    Awaited<ReturnType<typeof UpdateEventFaqSectionQuestion>>
  >(UpdateEventFaqSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};