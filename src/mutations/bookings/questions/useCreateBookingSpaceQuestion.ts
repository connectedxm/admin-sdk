import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, BookingSpaceQuestion } from "@src/interfaces";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestionCreateInputs } from "@src/params";
import {
  BOOKING_SPACE_QUESTIONS_QUERY_KEY,
  SET_BOOKING_SPACE_QUESTION_QUERY_DATA,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface CreateBookingSpaceQuestionParams extends MutationParams {
  placeId: string;
  spaceId: string;
  question: BookingSpaceQuestionCreateInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const CreateBookingSpaceQuestion = async ({
  placeId,
  spaceId,
  question,
  adminApiParams,
  queryClient,
}: CreateBookingSpaceQuestionParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.post<
    ConnectedXMResponse<BookingSpaceQuestion>
  >(`/bookings/places/${placeId}/spaces/${spaceId}/questions`, question);

  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTIONS_QUERY_KEY(placeId, spaceId),
    });
    if (data.data?.id) {
      SET_BOOKING_SPACE_QUESTION_QUERY_DATA(
        queryClient,
        [placeId, spaceId, data.data.id],
        data
      );
    }
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useCreateBookingSpaceQuestion = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof CreateBookingSpaceQuestion>>,
      Omit<CreateBookingSpaceQuestionParams, "queryClient" | "adminApiParams">
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    CreateBookingSpaceQuestionParams,
    Awaited<ReturnType<typeof CreateBookingSpaceQuestion>>
  >(CreateBookingSpaceQuestion, options);
};
