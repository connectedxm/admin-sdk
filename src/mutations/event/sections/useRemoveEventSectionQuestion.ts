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
 * @category Params
 * @group Event-Sections
 */
export interface RemoveEventSectionQuestionParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const RemoveEventSectionQuestion = async ({
  eventId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionQuestionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
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

/**
 * @category Mutations
 * @group Event-Sections
 */
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
