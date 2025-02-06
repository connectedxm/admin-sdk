import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, Faq } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventFaqSectionQuestionCreateInputs } from "@src/params";
import {
  EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY,
  SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * Endpoint to create a new question for a specific FAQ section in an event.
 * This function allows users to add a question to an existing FAQ section within a specified event.
 * It is designed to facilitate the management of FAQ sections by enabling the addition of new questions.
 * @name CreateEventFaqSectionQuestion
 * @param {string} sectionId (path) - The id of the FAQ section
 * @param {string} eventId (path) - The id of the event
 * @param {EventFaqSectionQuestionCreateInputs} faq (body) - The inputs for creating the FAQ section question
 * @version 1.3
 **/

export interface CreateEventFaqSectionQuestionParams extends MutationParams {
  sectionId: string;
  eventId: string;
  faq: EventFaqSectionQuestionCreateInputs;
}

export const CreateEventFaqSectionQuestion = async ({
  sectionId,
  eventId,
  faq,
  adminApiParams,
  queryClient,
}: CreateEventFaqSectionQuestionParams): Promise<ConnectedXMResponse<Faq>> => {
  const adminApi = await GetAdminAPI(adminApiParams);

  const { data } = await adminApi.post<ConnectedXMResponse<Faq>>(
    `/events/${eventId}/faqs/${sectionId}/questions`,
    faq
  );

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_FAQ_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_FAQ_SECTION_QUESTION_QUERY_DATA(
      queryClient,
      [eventId, sectionId, data.data.id],
      data
    );
  }
  return data;
};

export const useCreateEventFaqSectionQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventFaqSectionQuestion>>,
      Omit<
        CreateEventFaqSectionQuestionParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventFaqSectionQuestionParams,
    Awaited<ReturnType<typeof CreateEventFaqSectionQuestion>>
  >(CreateEventFaqSectionQuestion, options, {
    domain: "events",
    type: "update",
  });
};