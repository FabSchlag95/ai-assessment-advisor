export interface Criterion {
  name: string
  hint: string
  scale: string
}

export const criteria: Criterion[] = [
{
  'hint': 'The idea has the potential to become a scalable product or service having an impact in many partner countries.',
  'scale': '5 – High scalability with strong potential for widespread adoption across partner countries.\n4 – Good scalability prospects, applicable in multiple contexts or countries.\n3 – Some potential to scale, with minor adaptations needed.\n2 – Limited scalability; idea is context-specific or hard to replicate.\n1 – No potential for replication or broader impact.)',
  'name': 'Scalability'},
 {
  'hint': 'It is realistic and feasible to advance the idea within the accelerator with the given budget and suggested team.',
  'scale': '5 – Highly feasible; plan is solid, low-risk, and fits perfectly within resources and timeframe.\n4 – Realistic and achievable within the accelerator’s parameters.\n3 – Feasible but with some risks or dependencies.\n2 – Major feasibility concerns; requires significant changes or resources.\n1 – Not feasible with available budget, timeline, or team.)',
  'name': 'Feasibility'},
 {
  'hint': 'The proposal aligns with GIZ’s strategic goal to engage partners from civil society, academia, private, and public sectors, enhancing quality, innovation, and effectiveness of our service delivery.',
  'scale': '5 – Robust, well-established partnerships across sectors with strong collaboration, trust, and clear added value.\n4 – Strong partnerships with clear roles, mutual benefit, and engagement.\n3 – Some relevant partnerships identified, but roles or value are not well-defined.\n2 – Weak or unclear partnerships with minimal engagement potential.\n1 – No relevant partnerships mentioned or foreseen.)',
  'name': 'Partnership Engagement'},
 {
  'hint': 'It alleviates pain or increases gain for GIZ’s beneficiaries and considers the agenda of GIZ’s clients and partners.',
  'scale': '5 – Exceptional and compelling value that directly supports both GIZ beneficiaries and strategic partner goals.\n4 – Strong and specific value for end users, aligned with client and partner interests.\n3 – Clear value for GIZ beneficiaries, with some consideration of partner needs.\n2 – Limited value; benefits are vague or not well-articulated.\n1 – Unclear or no value for GIZ beneficiaries; does not consider partner agendas.)',
  'name': 'Value Proposition'},
 {
  'hint': 'It is realistic and feasible to advance the idea within the accelerator with the given budget and suggested team.',
  'scale': '5 – Outstanding team; highly motivated, diverse, experienced, and capable of delivering.\n4 – Strong team with complementary skills, experience, and clear motivation.\n3 – Competent team with relevant skills and moderate diversity.\n2 – Some relevant experience, but limited diversity or unclear commitment.\n1 – Team lacks relevant skills or motivation; major capacity gaps.)',
  'name': 'Team'},
 {
  'hint': 'It will solve a problem innovatively in comparison to existing solutions. It has a USP and an innovative approach.',
  'scale': '5 – Breakthrough innovation with a well-defined USP and a novel approach that sets a new standard.\n4 – Clearly innovative approach with strong differentiation from current solutions.\n3 – Some innovative elements with a moderately clear USP.\n2 – Minor improvements over existing ideas; lacks a unique selling point (USP).\n1 – No innovation; replicates existing solutions.)',
  'name': 'Innovativeness'}]


