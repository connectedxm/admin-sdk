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
 * Endpoint to add a question to a specific section of an event.
 * This function allows users to associate a question with a particular section within an event, 
 * facilitating the organization and management of event-related queries.
 * @name AddEventSectionQuestion
 * @param {string} eventId (path) - The id of the event
 * @param {string} sectionId (path) - The id of the section
 * @param {string} questionId (path) - The id of the question
 * @version 1.3
**/
export interface AddEventSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

export const AddEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: AddEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
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

export const useAddEventSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSectionQuestion>>,
      Omit<AddEventSectionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSectionQuestionParams,
    Awaited<ReturnType<typeof AddEventSectionQuestion>>
  >(AddEventSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};