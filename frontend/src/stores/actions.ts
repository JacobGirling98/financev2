import { createAction } from "@reduxjs/toolkit";

const FORM_OPTIONS = "formOptions";

export const ADD_DESCRIPTION = createAction<string | undefined>(`${FORM_OPTIONS}/addDescription`);