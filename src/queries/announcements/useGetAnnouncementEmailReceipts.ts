import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";

import { EmailReceipt, EmailReceiptStatus } from "@src/interfaces";
import {
  InfiniteQueryParams,
  InfiniteQueryOptions,
  useConnectedInfiniteQuery,
} from "../useConnectedInfiniteQuery";
import { QueryClient } from "@tanstack/react-query";
import { ANNOUNCEMENT_QUERY_KEY } from "./useGetAnnouncement";

/**
 * @category Keys
 * @group Announcements
 */
export const ANNOUNCEMENT_EMAILS_QUERY_KEY = (
  announcementId: string,
  status?: keyof typeof EmailReceiptStatus
) => {
  const queryKey = [
    ...ANNOUNCEMENT_QUERY_KEY(announcementId),
    "EMAIL_RECEIPTS",
  ];

  if (status) {
    queryKey.push(status);
  }

  return queryKey;
};

/**
 * @category Setters
 * @group Announcements
 */
export const SET_ANNOUNCEMENT_EMAILS_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof ANNOUNCEMENT_EMAILS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncementEmailReceipts>>
) => {
  client.setQueryData(ANNOUNCEMENT_EMAILS_QUERY_KEY(...keyParams), response);
};

interface GetAnnouncementEmailReceiptsProps extends InfiniteQueryParams {
  announcementId: string;
  status?: keyof typeof EmailReceiptStatus;
}

/**
 * @category Queries
 * @group Announcements
 */
export const GetAnnouncementEmailReceipts = async ({
  announcementId,
  status,
  pageParam,
  pageSize,
  orderBy,
  search,
  adminApiParams,
}: GetAnnouncementEmailReceiptsProps): Promise<
  ConnectedXMResponse<EmailReceipt[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/announcements/${announcementId}/email-receipts`,
    {
      params: {
        page: pageParam || undefined,
        pageSize: pageSize || undefined,
        orderBy: orderBy || undefined,
        search: search || undefined,
        status: status || undefined,
      },
    }
  );
  return data;
};
/**
 * @category Hooks
 * @group Announcements
 */
export const useGetAnnouncementEmailReceipts = (
  announcementId: string = "",
  status?: keyof typeof EmailReceiptStatus,
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAnnouncementEmailReceipts>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAnnouncementEmailReceipts>>
  >(
    ANNOUNCEMENT_EMAILS_QUERY_KEY(announcementId, status),
    (params: InfiniteQueryParams) =>
      GetAnnouncementEmailReceipts({ announcementId, status, ...params }),
    params,
    {
      ...options,
      enabled: !!announcementId && (options.enabled ?? true),
    }
  );
};
