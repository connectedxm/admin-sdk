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
 * @category Params
 * @group Event-Sections
 */
export interface CreateEventSectionParams extends MutationParams {
  eventId: string;
  section: EventSectionCreateInputs;
}

/**
 * @category Methods
 * @group Event-Sections
 */
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

/**
 * @category Mutations
 * @group Event-Sections
 */
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
