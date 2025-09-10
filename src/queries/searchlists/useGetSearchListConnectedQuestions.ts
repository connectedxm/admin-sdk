import { GetAdminAPI } from "@src/AdminAPI";
import {
  CursorQueryOptions,
  CursorQueryParams,
  useConnectedCursorQuery,
} from "../useConnectedCursorQuery";
import {
  ConnectedXMResponse,
  SearchListConnectedQuestion,
} from "@src/interfaces";
import { SEARCHLIST_QUERY_KEY } from "./useGetSearchList";
import { QueryClient } from "@tanstack/react-query";

/**
 * @category Keys
 * @group SearchLists
 */
export const SEARCHLIST_CONNECTED_QUESTIONS_QUERY_KEY = (
  searchListId: string,
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "adminApiParams"
  > = {}
) => [...SEARCHLIST_QUERY_KEY(searchListId), "CONNECTED_QUESTIONS", params];

/**
 * @category Setters
 * @group SearchLists
 */
export const SET_SEARCHLIST_CONNECTED_QUESTIONS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof SEARCHLIST_CONNECTED_QUESTIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetSearchListConnectedQuestions>>
) => {
  client.setQueryData(
    SEARCHLIST_CONNECTED_QUESTIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetSearchListConnectedQuestionsProps extends CursorQueryParams {
  searchListId: string;
}

/**
 * @category Queries
 * @group SearchLists
 */
export const GetSearchListConnectedQuestions = async ({
  searchListId,
  cursor,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetSearchListConnectedQuestionsProps): Promise<
  ConnectedXMResponse<SearchListConnectedQuestion[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/searchlists/${searchListId}/questions`,
    {
      params: {
        cursor,
        pageSize,
        orderBy,
        search,
      },
    }
  );
  return data;
};

/**
 * @category Hooks
 * @group SearchLists
 */
export const useGetSearchListConnectedQuestions = (
  searchListId: string = "",
  params: Omit<
    CursorQueryParams,
    "cursor" | "queryClient" | "adminApiParams"
  > = {},
  options: CursorQueryOptions<
    Awaited<ReturnType<typeof GetSearchListConnectedQuestions>>
  > = {}
) => {
  return useConnectedCursorQuery<
    Awaited<ReturnType<typeof GetSearchListConnectedQuestions>>
  >(
    SEARCHLIST_CONNECTED_QUESTIONS_QUERY_KEY(searchListId, params),
    (queryParams: CursorQueryParams) =>
      GetSearchListConnectedQuestions({ searchListId, ...queryParams }),
    params,
    {
      ...options,
      enabled: !!searchListId && (options?.enabled ?? true),
    },
    "events"
  );
};
