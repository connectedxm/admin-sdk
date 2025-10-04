import {
  SingleQueryOptions,
  SingleQueryParams,
  useConnectedSingleQuery,
} from "../../../useConnectedSingleQuery";
import { ConnectedXMResponse } from "@src/interfaces";
import { EventPackageTranslation } from "@src/interfaces";
import { QueryClient } from "@tanstack/react-query";
import { EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY } from "./useGetEventPackageTranslations";
import { GetAdminAPI } from "@src/AdminAPI";

/**
 * @category Keys
 * @group Events
 */
export const EVENT_PACKAGE_TRANSLATION_QUERY_KEY = (
  eventId: string,
  packageId: string,
  locale: string
) => [...EVENT_PACKAGE_TRANSLATIONS_QUERY_KEY(eventId, packageId), locale];

/**
 * @category Setters
 * @group Events
 */
export const SET_EVENT_PACKAGE_TRANSLATION_QUERY_DATA = (
  client: QueryClient,
  keyParams: Parameters<typeof EVENT_PACKAGE_TRANSLATION_QUERY_KEY>,
  response: Awaited<ReturnType<typeof GetEventPackageTranslation>>
) => {
  client.setQueryData(
    EVENT_PACKAGE_TRANSLATION_QUERY_KEY(...keyParams),
    response
  );
};

interface GetEventPackageTranslationProps extends SingleQueryParams {
  eventId: string;
  packageId: string;
  locale: string;
}

/**
 * @category Queries
 * @group Events
 */
export const GetEventPackageTranslation = async ({
  eventId,
  packageId,
  locale,
  adminApiParams,
}: GetEventPackageTranslationProps): Promise<
  ConnectedXMResponse<EventPackageTranslation>
> => {
  const adminApi = await GetAdminAPI(adminApiParams);
  const { data } = await adminApi.get(
    `/events/${eventId}/packages/${packageId}/translations/${locale}`
  );
  return data;
};

/**
 * @category Hooks
 * @group Events
 */
export const useGetEventPackageTranslation = (
  eventId: string = "",
  packageId: string = "",
  locale: string = "",
  options: SingleQueryOptions<
    ReturnType<typeof GetEventPackageTranslation>
  > = {}
) => {
  return useConnectedSingleQuery<ReturnType<typeof GetEventPackageTranslation>>(
    EVENT_PACKAGE_TRANSLATION_QUERY_KEY(eventId, packageId, locale),
    (params: SingleQueryParams) =>
      GetEventPackageTranslation({ eventId, packageId, locale, ...params }),
    {
      ...options,
      enabled:
        !!eventId && !!packageId && !!locale && (options?.enabled ?? true),
    }
  );
};
