// license validation info from https://ntsi.com/drivers-license-format/ and
// https://github.com/adambullmer/USDLRegex/blob/master/regex.json
const states = [
  {
    state: 'Alabama',
    abbreviation: 'Ala.',
    code: 'AL',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{1,8}$/,
      description: [
        '1-8 Numeric'
      ]
    }
  },
  {
    state: 'Alaska',
    abbreviation: 'Alaska',
    code: 'AK',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{1,7}$/,
      description: [
        '1-7 Numeric'
      ]
    }
  },
  {
    state: 'Arizona',
    abbreviation: 'Ariz.',
    code: 'AZ',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{1,8}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 1-8 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Arkansas',
    abbreviation: 'Ark.',
    code: 'AR',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{4,9}$/,
      description: [
        '4-9 Numeric'
      ]
    }
  },
  {
    state: 'California',
    abbreviation: 'Calif.',
    code: 'CA',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{7}$/,
      description: [
        '1 Alpha + 7 Numeric'
      ]
    }
  },
  {
    state: 'Colorado',
    abbreviation: 'Colo.',
    code: 'CO',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{9}$)|(^[A-Z]{1}[0-9]{3,6}$)|(^[A-Z]{2}[0-9]{2,5}$)/,
      description: [
        '9 Numeric',
        '1 Alpha + 3-6 Numeric',
        '2 Alpha + 2-5 Numeric'
      ]
    }
  },
  {
    state: 'Connecticut',
    abbreviation: 'Conn.',
    code: 'CT',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{9}$/,
      description: [
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Delaware',
    abbreviation: 'Del.',
    code: 'DE',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{1,7}$/,
      description: [
        '1-7 Numeric'
      ]
    }
  },
  {
    state: 'District of Columbia',
    abbreviation: 'D.C.',
    code: 'DC',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{7}$)|(^[0-9]{9}$)/,
      description: [
        '7 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Florida',
    abbreviation: 'Fla.',
    code: 'FL',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{12}$/,
      description: [
        '1 Alpha + 12 Numeric'
      ]
    }
  },
  {
    state: 'Georgia',
    abbreviation: 'Ga.',
    code: 'GA',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{7,9}$/,
      description: [
        '7-9 Numeric'
      ]
    }
  },
  {
    state: 'Hawaii',
    abbreviation: 'Hawaii',
    code: 'HI',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 8 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Idaho',
    abbreviation: 'Idaho',
    code: 'ID',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{2}[0-9]{6}[A-Z]{1}$)|(^[0-9]{9}$)/,
      description: [
        '2 Alpha + 6 Numeric + 1 Alpha',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Illinois',
    abbreviation: 'Ill.',
    code: 'IL',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{11,12}$/,
      description: [
        '1 Alpha + 11-12 Numeric'
      ]
    }
  },
  {
    state: 'Indiana',
    abbreviation: 'Ind.',
    code: 'IN',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{9}$)|(^[0-9]{9,10}$)/,
      description: [
        '1 Alpha + 9 Numeric',
        '9-10 Numeric'
      ]
    }
  },
  {
    state: 'Iowa',
    abbreviation: 'Iowa',
    code: 'IA',
    driversLicenseNumberValidator: {
      rule: /^([0-9]{9}|([0-9]{3}[A-Z]{2}[0-9]{4}))$/,
      description: [
        '9 Numeric',
        '3 Numeric + 2 Alpha + 4 Numeric'
      ]
    }
  },
  {
    state: 'Kansas',
    abbreviation: 'Kans.',
    code: 'KS',
    driversLicenseNumberValidator: {
      rule: /(^([A-Z]{1}[0-9]{1}){2}[A-Z]{1}$)|(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 1 Numeric + 1 Alpha + 1 Numeric + 1 Alpha',
        '1 Alpha + 8 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Kentucky',
    abbreviation: 'Ky.',
    code: 'KY',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{8,9}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 8-9 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Louisiana',
    abbreviation: 'La.',
    code: 'LA',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{1,9}$/,
      description: [
        '1-9 Numeric'
      ]
    }
  },
  {
    state: 'Maine',
    abbreviation: 'Maine',
    code: 'ME',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{7,8}$)|(^[0-9]{7}[A-Z]{1}$)/,
      description: [
        '7-8 Numeric',
        '7 Numeric + 1 Alpha'
      ]
    }
  },
  {
    state: 'Maryland',
    abbreviation: 'Md.',
    code: 'MD',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{12}$/,
      description: [
        '1 Alpha + 12 Numeric'
      ]
    }
  },
  {
    state: 'Massachusetts',
    abbreviation: 'Mass.',
    code: 'MA',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{8}$)|(^[A-Z]{2}[0-9]{7}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 8 Numeric',
        '2 Alpha + 7 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Michigan',
    abbreviation: 'Mich.',
    code: 'MI',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{10}$)|(^[A-Z]{1}[0-9]{12}$)/,
      description: [
        '1 Alpha + 10 Numeric',
        '1 Alpha + 12 Numeric'
      ]
    }
  },
  {
    state: 'Minnesota',
    abbreviation: 'Minn.',
    code: 'MN',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{12}$/,
      description: [
        '1 Alpha + 12 Numeric'
      ]
    }
  },
  {
    state: 'Mississippi',
    abbreviation: 'Miss.',
    code: 'MS',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{9}$/,
      description: [
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Missouri',
    abbreviation: 'Mo.',
    code: 'MO',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{5,9}$)|(^[A-Z]{1}[0-9]{6}[R]{1}$)|(^[0-9]{3}[A-Z]{1}[0-9]{6}$)|(^[0-9]{8}[A-Z]{2}$)|(^[0-9]{9}[A-Z]{1}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 5-9 Numeric',
        "1 Alpha + 6 Numeric + 'R'",
        '8 Numeric + 2 Alpha',
        '9 Numeric + 1 Alpha',
        '9 Numeric',
        '3 Numeric + 1 Alpha + 6 Numeric'
      ]
    }
  },
  {
    state: 'Montana',
    abbreviation: 'Mont.',
    code: 'MT',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{8}$)|(^[0-9]{13}$)|(^[0-9]{9}$)|(^[0-9]{14}$)/,
      description: [
        '1 Alpha + 8 Numeric',
        '13 Numeric',
        '9 Numeric',
        '14 Numeric'
      ]
    }
  },
  {
    state: 'Nebraska',
    abbreviation: 'Nebr.',
    code: 'NE',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{1,7}$)|(^[A-Z]{1}[0-9]{6,8}$)/,
      description: [
        '1-7 Numeric',
        '1 Alpha + 6-8 Numeric'
      ]
    }
  },
  {
    state: 'Nevada',
    abbreviation: 'Nev.',
    code: 'NV',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{9,10}$)|(^[0-9]{12}$)|(^[X]{1}[0-9]{8}$)/,
      description: [
        '9 Numeric',
        '10 Numeric',
        '12 Numeric',
        "'X' + 8 Numeric"
      ]
    }
  },
  {
    state: 'New Hampshire',
    abbreviation: 'N.H.',
    code: 'NH',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{2}[A-Z]{3}[0-9]{5}$)|(^[A-Z]{3}[0-9]{8}$)/,
      description: [
        '2 Numeric + 3 Alpha + 5 Numeric',
        '3 Alpha + 8 Numeric'
      ]
    }
  },
  {
    state: 'New Jersey',
    abbreviation: 'N.J.',
    code: 'NJ',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{14}$/,
      description: [
        '1 Alpha + 14 Numeric'
      ]
    }
  },
  {
    state: 'New Mexico',
    abbreviation: 'N.M.',
    code: 'NM',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{8,9}$/,
      description: [
        '8 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'New York',
    abbreviation: 'N.Y.',
    code: 'NY',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{7}$)|(^[A-Z]{1}[0-9]{18}$)|(^[0-9]{8}$)|(^[0-9]{9}$)|(^[0-9]{16}$)|(^[A-Z]{8}$)/,
      description: [
        '1 Alpha + 7 Numeric',
        '1 Alpha + 18 Numeric',
        '8 Numeric',
        '9 Numeric',
        '16 Numeric',
        '8 Alpha'
      ]
    }
  },
  {
    state: 'North Carolina',
    abbreviation: 'N.C.',
    code: 'NC',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{1,12}$/,
      description: [
        '1-12 Numeric'
      ]
    }
  },
  {
    state: 'North Dakota',
    abbreviation: 'N.D.',
    code: 'ND',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{3}[0-9]{6}$)|(^[0-9]{9}$)/,
      description: [
        '3 Alpha + 6 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Ohio',
    abbreviation: 'Ohio',
    code: 'OH',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{4,8}$)|(^[A-Z]{2}[0-9]{3,7}$)|(^[0-9]{8}$)/,
      description: [
        '1 Alpha + 4-8 Numeric',
        '2 Alpha + 3-7 Numeric',
        '8 Numeric'
      ]
    }
  },
  {
    state: 'Oklahoma',
    abbreviation: 'Okla.',
    code: 'OK',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{9}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 9 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Oregon',
    abbreviation: 'Ore.',
    code: 'OR',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{1,9}$)|(^[AB][0-9]{6}$)/,
      description: [
        '1-9 Numeric',
        'A + 6 Numeric',
        'B + 6 Numeric'
      ]
    }
  },
  {
    state: 'Pennsylvania',
    abbreviation: 'Pa.',
    code: 'PA',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{8}$/,
      description: [
        '8 Numeric'
      ]
    }
  },
  {
    state: 'Rhode Island',
    abbreviation: 'R.I.',
    code: 'RI',
    driversLicenseNumberValidator: {
      rule: /^([0-9]{7,8}$)|(^[A-Z]{1}[0-9]{6}$)/,
      description: [
        '7-8 Numeric',
        '1 Alpha + 6 Numeric'
      ]
    }
  },
  {
    state: 'South Carolina',
    abbreviation: 'S.C.',
    code: 'SC',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{5,11}$/,
      description: [
        '5-11 Numeric'
      ]
    }
  },
  {
    state: 'South Dakota',
    abbreviation: 'S.D.',
    code: 'SD',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{6,10}$)|(^[0-9]{12}$)/,
      description: [
        '6-10 Numeric',
        '12 Numeric'
      ]
    }
  },
  {
    state: 'Tennessee',
    abbreviation: 'Tenn.',
    code: 'TN',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{7,9}$/,
      description: [
        '7-9 Numeric'
      ]
    }
  },
  {
    state: 'Texas',
    abbreviation: 'Tex.',
    code: 'TX',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{7,8}$/,
      description: [
        '7-8 Numeric'
      ]
    }
  },
  {
    state: 'Utah',
    abbreviation: 'Utah',
    code: 'UT',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{4,10}$/,
      description: [
        '4-10 Numeric'
      ]
    }
  },
  {
    state: 'Vermont',
    abbreviation: 'Vt.',
    code: 'VT',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{8}$)|(^[0-9]{7}[A]$)/,
      description: [
        '8 Numeric',
        "7 Numeric + 'A'"
      ]
    }
  },
  {
    state: 'Virginia',
    abbreviation: 'Va.',
    code: 'VA',
    driversLicenseNumberValidator: {
      rule: /(^[A-Z]{1}[0-9]{8,11}$)|(^[0-9]{9}$)/,
      description: [
        '1 Alpha + 8 Numeric',
        '1 Alpha + 9 Numeric',
        '1 Alpha + 10 Numeric',
        '1 Alpha + 11 Numeric',
        '9 Numeric'
      ]
    }
  },
  {
    state: 'Washington',
    abbreviation: 'Wash.',
    code: 'WA',
    driversLicenseNumberValidator: {
      rule: /^(?=.{12}$)[A-Z]{1,7}[A-Z0-9\\*]{4,11}$/,
      description: [
        '1-7 Alpha + any combination of Alpha, Numeric, and * for a total of 12 characters'
      ]
    }
  },
  {
    state: 'West Virginia',
    abbreviation: 'W.Va.',
    code: 'WV',
    driversLicenseNumberValidator: {
      rule: /(^[0-9]{7}$)|(^[A-Z]{1,2}[0-9]{5,6}$)/,
      description: [
        '7 Numeric',
        '1-2 Alpha + 5-6 Numeric'
      ]
    }
  },
  {
    state: 'Wisconsin',
    abbreviation: 'Wis.',
    code: 'WI',
    driversLicenseNumberValidator: {
      rule: /^[A-Z]{1}[0-9]{13}$/,
      description: [
        '1 Alpha + 13 Numeric'
      ]
    }
  },
  {
    state: 'Wyoming',
    abbreviation: 'Wyo.',
    code: 'WY',
    driversLicenseNumberValidator: {
      rule: /^[0-9]{9,10}$/,
      description: [
        '9-10 Numeric'
      ]
    }
  }
]

export default states
