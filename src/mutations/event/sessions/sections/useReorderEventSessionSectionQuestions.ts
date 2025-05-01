import { GetAdminAPI } from "@src/AdminAPI";
import {
  EventSessionSectionQuestion,
  ConnectedXMResponse,
} from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { SET_EVENT_SESSION_SECTION_QUESTIONS_QUERY_DATA } from "@src/queries";

/**
 * @category Params
 * @group Events
 */
export interface ReorderEventSessionSectionQuestionsParams
  extends MutationParams {
  eventId: string;
  sessionId: string;
  sectionId: string;
  questionIds: string[];
}

/**
 * @category Methods
 * @group Events
 */
export const ReorderEventSessionSectionQuestions = async ({
  eventId,
  sessionId,
  sectionId,
  questionIds,
  adminApiParams,
  queryClient,
}: ReorderEventSessionSectionQuestionsParams): Promise<
  ConnectedXMResponse<EventSessionSectionQuestion[]>
> => {
  if (!sectionId) throw new Error("Section ID Undefined");
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<EventSessionSectionQuestion[]>
  >(
    `/events/${eventId}/sessions/${sessionId}/sections/${sectionId}/questions/reorder`,
    {
      questionIds,
    }
  );

  if (queryClient && data.status === "ok") {
    SET_EVENT_SESSION_SECTION_QUESTIONS_QUERY_DATA(
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
export const useReorderEventSessionSectionQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderEventSessionSectionQuestions>>,
      Omit<
        ReorderEventSessionSectionQuestionsParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderEventSessionSectionQuestionsParams,
    Awaited<ReturnType<typeof ReorderEventSessionSectionQuestions>>
  >(ReorderEventSessionSectionQuestions, options, {
    domain: "events",
    type: "update",
  });
};
