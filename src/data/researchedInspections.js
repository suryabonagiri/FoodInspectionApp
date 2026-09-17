// Research snapshot, 2026-09-11. Secondary sources; not directly scraped from X.
const june27 = 'https://food.ndtv.com/news/food-safety-raids-at-3-hyderabad-restaurants-find-dead-cockroaches-open-drains-and-more-11698072'
const june22 = 'https://food.ndtv.com/news/houseflies-to-foul-odour-cyberabad-food-safety-teams-flag-hygiene-issues-at-hyderabad-restaurants-11674730'
const rows = [
  ['Shah Gouse Restaurant', 'Raidurg, Gachibowli Road', '2026-06-27', 65, ['Flies and poor kitchen sanitation', 'Unlabelled prepared food'], ['Staff used protective headwear'], 'Improvement notice reported', '@CMC_Offcl', june27],
  ['Mehfil Restaurant', 'Hitech City', '2026-06-27', null, ['Wet kitchen floors', 'Roti preparation in a construction area'], ['Staff used hairnets'], 'Improvement notice reported; construction-area preparation stopped', '@CMC_Offcl', june27],
  ['Ideal Kitchen', 'Madhapur', '2026-06-27', null, ['Cockroaches in batter', 'Insects in pulses', 'Missing health and water records'], ['Staff used protective clothing'], 'Improvement notice reported', '@CMC_Offcl', june27],
  ['Kanchi Cafe', 'Puppalaguda, Manikonda', '2026-06-22', 60, ['Mouldy cauliflower', 'Open waste bins', 'Unlabelled batter'], ['Displayed food licence'], 'Improvement notice reported', '@CMC_Offcl', june22],
  ['Kodikura Chittigare', 'Nallagandla', '2026-06-22', null, ['Unlabelled chicken and desserts', 'Overloaded chiller', 'Missing water reports'], [], 'Improvement notice reported', '@CMC_Offcl', june22],
  ['KFC (Devyani India Pvt. Ltd.)', 'Nizampet', '2026-06-20', null, ['Cooking-oil TPC exceeded permitted level', 'Unlabelled raw chicken', 'Expired licence among records'], ['Staff used hairnets'], '', '@CMC_Offcl', june22],
  ['Pancha Kattu Dosa', 'Nizampet', '2026-06-20', null, ['Greasy chimney', 'Broken tiles', 'Unlabelled syrups', 'Missing water and staff-health records'], [], 'Improvement notice reported', '@CMC_Offcl', june22],
  ['Dasara Restaurant', 'Nagole', '2026-07-03', 65, ['Slippery damaged flooring', 'Expired ingredients', 'Uncovered food and flies', 'Unclean refrigerator'], [], 'Notice issued; expired food discarded', '@MCMalkajgiri', 'https://hyderabadmail.com/food-safety-notice-dasara-restaurant-nagole-mmc-inspection/'],
  ["Lucky’s Kitchen & Family Restaurant", 'Old Malkajgiri', '2026-07-02', 69, ['Unhygienic kitchen', 'Uncovered food', 'Blocked drains', 'Expired ingredients and pests'], ['Displayed food licence', 'Staff used aprons and hairnets'], 'Improvement notice reported', '@MCMalkajgiri', 'https://munsifdaily.com/food-safety-inspection-at-luckys-kitchen/'],
  ['Vennela Food Court (Vennela Bakers and Chinese)', 'Saroornagar', '2026-07-27', null, ['No food licence reported', 'Food stored near drains', 'Broken eggs used', 'Poor staff hygiene'], [], 'Action initiated under food-safety legislation; exact measure unspecified', '@c_tgsafe', 'https://www.sotwe.com/c_tgsafe?lang=en']
]
const authorities = { '@CMC_Offcl': 'Cyberabad Municipal Corporation', '@MCMalkajgiri': 'Malkajgiri Municipal Corporation', '@c_tgsafe': 'TG SAFE' }
export const researchedInspections = rows.map(([restaurantName, location, inspectionDate, hygieneScore, observations, goodPractices, actionTaken, sourceHandle, sourceUrl], index) => ({
  importKey: `research-2026-09-11-${index + 1}`, restaurantName, location, inspectionDate, hygieneScore, observations, goodPractices, actionTaken, sourceHandle, sourceUrl,
  authority: authorities[sourceHandle], researchedAt: '2026-09-11', sourceType: index === 9 ? 'Indexed X mirror' : 'News report quoting inspection findings',
  verificationNote: 'Direct X access unavailable. Check the linked evidence and any subsequent updates before publishing. Blank fields were not established from the retrieved source.'
}))
