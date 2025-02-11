import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY,
  EVENT_FAQ_SECTION_QUESTION_QUERY_KEY,
} from "@src/queries";

/**
 * Endpoint to delete a question from a specific FAQ section of an event.
 * This function allows the removal of a question from an event's FAQ section by specifying the event ID, section ID, and question ID.
 * It is useful for managing the content of FAQ sections within event management applications.
 * @name DeleteEventFaqSectionQuestion
 * @param {string} eventId (path) The id of the event
 * @param {string} sectionId (path) The id of the FAQ section
 * @param {string} questionId (path) The id of the question to be deleted
 * @version 1.3
 **/

export interface DeleteEventFaqSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const DeleteEventFaqSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: DeleteEventFaqSectionQuestionParams): Promise<ConnectedXMResponse<null>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/faqs/${sectionId}/questions/${questionId}`
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTION_QUERY_KEY(
        eventId,
        sectionId,
        questionId
      ),
    });
  }
  return data;
};

export const useDeleteEventFaqSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DeleteEventFaqSectionQuestion>>,
      Omit<
        DeleteEventFaqSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteEventFaqSectionQuestionParams,
    Awaited<ReturnType<typeof DeleteEventFaqSectionQuestion>>
  >(DeleteEventFaqSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};
