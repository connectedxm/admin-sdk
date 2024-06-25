import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_SECTION_TICKETS_QUERY_KEY,
  SET_EVENT_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Sections
 */
export interface RemoveEventSectionTicketParams extends MutationParams {
  eventId: string;
  sectionId: string;
  ticketId: string;
}

/**
 * @category Methods
 * @group Event-Sections
 */
export const RemoveEventSectionTicket = async ({
  eventId,
  sectionId,
  ticketId,
  adminApiParams,
  queryClient,
}: RemoveEventSectionTicketParams): Promise<
  ConnectedXMResponse<RegistrationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<RegistrationSection>
  >(`/events/${eventId}/sections/${sectionId}/tickets/${ticketId}`);
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_SECTION_TICKETS_QUERY_KEY(eventId, sectionId),
    });
    SET_EVENT_SECTION_QUERY_DATA(queryClient, [eventId, sectionId], data);
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Sections
 */
export const useRemoveEventSectionTicket = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof RemoveEventSectionTicket>>,
      Omit<RemoveEventSectionTicketParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventSectionTicketParams,
    Awaited<ReturnType<typeof RemoveEventSectionTicket>>
  >(RemoveEventSectionTicket, options);
};
