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
export interface RemoveEventSessionSectionQuestionParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Events
 */
export const RemoveEventSessionSectionQuestion = async ({
  eventId,
  sessionId,
  sectionId,
  questionId,
  adminApiParams,
  queryClient,
}: RemoveEventSessionSectionQuestionParams): Promise<
  ConnectedXMResponse<EventSessionSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
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
export const useRemoveEventSessionSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventSessionSectionQuestion>>,
      Omit<
        RemoveEventSessionSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSessionSectionQuestionParams,
    Awaited<ReturnType<typeof RemoveEventSessionSectionQuestion>>
  >(RemoveEventSessionSectionQuestion, options);
};
