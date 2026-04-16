/**
 * SEO metadata configuration for all pages
 * Each page has unique title, description, and social media tags
 */

const BASE_URL = 'https://amednav.com';
const SITE_NAME = 'AMedNav™';

export const seoMetadata = {
  home: {
    title: 'AMedNav™',
    description: 'Get FREE medications through Patient Assistance Programs. Find help paying for specialty medications and prescriptions. Compare prices, copay foundations & grants. Created by patients, for patients.',
    canonical: `${BASE_URL}/`,
    ogTitle: 'Free Medication Help | AMedNav™',
    ogDescription: 'Find FREE medications for patients through Patient Assistance Programs. Get specialty medications at no cost. Compare prices, find copay foundations & grants. Created by patients, for patients.',
    twitterTitle: 'Free Medication Help | Medication Navigator',
    twitterDescription: 'Find FREE medications through Patient Assistance Programs. Compare prices, find copay foundations & grants for patients.',
    breadcrumbName: 'Home',
  },

  wizard: {
    title: 'My Path Quiz - Find Free Medication Help | AMedNav™',
    description: 'Take our free 2-minute quiz to find Patient Assistance Programs for your medications. Get personalized recommendations for free prescriptions and copay help based on your insurance and income.',
    canonical: `${BASE_URL}/wizard`,
    ogTitle: 'Find Your Path to Free Medications',
    ogDescription: 'Answer a few questions to get personalized recommendations for FREE medications through Patient Assistance Programs. Takes 2 minutes.',
    twitterTitle: 'My Path Quiz - Free Medication Finder',
    twitterDescription: 'Take our free quiz to discover Patient Assistance Programs for your medications. Personalized recommendations in 2 minutes.',
    breadcrumbName: 'My Path Quiz',
  },

  medications: {
    title: 'Search Medications & Prices | AMedNav™',
    description: 'Compare medication prices and find FREE assistance programs. Search specialty and everyday medications, find copay cards, PAPs, and foundation grants.',
    canonical: `${BASE_URL}/medications`,
    ogTitle: 'Search Medications - Compare Prices & Find Free Help',
    ogDescription: 'Search medications, compare retail prices, and find Patient Assistance Programs offering FREE medications.',
    twitterTitle: 'Search Medications & Find Free Help',
    twitterDescription: 'Compare prices and find FREE medication assistance for specialty and everyday medications.',
    breadcrumbName: 'Medications',
  },

  education: {
    title: 'Education & Resources for Patients | AMedNav™',
    description: 'Educational guides on medication coverage: Medicare Part D, Medicaid, insurance appeals, specialty pharmacies, the deductible trap, and copay foundation eligibility. Learn before you apply.',
    canonical: `${BASE_URL}/education`,
    ogTitle: 'Medication Education & Resources',
    ogDescription: 'Learn about Medicare, Medicaid, insurance coverage, specialty pharmacies, and how to avoid the deductible trap. Educational guides for patients.',
    twitterTitle: 'Medication Education Resources',
    twitterDescription: 'Educational guides on Medicare, insurance, specialty pharmacies and medication coverage for patients.',
    breadcrumbName: 'Education & Resources',
  },

  applicationHelp: {
    title: 'How to Apply for Medication Assistance | AMedNav™',
    description: 'Step-by-step guide to applying for Patient Assistance Programs. Learn what documents you need, how to complete applications, and get approval faster.',
    canonical: `${BASE_URL}/application-help`,
    ogTitle: 'Apply for Patient Assistance Programs',
    ogDescription: 'Complete guide to applying for medication assistance. Get templates, checklists, and step-by-step instructions for Patient Assistance Program applications.',
    twitterTitle: 'Patient Assistance Program Grants & Foundations',
    twitterDescription: 'Step-by-step guide to applying for Patient Assistance Programs. Learn what documents you need and how to get approval faster.',
    breadcrumbName: 'Grants & Foundations',
  },

  faq: {
    title: 'Frequently Asked Questions | AMedNav™',
    description: 'Find answers to common questions about Patient Assistance Programs, copay foundations, medication costs, and financial help for patients.',
    canonical: `${BASE_URL}/faq`,
    ogTitle: 'Medication Assistance FAQs',
    ogDescription: 'Get answers to common questions about medication assistance, Patient Assistance Programs, copay support, and financial help for patients.',
    twitterTitle: 'Medication Assistance FAQs',
    twitterDescription: 'Answers to common questions about Patient Assistance Programs, copay foundations, and financial help for patients.',
    breadcrumbName: 'FAQ',
  },

  notFound: {
    title: 'Page Not Found | AMedNav™',
    description: 'The page you are looking for could not be found. Visit our homepage to find medication assistance programs and resources for patients.',
    canonical: `${BASE_URL}/`,
    ogTitle: 'Page Not Found',
    ogDescription: 'This page could not be found. Visit AMedNav™ to find medication assistance programs for patients.',
    twitterTitle: 'Page Not Found',
    twitterDescription: 'This page could not be found. Visit our homepage to find medication assistance programs for patients.',
    breadcrumbName: 'Page Not Found',
  },

  forEmployers: {
    title: 'For Employers | AMedNav™',
    description: 'Reduce specialty drug costs for employees. Connect your workforce to copay cards, manufacturer assistance, and foundation support.',
    canonical: `${BASE_URL}/for-employers`,
    ogTitle: 'Employer Benefits for Medication Access',
    ogDescription: 'Help employees find medication assistance programs. Complement existing pharmacy benefits with free educational resources.',
    twitterTitle: 'For Employers',
    twitterDescription: 'Reduce specialty drug costs for employees with our medication assistance resource and free educational content.',
    breadcrumbName: 'For Employers',
  },

  forHospitalAdmin: {
    title: 'For Hospital Administrators | AMedNav\u2122',
    description: 'Improve patient outcomes, reduce readmissions, and strengthen CMS compliance. HIPAA-compliant medication assistance tool with Epic integration.',
    canonical: `${BASE_URL}/for-hospitals`,
    ogTitle: 'For Hospital Administrators & Care Coordinators',
    ogDescription: 'Protect patient outcomes by removing medication cost barriers. HIPAA-compliant, Epic-integrated tool supporting CMS documentation compliance.',
    twitterTitle: 'For Hospital Administrators',
    twitterDescription: 'Improve outcomes and reduce readmissions with a HIPAA-compliant medication assistance tool.',
    breadcrumbName: 'Hospitals',
  },

  forPayers: {
    title: 'For Payers | AMedNav™',
    description: 'Help members access manufacturer assistance programs for specialty medications. Reduce plan spend on high-cost drugs with our privacy-safe resource.',
    canonical: `${BASE_URL}/for-payers`,
    ogTitle: 'Payer Partnerships for Medication Assistance',
    ogDescription: 'Help members find manufacturer copay assistance and PAPs for specialty medications. Privacy-safe engagement tracking.',
    twitterTitle: 'For Payers',
    twitterDescription: 'Help members access manufacturer assistance programs for specialty medications.',
    breadcrumbName: 'For Payers',
  },

  pricing: {
    title: 'Pricing | AMedNav™',
    description: 'Free access to education, subscription options for patients, and partnership options for organizations. View our clear pricing.',
    canonical: `${BASE_URL}/pricing`,
    ogTitle: 'Clear Pricing',
    ogDescription: 'Free educational resources for all. Subscription and partnership options for patients and healthcare organizations.',
    twitterTitle: 'Pricing',
    twitterDescription: 'Free access to education, partnership options for organizations. View our clear pricing.',
    breadcrumbName: 'Pricing & Partners',
  },

  pilot: {
    title: 'Partner Pilot Program | AMedNav™',
    description: 'Welcome to the pilot program. Find medication assistance programs, search medications, and access verified financial resources.',
    canonical: `${BASE_URL}/pilot`,
    ogTitle: 'Partner Pilot Program',
    ogDescription: 'Your healthcare provider has partnered with us to help you find medication assistance programs.',
    twitterTitle: 'Partner Pilot Program',
    twitterDescription: 'Find medication assistance programs through your healthcare provider partnership.',
    breadcrumbName: 'Pilot Program',
  },

  termsAndConditions: {
    title: 'Terms and Conditions | AMedNav™',
    description: 'Read the Terms and Conditions for using the AMedNav website. Understand your rights, responsibilities, and our disclaimer about medical advice.',
    canonical: `${BASE_URL}/terms-and-conditions`,
    ogTitle: 'Terms and Conditions - AMedNav™',
    ogDescription: 'Terms and Conditions governing the use of AMedNav, an educational resource for patients and caregivers.',
    twitterTitle: 'Terms and Conditions',
    twitterDescription: 'Terms and Conditions for using AMedNav, an educational resource for patients.',
    breadcrumbName: 'Terms and Conditions',
  },

  privacyPolicy: {
    title: 'Privacy Policy | AMedNav™',
    description: 'Read our Privacy Policy to understand how AMedNav collects, uses, and protects your personal information.',
    canonical: `${BASE_URL}/privacy`,
    ogTitle: 'Privacy Policy - AMedNav™',
    ogDescription: 'Learn how AMedNav collects, uses, and safeguards your personal information.',
    twitterTitle: 'Privacy Policy',
    twitterDescription: 'Privacy Policy for AMedNav - how we collect, use, and protect your data.',
    breadcrumbName: 'Privacy Policy',
  },

  account: {
    title: 'My Account | AMedNav™',
    description: 'Manage your AMedNav account, view subscription status, and update billing information.',
    canonical: `${BASE_URL}/account`,
    ogTitle: 'My Account - AMedNav™',
    ogDescription: 'Manage your account and subscription for AMedNav.',
    twitterTitle: 'My Account',
    twitterDescription: 'Manage your AMedNav account and subscription.',
    breadcrumbName: 'My Account',
  },

  survey: {
    title: 'Share Your Journey | AMedNav™',
    description: 'Share your medication experience to help improve access for all patients. Anonymous surveys for anyone managing chronic conditions.',
    canonical: `${BASE_URL}/survey`,
    ogTitle: 'Share Your Medication Journey',
    ogDescription: 'Your experience can change the system. Take our anonymous survey to help improve medication access for patients everywhere.',
    twitterTitle: 'Share Your Journey',
    twitterDescription: 'Share your medication experience to help improve access for all patients. Anonymous surveys available.',
    breadcrumbName: 'Survey',
  },

  surveyGeneral: {
    title: 'General Medication Survey | AMedNav™',
    description: 'Share your experience managing medications for chronic conditions. Help us advocate for better medication access and affordability.',
    canonical: `${BASE_URL}/survey/general`,
    ogTitle: 'General Medication Survey',
    ogDescription: 'Share your medication experience. Your anonymous feedback helps advocate for better access and affordability.',
    twitterTitle: 'General Medication Survey',
    twitterDescription: 'Share your experience managing medications for chronic conditions.',
    breadcrumbName: 'General Survey',
  },

  myMedications: {
    title: 'My Medications | AMedNav™',
    description: 'Track your medications, renewal dates, and costs. Manage your medication list privately on your device with export and import options.',
    canonical: `${BASE_URL}/my-medications`,
    ogTitle: 'My Medications - Track Your Prescriptions',
    ogDescription: 'Track your medications, renewal dates, and costs. Manage your medication list privately on your device.',
    twitterTitle: 'My Medications',
    twitterDescription: 'Track your medications, renewal dates, and costs privately.',
    breadcrumbName: 'My Medications',
    noindex: true, // Private user feature - do not index in search engines
  },

  savingsTracker: {
    title: 'Savings Calculator | AMedNav™',
    description: 'Calculate how much you could save on medications with assistance programs. Track actual savings and see your total benefits over time.',
    canonical: `${BASE_URL}/savings-tracker`,
    ogTitle: 'Medication Savings Calculator',
    ogDescription: 'See how much you could save on medications with assistance programs. Calculate and track your actual savings.',
    twitterTitle: 'Savings Calculator',
    twitterDescription: 'Calculate how much you could save on medications with assistance programs.',
    breadcrumbName: 'Savings Calculator',
  },

  copayReminders: {
    title: 'Copay Card Reminders | AMedNav™',
    description: 'Never miss a copay card renewal. Track expiration dates for manufacturer copay cards and patient assistance programs. Get reminders before your cards expire.',
    canonical: `${BASE_URL}/copay-reminders`,
    ogTitle: 'Copay Card Reminders - Never Miss a Renewal',
    ogDescription: 'Track copay card expiration dates and get reminders before they expire. Keep your medication assistance programs active.',
    twitterTitle: 'Copay Card Reminders',
    twitterDescription: 'Never miss a copay card renewal. Track expiration dates and get reminders.',
    breadcrumbName: 'Copay Reminders',
  },

  subscribe: {
    title: 'Subscribe to Pro | AMedNav™',
    description: 'Unlock unlimited features with a Pro subscription. Save medications, track savings, and get personalized assistance recommendations.',
    canonical: `${BASE_URL}/subscribe`,
    ogTitle: 'Subscribe to Pro - Unlock All Features',
    ogDescription: 'Get unlimited access to My Path Quiz, medication tracking, savings calculator, and more with a Pro subscription.',
    twitterTitle: 'Subscribe to Pro',
    twitterDescription: 'Unlock unlimited features with a AMedNav Pro subscription.',
    breadcrumbName: 'Subscribe',
  },

  subscribeSuccess: {
    title: 'Welcome to Pro! | AMedNav™',
    description: 'Your Pro subscription is now active. Enjoy unlimited access to all AMedNav features.',
    canonical: `${BASE_URL}/subscribe/success`,
    ogTitle: 'Welcome to Pro!',
    ogDescription: 'Your subscription is active. Enjoy unlimited access to all AMedNav features.',
    twitterTitle: 'Welcome to Pro!',
    twitterDescription: 'Your Pro subscription is now active. Enjoy all features.',
    breadcrumbName: 'Subscription Success',
  },

  subscribeCancel: {
    title: 'Subscription Cancelled | AMedNav™',
    description: 'Your subscription checkout was cancelled. You can still use all free features of AMedNav.',
    canonical: `${BASE_URL}/subscribe/cancel`,
    ogTitle: 'Subscription Cancelled',
    ogDescription: 'Checkout cancelled. You can still use all free features including medication search and educational resources.',
    twitterTitle: 'Subscription Cancelled',
    twitterDescription: 'Checkout cancelled. Continue using free features anytime.',
    breadcrumbName: 'Subscription Cancelled',
  },

  accessibility: {
    title: 'Accessibility & Section 504 Compliance | AMedNav™',
    description: 'HHS Section 504 compliance, WCAG 2.1 Level AA conformance, non-discrimination notice, and grievance procedure for AMedNav. Our commitment to accessibility for all users.',
    canonical: `${BASE_URL}/accessibility`,
    ogTitle: 'Accessibility & Section 504 Compliance - AMedNav™',
    ogDescription: 'Section 504 non-discrimination notice, accessibility features, WCAG 2.1 AA conformance, and grievance procedure for AMedNav.',
    twitterTitle: 'Accessibility & Section 504 Compliance',
    twitterDescription: 'Section 504 compliance, WCAG 2.1 AA conformance, and accessibility features for AMedNav.',
    breadcrumbName: 'Accessibility & Section 504',
  },
};

/**
 * Helper function to get metadata for a specific page
 * @param {string} page - Page key (home, wizard, medications, etc.)
 * @returns {Object} Meta tag configuration
 */
export function getPageMetadata(page) {
  return seoMetadata[page] || seoMetadata.home;
}
