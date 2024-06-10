import { ConnectedXMResponse } from "@src/interfaces";
import useConnectedSingleQuery from "@src/queries/useConnectedSingleQuery";
import { RegistrationQuestionResponse } from "@src/interfaces";
import { EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY } from "./useGetEventRegistrationPurchaseResponses";

export const EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_KEY = (
  eventId: string,
  registrationId: string,
  purchaseId: string,
  questionId: string
) => [
  ...EVENT_REGISTRATION_PURCHASE_RESPONSES_QUERY_KEY(
    eventId,
    registrationId,
    purchaseId
  ),
  questionId,
];

export const SET_EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventRegistrationPurchaseResponse>>
) => {
  client.setQueryData(
    EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventRegistrationPurchaseResponseProps {
  eventId: string;
  registrationId: string;
  purchaseId: string;
  questionId: string;
}

export const GetEventRegistrationPurchaseResponse = async ({
  eventId,
  registrationId,
  purchaseId,
  questionId,
}: GetEventRegistrationPurchaseResponseProps): Promise<
  ConnectedXMResponse<RegistrationQuestionResponse>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/registrations/${registrationId}/purchases/${purchaseId}/responses/${questionId}`
  );
  return data;
};

const useGetEventRegistrationPurchaseResponse = (
  eventId: string,
  registrationId: string = "",
  purchaseId: string,
  questionId: string
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventRegistrationPurchaseResponse>>((
    EVENT_REGISTRATION_PURCHASE_RESPONSE_QUERY_KEY(
      eventId,
      registrationId,
      purchaseId,
      questionId
    ),
    () =>
      GetEventRegistrationPurchaseResponse({
        eventId,
        registrationId,
        purchaseId,
        questionId,
      }),
    {
      enabled: !!eventId && !!registrationId && !!questionId && !!purchaseId,
    }
  );
};

export default useGetEventRegistrationPurchaseResponse;
