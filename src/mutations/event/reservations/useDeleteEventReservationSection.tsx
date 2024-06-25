import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  MutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import {
  EVENT_RESERVATION_SECTIONS_QUERY_KEY,
  EVENT_RESERVATION_SECTION_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Event-Reservations
 */
export interface DeleteReservationSectionParams extends MutationParams {
  eventId: string;
  reservationSectionId: string;
}

/**
 * @category Methods
 * @group Event-Reservations
 */
export const DeleteReservationSection = async ({
  eventId,
  reservationSectionId,
  adminApiParams,
  queryClient,
}: DeleteReservationSectionParams): Promise<ConnectedXMResponse<null>> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<ConnectedXMResponse<null>>(
    `/events/${eventId}/reservationSections/${reservationSectionId}`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: EVENT_RESERVATION_SECTIONS_QUERY_KEY(eventId),
    });
    queryClient.removeQueries({
      queryKey: EVENT_RESERVATION_SECTION_QUERY_KEY(
        eventId,
        reservationSectionId
      ),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Event-Reservations
 */
export const useDeleteReservationSection = (
  options: Omit<
    MutationOptions<
      Awaited<ReturnType<typeof DeleteReservationSection>>,
      Omit<DeleteReservationSectionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DeleteReservationSectionParams,
    Awaited<ReturnType<typeof DeleteReservationSection>>
  >(DeleteReservationSection, options);
};
