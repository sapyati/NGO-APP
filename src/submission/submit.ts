import { createNewStudent } from '@/api/newStudentApi';
import { createPayanaStudent } from '@/api/payanaApi';
import { createProfessionalStudent } from '@/api/professionalApi';
import { createPUCStudent } from '@/api/pucApi';
import { createPucFormat11Student } from '@/api/pucFormat11Api';
import { createSemiProfessionalStudent } from '@/api/semiProfessionalApi';
import { NormalizedApiResponse } from '@/api/transformers/normalizeApiResponse';
import { generateSubmissionId, error as logError, info as logInfo, truncateStack } from '@/diagnostics';
import { MAX_MESSAGE_LENGTH, SubmissionError } from '@/diagnostics/diagnosticTypes';
import { FormType } from '@/forms/shared/types';
import { SubmissionPayload } from './preparePayload';

function truncateMessage(msg?: string): string | undefined {
  if (!msg) return undefined;
  return msg.length > MAX_MESSAGE_LENGTH ? msg.slice(0, MAX_MESSAGE_LENGTH) : msg;
}

function getErrorCode(error: any): string {
  if (error?.code) return error.code;
  if (error?.response?.status) return `HTTP_${error.response.status}`;
  return 'SUBMISSION_ERROR';
}

export async function submitApplication(
  formType: FormType,
  payload: SubmissionPayload
): Promise<NormalizedApiResponse<any> & { submissionId?: string }> {
  const submissionId = generateSubmissionId();
  logInfo('submission', 'submission_started', { submissionId, formType });

  const keys = Array.from((payload as any).keys?.() ?? []);
  console.log(`[submitApplication] Starting submission for formType: ${formType}, fields: ${keys.length}`);
  // NOTE: Do NOT log the field values or payload contents — they may contain PII.

  try {
    let response;

    if (formType === 'professional') {
      response = await createProfessionalStudent(payload);
    } else if (formType === 'payana') {
      response = await createPayanaStudent(payload);
    } else if (formType === 'semiProfessional') {
      response = await createSemiProfessionalStudent(payload);
    } else if (formType === 'puc') {
      response = await createPUCStudent(payload);
    } else if (formType === 'pucFormat11') {
      response = await createPucFormat11Student(payload);
    } else if (formType === 'newStudent') {
      response = await createNewStudent(payload);
    } else {
      logError('submission', 'submission_failed', {
        submissionId, formType,
        errorCode: 'UNSUPPORTED_FORM_TYPE',
        message: `Unsupported form type: ${formType}`,
      });
      return {
        success: false,
        error: `Unsupported form type: ${formType}`,
        message: `Form type "${formType}" is not supported for submission`,
        submissionId,
      };
    }

    // The create*Student APIs normalize failures into { success: false } results
    // instead of throwing — only log success when the flag is actually true.
    if (response.success === false) {
      logError('submission', 'submission_failed', {
        submissionId,
        formType,
        errorCode: 'API_FAILURE',
        message: truncateMessage(response.error || response.message),
      });
    } else {
      logInfo('submission', 'submission_succeeded', { submissionId, formType });
    }
    return { ...response, submissionId };
  } catch (error: any) {
    logError('submission', 'submission_failed', {
      submissionId,
      formType,
      errorCode: getErrorCode(error),
      message: truncateMessage(error?.message),
      stack: truncateStack(error?.stack),
    });

    // Attach submissionId to the thrown error so the UI can surface it.
    const submissionError = new Error(
      error instanceof Error ? error.message : 'Submission failed'
    ) as SubmissionError;
    submissionError.submissionId = submissionId;
    submissionError.cause = error;
    throw submissionError;
  }
}
