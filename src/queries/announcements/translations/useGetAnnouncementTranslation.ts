import { ConnectedXMResponse } from "@src/interfaces";
import { AnnouncementTranslation } from "@src/interfaces";
import { GetAdminAPI } from "@src/AdminAPI";
import {
  useConnectedSingleQuery,
  SingleQueryOptions,
  SingleQueryParams,
} from "@src/queries/useConnectedSingleQuery";
import { ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY } from "./useGetAnnouncementTranslations";

/**
 * @category Keys
 * @announcement Announcements
 */
export const ANNOUNCEMENT_TRANSLATION_QUERY_KEY = (
  announcementId: string,
  locale: string
) => [...ANNOUNCEMENT_TRANSLATIONS_QUERY_KEY(announcementId), locale];

/**
 * @category Setters
 * @announcement Announcements
 */
export const SET_ANNOUNCEMENT_TRANSLATION_QUERY_DATA = (
  client: any,
  keyParams: Parameters<typeof ANNOUNCEMENT_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetAnnouncementTranslation>>
) => {
  client.setQueryData(
    ANNOUNCEMENT_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetAnnouncementTranslationProps extends SingleQueryParams {
  announcementId: string;
  locale: string;
}

/**
 * @category Queries
 * @announcement Announcements
 */
export const GetAnnouncementTranslation = async ({
  announcementId,
  locale,
  adminApiParams,
}: GetAnnouncementTranslationProps): Promise<
  ConnectedXMResponse<AnnouncementTranslation | null>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/announcements/${announcementId}/translations/${locale}`
  );
  return data;
};
/**
 * @category Hooks
 * @announcement Announcements
 */
export const useGetAnnouncementTranslation = (
  announcementId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetAnnouncementTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetAnnouncementTranslation>>(
    ANNOUNCEMENT_TRANSLATION_QUERY_KEY(announcementId, locale),
    (params) =>
      GetAnnouncementTranslation({
        ...params,
        announcementId,
        locale,
      }),
    {
      ...options,
      enabled:
        !!announcementId &&
        !!locale &&
        locale !== "en" &&
        (options.enabled ?? true),
    }
  );
};
