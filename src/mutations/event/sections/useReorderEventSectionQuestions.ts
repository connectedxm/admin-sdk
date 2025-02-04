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
 * @category Params
 * @group Event-Sections
 */
export interface ReorderEventSectionQuestionsParams extends MutationParams {
  eventId: string;
  sectionId: string;
  questionIds: number[];
}

/**
 * @category Methods
 * @group Event-Sections
 */
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

/**
 * @category Mutations
 * @group Event-Sections
 */
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
