export function flattenComponent(row) {
  const { specs, created_at, use_cases, model_url, spec_approx, has_model, ...rest } = row
  return {
    ...rest,                   
    useCases:   use_cases,
    modelPath:  model_url,
    specApprox: spec_approx,
    hasModel:   has_model,
    ...specs,                  
  }
}