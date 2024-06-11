import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventAddOn } from "@src/interfaces";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "../../../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "./useGetEventRegistrationPurchase";

export const EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
  "ADD_ONS",
];

export const SET_EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchaseAddOns>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseAddOnsProps extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetEventRegistrationPurchaseAddOns = async ({
  eventId,
  registrationId,
  purchaseId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventRegistrationPurchaseAddOnsProps): Promise<
  ConnectedXMResponse<EventAddOn[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/addOns`,
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

const useGetEventRegistrationPurchaseAddOns = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseAddOns>>
  >(
    EVENT_REGISTRATION_PURCHASE_ADD_ONS_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: InfiniteQueryParams) => GetEventRegistrationPurchaseAddOns(params),
    {
      eventId,
      registrationId,
      purchaseId,
    },
    {
      enabled: !!eventId && !!registrationId && !!purchaseId,
    }
  );
};

export default useGetEventRegistrationPurchaseAddOns;
