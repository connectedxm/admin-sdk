import { GetAdminAPI } from "@src/AdminAPI";
import { RegistrationSection, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { EventSectionCreateInputs } from "@src/params";
import {
  EVENT_SECTIONS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * Creates a new section for a specific event and updates the query client with the new data.
 * This function is used to add a new section to an event, allowing for dynamic updates and management of event sections.
 * It ensures that the query client is updated with the latest data, maintaining consistency across the application.
 * @name CreateEventSection
 * @param {string} eventId (path) - The id of the event
 * @param {EventSectionCreateInputs} section (body) - The inputs for creating the event section
 * @version 1.3
 **/
export interface CreateEventSectionParams extends MutationParams {
  eventId: string;
  section: EventSectionCreateInputs;
}

export const CreateEventSection = async ({
  eventId,
  section,
  adminApiParams,
  queryClient,
}: CreateEventSectionParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.post<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections`, section);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTIONS_QUERY_KEY(eventId),
    });
    SET_EVENT_SECTION_QUERY_DATA(
      queryClient,
      [eventId, data.data.id.toString()],
      data
    );
  }
  return data;
};

export const useCreateEventSection = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateEventSection>>,
      Omit<CreateEventSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateEventSectionParams,
    Awaited<ReturnType<typeof CreateEventSection>>
  >(CreateEventSection, options, {
    domain: "events",
    type: "update",
  });
};