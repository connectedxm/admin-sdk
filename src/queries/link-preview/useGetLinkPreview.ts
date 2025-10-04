import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { LinkPreview } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group LinkPreviews
 */
export const LINK_PREVIEW_QUERY_KEY = (href: string) => ["LINK_PREVIEW", href];

/**
 * @category Setters
 * @group LinkPreviews
 */
export const SET_LINK_PREVIEW_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof LINK_PREVIEW_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetLinkPreview>>
) => {
  client.setQueryData(LINK_PREVIEW_QUERY_KEY(...keyParams), response);
};

interface GetLinkPreviewParams extends SingleQueryParams {
  href: string;
}

/**
 * @category Queries
 * @group LinkPreviews
 */
export const GetLinkPreview = async ({
  href,
  adminApiParams,
}: GetLinkPreviewParams): Promise<ConnectedXMResponse<LinkPreview>> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(`/link-preview`, {
    params: { href },
  });

  return data;
};

/**
 * @category Hooks
 * @group LinkPreviews
 */
export const useGetLinkPreview = (
  href: string = "",
  options: SingleQueryOptions<ReturnType<typeof GetLinkPreview>> = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetLinkPreview>>(
    LINK_PREVIEW_QUERY_KEY(href),
    (params: SingleQueryParams) => GetLinkPreview({ href, ...params }),
    {
      ...options,
      enabled: !!href && (options?.enabled ?? true),
    }
  );
};
