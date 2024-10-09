import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, EventReservationSection } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTION_PASS_TYPES_QUERY_KEY,
  SET_EVENT_RESERVATION_SECTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface AddEventReservationSectionPassTypeParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const AddEventReservationSectionPassType = async ({
  eventId,
  reservationSectionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: AddEventReservationSectionPassTypeParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<EventReservationSection>
  >(
    `/events/${eventId}/reservationSections/${reservationSectionId}/passTypes/${passTypeId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTION_PASS_TYPES_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
    SET_EVENT_RESERVATION_SECTION_QUERY_DATA(
      queryClient,
      [eventId, reservationSectionId],
      data
    );
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useAddEventReservationSectionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AddEventReservationSectionPassType>>,
      Omit<
        AddEventReservationSectionPassTypeParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AddEventReservationSectionPassTypeParams,
    Awaited<ReturnType<typeof AddEventReservationSectionPassType>>
  >(AddEventReservationSectionPassType, options, {
    domain: "events",
    type: "update",
  });
};
