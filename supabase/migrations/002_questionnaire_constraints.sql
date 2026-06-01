create unique index unique_question_response
on questionnaire_responses(
  user_id,
  questionnaire_type,
  question_key
);