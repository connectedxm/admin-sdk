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
export interface CreateEventFAQSectionQuestionParams extends MutationParams {
  sectionId: string;
  eventId: string;
  faq: Faq;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
export const CreateEventFAQSectionQuestion = async ({
  sectionId,
  eventId,
  faq,
  adminApiParams,
  queryClient,
}: CreateEventFAQSectionQuestionParams): Promise<ConnectedXMResponse<Faq>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.post<ConnectedXMResponse<Faq>>(
    `/events/${eventId}/faqs/${sectionId}/questions`,
    faq
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, data.data.id],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Faqs
 */
export const useCreateEventFAQSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFAQSectionQuestion>>,
      Omit<
        CreateEventFAQSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFAQSectionQuestionParams,
    Awaited<ReturnType<typeof CreateEventFAQSectionQuestion>>
  >(CreateEventFAQSectionQuestion, options);
};
