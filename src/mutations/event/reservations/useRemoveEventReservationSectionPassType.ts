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
export interface RemoveEventReservationSectionPassTypeParams
  extends MutationParams {
  eventId: string;
  reservationSectionId: string;
  passTypeId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const RemoveEventReservationSectionPassType = async ({
  eventId,
  reservationSectionId,
  passTypeId,
  adminApiParams,
  queryClient,
}: RemoveEventReservationSectionPassTypeParams): Promise<
  ConnectedXMResponse<EventReservationSection>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
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
export const useRemoveEventReservationSectionPassType = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof RemoveEventReservationSectionPassType>>,
      Omit<
        RemoveEventReservationSectionPassTypeParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    RemoveEventReservationSectionPassTypeParams,
    Awaited<ReturnType<typeof RemoveEventReservationSectionPassType>>
  >(RemoveEventReservationSectionPassType, options, {
    domain: "events",
    type: "update",
  });
};
