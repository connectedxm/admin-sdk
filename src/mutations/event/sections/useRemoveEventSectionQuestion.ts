import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to remove a question from a specific section of an event.
 * This function allows the removal of a question from a designated section within an event, 
 * ensuring that the event's structure is updated accordingly. It is useful in scenarios where 
 * event organizers need to dynamically manage the content of their event sections.
 * @name RemoveEventSectionQuestion
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the section
 * @param {string} questionId - The id of the question
 * @version 1.2
 **/
export interface RemoveEventSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const RemoveEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.delete<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/questions/${questionId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useRemoveEventSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionQuestion>>,
      Omit<RemoveEventSectionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionQuestionParams,
    Awaited<ReturnType<typeof RemoveEventSectionQuestion>>
  >(RemoveEventSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};