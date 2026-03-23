import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  BOOKING_SPACE_QUESTION_QUERY_KEY,
  SEARCHLISTS_QUERY_KEY,
} from "@src/queries";

/**
 * @category Params
 * @group Bookings
 */
export interface DetachBookingSpaceQuestionSearchListParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
}

/**
 * @category Methods
 * @group Bookings
 */
export const DetachBookingSpaceQuestionSearchList = async ({
  placeId,
  spaceId,
  questionId,
  adminApiParams,
  queryClient,
}: DetachBookingSpaceQuestionSearchListParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.delete<
    ConnectedXMResponse<BookingSpaceQuestion>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/searchlist`
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SEARCHLISTS_QUERY_KEY(),
    });
    queryClient.invalidateQueries({
      predicate: (query) => {
        return query.queryKey[0] === "SEARCHLIST_VALUES";
      },
    });
  }
  return data;
};

/**
 * @category Mutations
 * @group Bookings
 */
export const useDetachBookingSpaceQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof DetachBookingSpaceQuestionSearchList>>,
      Omit<
        DetachBookingSpaceQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    DetachBookingSpaceQuestionSearchListParams,
    Awaited<ReturnType<typeof DetachBookingSpaceQuestionSearchList>>
  >(DetachBookingSpaceQuestionSearchList, options);
};
