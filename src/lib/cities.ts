export const CITIES = [
  { key: 'mumbai', name: 'Mumbai', state: 'Maharashtra' },
  { key: 'delhi', name: 'Delhi', state: 'Delhi' },
  { key: 'bangalore', name: 'Bangalore', state: 'Karnataka' },
  { key: 'hyderabad', name: 'Hyderabad', state: 'Telangana' },
  { key: 'chennai', name: 'Chennai', state: 'Tamil Nadu' },
  { key: 'kolkata', name: 'Kolkata', state: 'West Bengal' },
  { key: 'pune', name: 'Pune', state: 'Maharashtra' },
  { key: 'ahmedabad', name: 'Ahmedabad', state: 'Gujarat' },
  { key: 'jaipur', name: 'Jaipur', state: 'Rajasthan' },
  { key: 'lucknow', name: 'Lucknow', state: 'Uttar Pradesh' },
  { key: 'chandigarh', name: 'Chandigarh', state: 'Chandigarh' },
  { key: 'bhopal', name: 'Bhopal', state: 'Madhya Pradesh' },
  { key: 'patna', name: 'Patna', state: 'Bihar' },
  { key: 'kochi', name: 'Kochi', state: 'Kerala' },
  { key: 'guwahati', name: 'Guwahati', state: 'Assam' },
  { key: 'bhubaneswar', name: 'Bhubaneswar', state: 'Odisha' },
  { key: 'indore', name: 'Indore', state: 'Madhya Pradesh' },
  { key: 'nagpur', name: 'Nagpur', state: 'Maharashtra' },
  { key: 'visakhapatnam', name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { key: 'coimbatore', name: 'Coimbatore', state: 'Tamil Nadu' },
] as const;

export type CityKey = (typeof CITIES)[number]['key'];
