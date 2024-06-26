import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Faq } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Faqs
 */
export interface UpdateEventFAQSectionQuestionParams extends MutationParams {
  sectionId: string;
  eventId: string;
  questionId: string;
  faq: Faq;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const UpdateEventFAQSectionQuestion = async ({
  sectionId,
  eventId,
  questionId,
  faq,
  adminApiParams,
  queryClient,
}: UpdateEventFAQSectionQuestionParams): Promise<ConnectedXMResponse<Faq>> => {
  if (!questionId) throw new Error("questionId is required");
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<ConnectedXMResponse<Faq>>(
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

/**
 * @category Mutations
 * @group Event-Faqs
 */
export const useUpdateEventFAQSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventFAQSectionQuestion>>,
      Omit<
        UpdateEventFAQSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventFAQSectionQuestionParams,
    Awaited<ReturnType<typeof UpdateEventFAQSectionQuestion>>
  >(UpdateEventFAQSectionQuestion, options);
};
