import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventSessionSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_SESSION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface AddEventSessionSectionQuestionParams extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const AddEventSessionSectionQuestion = async ({
  eventId,
  sessionId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: AddEventSessionSectionQuestionParams): Promise<
  ConnectedXMResponse<EventSessionSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventSessionSection>
  >(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/questions/${questionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SESSION_SECTION_QUESTIONS_QUERY_KEY(
        eventId,
        sessionId,
        sectionId
      ),
    });
    SET_EVENT_SESSION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, sessionId, sectionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Events
 */
export const useAddEventSessionSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventSessionSectionQuestion>>,
      Omit<
        AddEventSessionSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventSessionSectionQuestionParams,
    Awaited<ReturnType<typeof AddEventSessionSectionQuestion>>
  >(AddEventSessionSectionQuestion, options);
};
