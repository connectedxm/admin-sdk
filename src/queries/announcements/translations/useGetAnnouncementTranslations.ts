import { GetAdminAPI } from "@src/AdminAPI";
import { ConnectedXMResponse } from "@src/interfaces";
import { AnnouncementTranslation } from "@src/interfaces";
import {
  InfiniteQueryOptions,
  InfiniteQueryParams,
  useConnectedInfiniteQuery,
} from "../../useConnectedInfiniteQuery";
import { ANNOUNCEMENT_QUERY_KEY } from "../useGetAnnouncement";

/**
 * @category Keys
 * @announcement Announcements
 */
export const ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY = (announcementId: string) => [
  ...ANNOUNCEMENT_QUERY_KEY(announcementId),
  "TRANSLATIONS",
];

/**
 * @category Setters
 * @announcement Announcements
 */
export const SET_ANNOUNCEMENT_TRANSLATIONS_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncementTranslations>>
) => {
  client.setQueryData(
    ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY(...keyParams),
    response
  );
};

interface GetAnnouncementTranslationsProps extends InfiniteQueryParams {
  announcementId: string;
}

/**
 * @category Queries
 * @announcement Announcements
 */
export const GetAnnouncementTranslations = async ({
  pageParam,
  pageSize,
  orderBy,
  search,
  announcementId,
  adminApiParams,
}: GetAnnouncementTranslationsProps): Promise<
  ConnectedXMResponse<AnnouncementTranslation[]>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/announcements/${announcementId}/translations`,
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
/**
 * @category Hooks
 * @announcement Announcements
 */
export const useGetAnnouncementTranslations = (
  announcementId: string = "",
  params: Omit<
    InfiniteQueryParams,
    "pageParam" | "queryClient" | "adminApiParams"
  > = {},
  options: InfiniteQueryOptions<
    Awaited<ReturnType<typeof GetAnnouncementTranslations>>
  > = {}
) => {
  return useConnectedInfiniteQuery<
    Awaited<ReturnType<typeof GetAnnouncementTranslations>>
  >(
    ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY(announcementId),
    (params: InfiniteQueryParams) =>
      GetAnnouncementTranslations({
        ...params,
        announcementId,
      }),
    params,
    {
      ...options,
      enabled: !!announcementId && (options.enabled ?? true),
    },
    "announcements"
  );
};
