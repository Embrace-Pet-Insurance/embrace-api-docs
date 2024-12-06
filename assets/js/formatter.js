 // json formatter
 const quoteResponseJson = 
 {
     "quoteId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
     "policyStartDate": "2021-07-31T00:00:00Z",
     "contact": {
       "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
       "ratingZipCode": "90210",
       "email": "string",
       "phoneNumber": "string",
       "brand": "string",
       "isMilitary": true,
       "senderId": "string"
     },
     "quoteNumber": "string",
     "premiumSummary": {
       "paymentFrequency": "Monthly",
       "insurancePremium": 37.41,
       "totalDiscounts": 0,
       "wellnessPremium": 37.41,
       "stateTaxes": 0,
       "monthlyBillingFee": 1,
       "monthlyPremium": 38.41,
       "paymentDueRecurring": 0,
       "oneTimeEnrollmentFee": 25,
       "paymentDueToday": 0,
       "quoteLinkUrl": "string",
       "eligibleForMilitaryDiscount": true
     },
     "fullQuotePets": [
       {
         "name": "Zeus",
         "breedId": 1,
         "gender": "Male",
         "age": "SixWeeksToTwelveMonths",
         "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
         "breedName": "string",
         "species": "Dog",
         "coverage": {
           "annualDeductible": "OneHundred",
           "annualDeductibleDisplay": "string",
           "annualReimbursementLimit": "FiveThousand",
           "annualReimbursementLimitDisplay": "string",
           "annualWellnessReward": "None",
           "annualWellnessRewardDisplay": "string",
           "examFeeCoverage": true,
           "drugDentalCoverage": true,
           "illnessPremium": 0,
           "insuranceType": "string",
           "options": {
             "annualDeductibles": [
               {
                 "isMostPopular": true,
                 "display": "string",
                 "isSelected": true,
                 "annualDeductible": "OneHundred"
               }
             ],
             "annualReimbursements": [
               {
                 "isMostPopular": true,
                 "display": "string",
                 "isSelected": true,
                 "annualReimbursementLimit": "FiveThousand"
               }
             ],
             "annualWellnessRewards": [
               {
                 "isMostPopular": true,
                 "display": "string",
                 "isSelected": true,
                 "annualWellnessReward": "None"
               }
             ],
             "reimbursementPercentages": [
               {
                 "isMostPopular": true,
                 "display": "string",
                 "isSelected": true,
                 "reimbursementPercentage": "Seventy"
               }
             ]
           },
           "reimbursementPercentage": "Seventy",
           "reimbursementPercentageDisplay": "string",
           "totalPremium": 0,
           "wellnessPremium": 0,
           "eligibleForWellness": true,
           "productName": "Embrace"
         }
       }
     ],
     "rateShopQuoteResults": [
       {
         "coverageSelection": {
           "reimbursementPercentage": "Seventy",
           "annualWellnessReward": "None",
           "annualDeductible": "OneHundred",
           "annualReimbursementLimit": "FiveThousand",
           "examFeeCoverage": true,
           "drugDentalCoverage": true,
           "productName": "Embrace"
         },
         "premiumSummary": {
           "paymentFrequency": "Monthly",
           "insurancePremium": 37.41,
           "totalDiscounts": 0,
           "wellnessPremium": 37.41,
           "stateTaxes": 0,
           "monthlyBillingFee": 1,
           "monthlyPremium": 38.41,
           "paymentDueRecurring": 0,
           "oneTimeEnrollmentFee": 25,
           "paymentDueToday": 0,
           "quoteLinkUrl": "string",
           "eligibleForMilitaryDiscount": true
         },
         "petCoverages": [
           {
             "annualDeductible": "OneHundred",
             "annualDeductibleDisplay": "string",
             "annualReimbursementLimit": "FiveThousand",
             "annualReimbursementLimitDisplay": "string",
             "annualWellnessReward": "None",
             "annualWellnessRewardDisplay": "string",
             "examFeeCoverage": true,
             "drugDentalCoverage": true,
             "illnessPremium": 0,
             "insuranceType": "string",
             "options": {
               "annualDeductibles": [
                 {
                   "isMostPopular": true,
                   "display": "string",
                   "isSelected": true,
                   "annualDeductible": "OneHundred"
                 }
               ],
               "annualReimbursements": [
                 {
                   "isMostPopular": true,
                   "display": "string",
                   "isSelected": true,
                   "annualReimbursementLimit": "FiveThousand"
                 }
               ],
               "annualWellnessRewards": [
                 {
                   "isMostPopular": true,
                   "display": "string",
                   "isSelected": true,
                   "annualWellnessReward": "None"
                 }
               ],
               "reimbursementPercentages": [
                 {
                   "isMostPopular": true,
                   "display": "string",
                   "isSelected": true,
                   "reimbursementPercentage": "Seventy"
                 }
               ]
             },
             "reimbursementPercentage": "Seventy",
             "reimbursementPercentageDisplay": "string",
             "totalPremium": 0,
             "wellnessPremium": 0,
             "eligibleForWellness": true,
             "productName": "Embrace",
             "petId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
             "petName": "string"
           }
         ]
       }
     ]
   };

const checkoutResponse = {
    "analytics": {
      "medium": "string",
      "term": "string",
      "content": "string",
      "campaign": "summer-sale",
      "source": "string"
    },
    "quoteId": "00000000-0000-0000-0000-000000000000",
    "quoteState": "Checkout",
    "sessionType": "string",
    "stripePublishableKey": "stripe_publishable_key",
    "stripeSetupIntentClientSecret": "stripe_client_secret"
  };



const formatter = new JSONFormatter(quoteResponseJson, 1, {
 hoverPreviewEnabled: true,
 theme: 'light',
});

const checkoutFormatter = new JSONFormatter(checkoutResponse, 1, {
 hoverPreviewEnabled: true,
 theme: 'light',
});

let quoteResponseElement = document.getElementById('quote-response');
let checkoutResponseElement = document.getElementById('checkout-response');

if(quoteResponseElement) {
    quoteResponseElement.appendChild(formatter.render());
}

if(checkoutResponseElement) {
    checkoutResponseElement.appendChild(checkoutFormatter.render());
}

