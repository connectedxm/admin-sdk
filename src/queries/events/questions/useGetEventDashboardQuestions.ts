import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse, BaseRegistrationQuestion } from "@src/interfaces";
import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../useConnectedSingleQuery";
import { EVENT_QUERY_KEY } from "../useGetEvent";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_DASHBOARD_QUESTIONS_QUERY_KEY = (eventId: string) => [
  ...EVENT_QUERY_KEY(eventId),
  "DASHBOARD_QUESTIONS",
];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_DASHBOARD_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_DASHBOARD_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventDashboardQuestions>>
) => {
  client.setQueryData(
    EVENT_DASHBOARD_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventDashboardQuestionsProps extends SingleQueryParams {
  eventId: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventDashboardQuestions = async ({
  eventId,
  adminApiParams,
}: GetEventDashboardQuestionsProps): Promise<
  ConnectedXMResponse<BaseRegistrationQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/events/${eventId}/questions/dashboard`);
  return data;
};
/**
 * @category Hooks
 * @group Events
 */
export const useGetEventDashboardQuestions = (
  eventId: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventDashboardQuestions>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventDashboardQuestions>>(
    EVENT_DASHBOARD_QUESTIONS_QUERY_KEY(eventId),
    (params: SingleQueryParams) =>
      GetEventDashboardQuestions({
        ...params,
        eventId,
      }),
    {
      ...options,
      enabled: !!eventId && (options.enabled ?? true),
    }
  );
};
