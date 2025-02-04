import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Faq } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_FAQ_SECTION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * Endpoint to reorder questions in a specific FAQ section of an event.
 * This function allows users to change the order of questions within a specified FAQ section for a given event.
 * It is useful for organizing FAQ content to improve clarity and accessibility for event participants.
 * @name ReorderEventFaqSectionQuestions
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the FAQ section
 * @param {string[]} questionIds - The ids of the questions to reorder
 * @version 1.2
 **/

export interface ReorderEventFaqSectionQuestionsParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionIds: string[];
}

export const ReorderEventFaqSectionQuestions = async ({
  eventId,
  sectionId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventFaqSectionQuestionsParams): Promise<
  ConnectedXMResponse<Faq[]>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<ConnectedXMResponse<Faq[]>>(
    `/events/${eventId}/faqs/${sectionId}/questions/reorder`,
    {
      questionIds,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_FAQ_SECTION_QUESTIONS_QUERY_DATA(
      queryClient,
      [eventId, sectionId],
      data
    );
  }
  return data;
};

export const useReorderEventFaqSectionQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventFaqSectionQuestions>>,
      Omit<
        ReorderEventFaqSectionQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventFaqSectionQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventFaqSectionQuestions>>
  >(ReorderEventFaqSectionQuestions, options, {
    domain: "events",
    type: "update",
  });
};