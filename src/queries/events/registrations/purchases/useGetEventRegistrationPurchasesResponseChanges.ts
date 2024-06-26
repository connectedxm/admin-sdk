import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationQuestionResponseChange } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../../useConnectedInfiniteQuery";
import { EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_KEY } from "./useGetEventRegistrationPurchaseResponse";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_REGISTRATION_PURCHASE_RESPONSE_CHANGES_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  questionId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_KEY(
    eventId,
    registrationId,
    purchaseId,
    questionId
  ),
  "CHANGES",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_REGISTRATION_PURCHASE_RESPONSE_CHANGES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<
    typeof EVENT_REGISTRATION_PURCHASE_RESPONSE_CHANGES_QUERY_KEY
  >,
  response: Awaited<
    ReturnType<typeof GetEventRegistrationPurchaseResponseChanges>
  >
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_RESPONSE_CHANGES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseResponseChangesProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questionId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRegistrationPurchaseResponseChanges = async ({
  eventId,
  registrationId,
  purchaseId,
  questionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventRegistrationPurchaseResponseChangesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponseChange[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses/${questionId}/changes`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRegistrationPurchaseResponseChanges = (
  eventId: string = "",
  registrationId: string = "",
  purchaseId: string = "",
  questionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseResponseChanges>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseResponseChanges>>
  >(
    EVENT_REGISTRATION_PURCHASE_RESPONSE_CHANGES_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId,
      questionId
    ),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationPurchaseResponseChanges({
        ...params,
        eventId,
        registrationId,
        questionId,
        purchaseId,
      }),
    params,
    {
      ...options,
      enabled:
        !!eventId &&
        !!registrationId &&
        !!questionId &&
        !!purchaseId &&
        (options.enabled ?? true),
    }
  );
};
