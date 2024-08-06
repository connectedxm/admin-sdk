import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, RegistrationSection } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "@src/queries/useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "./useGetEventRegistrationPurchase";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
  "SECTIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchaseSections>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseSectionsProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventRegistrationPurchaseSections = async ({
  eventId,
  registrationId,
  purchaseId,
  adminApiParams,
}: GetEventRegistrationPurchaseSectionsProps): Promise<
  ConnectedXMResponse<RegistrationSection[]>
> => {
  const connectedXM = await GetAdminAPI(adminApiParams);
  const { data } = await connectedXM.get<
    ConnectedXMResponse<RegistrationSection[]>
  >(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/sections`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventRegistrationPurchaseSections = (
  eventId: string = "",
  registrationId: string = "",
  purchaseId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseSections>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseSections>>
  >(
    EVENT_REGISTRATION_PURCHASE_SECTIONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationPurchaseSections({
        ...params,
        eventId,
        registrationId,
        purchaseId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!registrationId && !!purchaseId,
    }
  );
};
