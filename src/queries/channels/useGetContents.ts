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
 * @category Keys
 * @group Channels
 */
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

/**
 * @category Setters
 * @group Channels
 */
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

/**
 * @category Queries
 * @group Channels
 */
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

/**
 * @category Hooks
 * @group Channels
 */
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
    options
  );
};
