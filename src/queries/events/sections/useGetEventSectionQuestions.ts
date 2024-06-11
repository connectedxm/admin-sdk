import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { RegistrationSectionQuestion } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { EVENT_SECTION_QUERY_KEY } from "./useGetEventSection";

export const EVENT_SECTION_QUESTIONS_QUERY_KEY = (
  eventId: string,
  sectionId: string
) => [...EVENT_SECTION_QUERY_KEY(eventId, sectionId), "QUESTIONS"];

export const SET_EVENT_SECTION_QUESTIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof EVENT_SECTION_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventSectionQuestions>>
) => {
  client.setQueryData(
    EVENT_SECTION_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventSectionQuestionsProps extends InfiniteQueryParams {
  eventId: string;
  sectionId: string;
}

export const GetEventSectionQuestions = async ({
  eventId,
  sectionId,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetEventSectionQuestionsProps): Promise<
  ConnectedXMResponse<RegistrationSectionQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/sections/${sectionId}/questions`,
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

const useGetEventSectionQuestions = (
  eventId: string = "",
  sectionId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetEventSectionQuestions>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetEventSectionQuestions>>
  >(
    EVENT_SECTION_QUESTIONS_QUERY_KEY(eventId, sectionId),
    (params: InfiniteQueryParams) =>
      GetEventSectionQuestions({
        ...params,
        eventId,
        sectionId,
      }),
    params,
    {
      ...options,
      enabled: !!eventId && !!sectionId && (options.enabled ?? true),
    }
  );
};

export default useGetEventSectionQuestions;
