export interface PHVResult {
  offset: number;
  status: 'pre_phv' | 'phv' | 'post_phv';
  estimatedPHVAge: number;
}

export function estimatePHV(
  standingHeight: number, // in cm
  sittingHeight: number,  // in cm
  weight: number,         // in kg
  chronologicalAge: number, // in decimal years
  sex: 'male' | 'female'
): PHVResult {
  const legLength = standingHeight - sittingHeight;
  
  let offset = 0;
  
  if (sex === 'male') {
    offset = -9.236 + 
      (0.0002708 * (legLength * sittingHeight)) + 
      (-0.001663 * (chronologicalAge * legLength)) + 
      (0.007216 * (chronologicalAge * sittingHeight)) + 
      (0.02292 * (weight / standingHeight * 100));
  } else {
    offset = -9.376 + 
      (0.0001882 * (legLength * sittingHeight)) + 
      (0.0022 * (chronologicalAge * legLength)) + 
      (0.005841 * (chronologicalAge * sittingHeight)) + 
      (-0.002658 * (chronologicalAge * weight)) + 
      (0.07693 * (weight / standingHeight * 100));
  }

  const estimatedPHVAge = chronologicalAge - offset;
  
  let status: 'pre_phv' | 'phv' | 'post_phv' = 'phv';
  if (offset < -1) {
    status = 'pre_phv';
  } else if (offset > 1) {
    status = 'post_phv';
  }

  return {
    offset: Number(offset.toFixed(2)),
    status,
    estimatedPHVAge: Number(estimatedPHVAge.toFixed(2))
  };
}
