import { GetAdminAPI } from "@src/AdminAPI";
import { BookingSpaceQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BOOKING_SPACE_QUESTIONS_QUERY_KEY } from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface ReorderBookingSpaceQuestionsParams extends MutationParams {
  placeId: string;
  spaceId: string;
  questionsIds: string[];
}

/**
 * @category Methods
 * @group Bookings
 */
export const ReorderBookingSpaceQuestions = async ({
  placeId,
  spaceId,
  questionsIds,
  adminApiParams,
  queryClient,
}: ReorderBookingSpaceQuestionsParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestion[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);

  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestion[]>
  >(`/bookings/places/${placeId}/spaces/${spaceId}/questions/reorder`, {
    questionsIds,
  });

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useReorderBookingSpaceQuestions = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof ReorderBookingSpaceQuestions>>,
      Omit<ReorderBookingSpaceQuestionsParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    ReorderBookingSpaceQuestionsParams,
    Awaited<ReturnType<typeof ReorderBookingSpaceQuestions>>
  >(ReorderBookingSpaceQuestions, options);
};
