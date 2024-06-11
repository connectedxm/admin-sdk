import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import {
  RegistrationQuestion,
  RegistrationQuestionResponse,
} from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import useConnectedInfiniteQuery, {
  InfiniteQueryParams,
} from "@/context/queries/useConnectedInfiniteQuery";
import { EVENT_REGISTRATION_PURCHASE_QUERY_KEY } from "./useGetEventRegistrationPurchase";

export interface RegistrationQuestionWithResponse extends RegistrationQuestion {
  responses: RegistrationQuestionResponse[];
}

export const EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_QUERY_KEY(eventId, registrationId, purchaseId),
  "RESPONSES",
];

export const SET_EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchaseResponses>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseResponsesProps
  extends InfiniteQueryParams {
  eventId: string;
  registrationId: string;
  purchaseId: string;
}

export const GetEventRegistrationPurchaseResponses = async ({
  eventId,
  registrationId,
  purchaseId,
  pageParam,
  pageSize,
  orderBy,
  search,
}: GetEventRegistrationPurchaseResponsesProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses`,
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

const useGetEventRegistrationPurchaseResponses = (
  eventId: string,
  registrationId: string,
  purchaseId: string
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventRegistrationPurchaseResponses>>
  >(
    EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId
    ),
    (params: InfiniteQueryParams) =>
      GetEventRegistrationPurchaseResponses(params),
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

export default useGetEventRegistrationPurchaseResponses;
