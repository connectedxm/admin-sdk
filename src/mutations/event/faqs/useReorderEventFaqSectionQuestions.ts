import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Faq } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_FAQ_SECTION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface ReorderEventFaqSectionQuestionsParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Event-Sections
 */
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
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<ConnectedXMResponse<Faq[]>>(
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

/**
 * @category Mutations
 * @group Event-Sections
 */
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
  >(ReorderEventFaqSectionQuestions, options);
};
