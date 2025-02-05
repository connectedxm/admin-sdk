import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTIONS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to update a question within a specific section of an event.
 * This function allows for modifying the sort order of a question in a designated event section.
 * It is intended for use in applications that manage event configurations and require dynamic updates to question arrangements.
 * @name UpdateEventSectionQuestion
 * @param {string} eventId - The id of the event
 * @param {string} sectionId - The id of the section
 * @param {string} questionId - The id of the question
 * @param {number} sortOrder - The sort order of the question
 * @version 1.2
 **/
export interface UpdateEventSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
  sortOrder: number;
}

export const UpdateEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  sortOrder,
  adminApiParams,
  queryClient,
}: UpdateEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.put<ConnectedXMResponse<RegistrationSection>>(
    `/events/${eventId}/sections/${sectionId}/questions/${questionId}`,
    {
      sortOrder,
    }
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

export const useUpdateEventSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof UpdateEventSectionQuestion>>,
      Omit<UpdateEventSectionQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    UpdateEventSectionQuestionParams,
    Awaited<ReturnType<typeof UpdateEventSectionQuestion>>
  >(UpdateEventSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};