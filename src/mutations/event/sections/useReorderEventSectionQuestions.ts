import { GetAdminAPI } from "@src/AdminAPI";
import {
  RegistrationSectionQuestion,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SECTION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * Reorders questions within a specific section of an event.
 * This function allows for the rearrangement of questions in a designated section of an event, 
 * ensuring that the questions appear in the desired order. It is useful for event organizers 
 * who need to customize the sequence of questions for participants.
 * @name ReorderEventSectionQuestions
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the section
 * @param {number[]} questionIds - Array of question ids to reorder
 * @version 1.2
 **/

export interface ReorderEventSectionQuestionsParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionIds: number[];
}

export const ReorderEventSectionQuestions = async ({
  eventId,
  sectionId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventSectionQuestionsParams): Promise<
  ConnectedXMResponse<RegistrationSectionQuestion[]>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.put<
    ConnectedXMResponse<RegistrationSectionQuestion[]>
  >(`/events/${eventId}/sections/${sectionId}/questions/reorder`, {
    questionIds,
  });

  if (queryClient && data.status === "ok") {
    SET_EVENT_SECTION_QUESTIONS_QUERY_DATA(
      queryClient,
      [eventId, sectionId],
      data
    );
  }
  return data;
};

export const useReorderEventSectionQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSectionQuestions>>,
      Omit<ReorderEventSectionQuestionsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSectionQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventSectionQuestions>>
  >(ReorderEventSectionQuestions, options, {
    domain: "events",
    type: "update",
  });
};