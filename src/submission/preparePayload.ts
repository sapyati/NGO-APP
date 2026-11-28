import { MAX_TOTAL_UPLOAD_BYTES } from '@/constants/formOptions';
import { payanaMapper } from '@/forms/payana/mapper';
import { professionalMapper } from '@/forms/professional/mapper';
import { pucMapper } from '@/forms/puc/mapper';
import { newStudentMapper } from '@/forms/newStudent/mapper';
import { semiProfessionalMapper } from '@/forms/semiProfessional/mapper';
import { pucFormat11Mapper } from '@/forms/pucFormat11/mapper';
import { FormType } from '@/forms/shared/types';
import { NewStudentFormValues, PayanaFormValues, ProfessionalFormValues, PucFormValues, SemiProfessionalFormValues } from '@/types/forms';
import '@/utils/polyfillFormData';
import { formatBytes, getTotalUploadSizeBytes } from '@/utils/uploadSize';
import { PucFormat11FormValues } from '@/validation/pucFormat11Schemas';

export type SubmissionPayload = FormData;

export function preparePayload(
  formType: FormType,
  formData: ProfessionalFormValues | PucFormValues | PayanaFormValues | SemiProfessionalFormValues | NewStudentFormValues | any
): SubmissionPayload {
  console.log(`[preparePayload] Preparing payload for ${formType}`);
  console.log(`[preparePayload] Input formData keys:`, Object.keys(formData as any));

  // Fail fast: if combined attachments exceed what the backend accepts in one
  // request, the server would reject the submission with "Maximum request
  // length exceeded" — surface a clear local error instead.
  const totalUploadBytes = getTotalUploadSizeBytes((formData as any).documents);
  if (totalUploadBytes > MAX_TOTAL_UPLOAD_BYTES) {
    throw new Error(
      `Attachments total ${formatBytes(totalUploadBytes)} exceeds the ${formatBytes(MAX_TOTAL_UPLOAD_BYTES)} upload limit. ` +
      `Please remove or compress some files and try again.`
    );
  }

  let payload: FormData;

  if (formType === 'professional') {
    payload = professionalMapper(formData as ProfessionalFormValues);
  } else if (formType === 'semiProfessional') {
    payload = semiProfessionalMapper(formData as SemiProfessionalFormValues);
  } else if (formType === 'payana') {
    payload = payanaMapper(formData as PayanaFormValues);
  } else if (formType === 'newStudent') {
    payload = newStudentMapper(formData as NewStudentFormValues);
  } else if (formType === 'pucFormat11') {
    payload = pucFormat11Mapper(formData);
  } else {
    payload = pucMapper(formData as unknown as PucFormat11FormValues);
  }

  const keys = typeof (payload as any).keys === 'function' ? Array.from((payload as any).keys()) : [];
  console.log(`[preparePayload] Output payload contains ${keys.length} fields:`, keys);

  return payload;
}
