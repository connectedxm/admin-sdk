import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { ChannelContent } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";

/**
 * Endpoint to retrieve a list of content items with optional filters for featured status, content type, and past events.
 * This function allows users to fetch content such as videos, audios, or articles, and filter them based on whether they are featured or past events.
 * It is designed to be used in applications where content needs to be dynamically loaded and filtered.
 * @name GetContents
 * @param {boolean} [featured] (query) - Optional flag to filter featured contents
 * @param {"video" | "audio" | "article"} [type] (query) - Optional type of content
 * @param {boolean} [past] (query) - Optional flag to filter past contents
 * @version 1.3
 **/

export const CONTENTS_QUERY_KEY = (
  featured?: boolean,
  type?: "video" | "audio" | "article",
  past?: boolean
) => {
  const keys = ["CONTENTS"];
  if (typeof featured === "boolean")
    keys.push(featured ? "FEATURED" : "NOT FEATURED");
  if (type) keys.push(type);
  if (typeof past === "boolean") keys.push(past ? "PAST" : "UPCOMING");
  return keys;
};

export const SET_CONTENTS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof CONTENTS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetContents>>
) => {
  client.setQueryData(CONTENTS_QUERY_KEY(...keyParams), response);
};

interface GetContentsProps extends InfiniteQueryParams {
  featured?: boolean;
  type?: "video" | "audio" | "article";
  past?: boolean;
}

export const GetContents = async ({
  featured,
  type,
  past,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetContentsProps): Promise<ConnectedXMResponse<ChannelContent[]>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/contents`, {
    params: {
      page: pageParam || undefined,
      pageSize: pageSize || undefined,
      orderBy: orderBy || undefined,
      search: search || undefined,
      featured,
      type: type || undefined,
      past,
    },
  });
  return data;
};

export const useGetContents = (
  featured?: boolean,
  type?: "video" | "audio" | "article",
  past?: boolean,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<Awaited<ReturnType<typeof GetContents>>> = {}
) => {
  return useConnectedInfiniteQuery<Awaited<ReturnType<typeof GetContents>>>(
    CONTENTS_QUERY_KEY(featured, type, past),
    (params: InfiniteQueryParams) =>
      GetContents({
        featured,
        type,
        past,
        ...params,
      }),
    params,
    options,
    "channels"
  );
};