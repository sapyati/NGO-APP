/**
 * PUC Format 1.1 Student API (After Login)
 * Handles Format 1.1 internal scholarship form API interactions.
 *
 * Create:     POST /api/puc-format1-1/create     (multipart/form-data)
 * Dropdowns:  GET  /api/puc-format1-1/dropdowns
 */

import api from './client';
import { normalizeApiError, normalizeApiResponse, NormalizedApiResponse } from './transformers/normalizeApiResponse';
import { NormalizedDropdowns, normalizePUCDropdowns } from './transformers/normalizeDropdowns';

const CREATE_URL = '/puc-format1-1/create';
const DROPDOWNS_URL = '/puc-format1-1/dropdowns';

/**
 * Creates a new PUC Format 1.1 student application
 * POST /api/puc-format1-1/create (multipart/form-data)
 */
export async function createPucFormat11Student(
  formData: FormData
): Promise<NormalizedApiResponse<any>> {
  try {
    const response = await api.post(CREATE_URL, formData);
    return normalizeApiResponse(response.data);
  } catch (error: any) {
    return normalizeApiError(error);
  }
}

/**
 * Gets PUC Format 1.1 dropdown data
 * GET /api/puc-format1-1/dropdowns
 */
export async function getPucFormat11Dropdowns(): Promise<
  NormalizedApiResponse<NormalizedDropdowns>
> {
  try {
    const response = await api.get(DROPDOWNS_URL);
    const dropdownData = response.data.Data || response.data;
    const normalizedDropdowns = normalizePUCDropdowns(dropdownData);

    return {
      success: true,
      data: normalizedDropdowns,
      message: response.data.Message || response.data.message || 'Success',
    };
  } catch (error: any) {
    return normalizeApiError(error);
  }
}
