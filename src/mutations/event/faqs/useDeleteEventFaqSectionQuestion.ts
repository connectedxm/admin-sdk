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
 * @category Params
 * @group Event-Faqs
 */
export interface DeleteEventFaqSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Faqs
 */
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

/**
 * @category Mutations
 * @group Event-Faqs
 */
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
