import { GetAdminAPI } from "@src/AdminAPI";
import {
  ConnectedXMMutationOptions,
  MutationParams,
  useConnectedMutation,
} from "@src/mutations/useConnectedMutation";
import { BookingSpaceQuestion, ConnectedXMResponse } from "@src/interfaces";
import {
  BOOKING_SPACE_QUESTION_QUERY_KEY,
  SEARCHLIST_QUERY_KEY,
} from "@src/queries";
import { AttachSearchListInputs } from "@src/params";

/**
 * @category Params
 * @group Bookings
 */
export interface AttachBookingSpaceQuestionSearchListParams
  extends MutationParams {
  placeId: string;
  spaceId: string;
  questionId: string;
  searchList: AttachSearchListInputs;
}

/**
 * @category Methods
 * @group Bookings
 */
export const AttachBookingSpaceQuestionSearchList = async ({
  placeId,
  spaceId,
  questionId,
  searchList,
  adminApiParams,
  queryClient,
}: AttachBookingSpaceQuestionSearchListParams): Promise<
  ConnectedXMResponse<BookingSpaceQuestion>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.put<
    ConnectedXMResponse<BookingSpaceQuestion>
  >(
    `/bookings/places/${placeId}/spaces/${spaceId}/questions/${questionId}/searchlist`,
    searchList
  );
  if (queryClient && data.status === "ok") {
    queryClient.invalidateQueries({
      queryKey: BOOKING_SPACE_QUESTION_QUERY_KEY(placeId, spaceId, questionId),
    });
    queryClient.invalidateQueries({
      queryKey: SEARCHLIST_QUERY_KEY(searchList.searchListId),
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
export const useAttachBookingSpaceQuestionSearchList = (
  options: Omit<
    ConnectedXMMutationOptions<
      Awaited<ReturnType<typeof AttachBookingSpaceQuestionSearchList>>,
      Omit<
        AttachBookingSpaceQuestionSearchListParams,
        "queryClient" | "adminApiParams"
      >
    >,
    "mutationFn"
  > = {}
) => {
  return useConnectedMutation<
    AttachBookingSpaceQuestionSearchListParams,
    Awaited<ReturnType<typeof AttachBookingSpaceQuestionSearchList>>
  >(AttachBookingSpaceQuestionSearchList, options);
};
