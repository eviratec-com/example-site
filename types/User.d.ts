export type User = {
  id: number
  dob: string
  username: string
  password: string
  email: string
  display_name: string
  link: string
  status: string
  created: number
  modified?: number
}

export type UserAccount = {
  id: number
  external_id: string
  external_provider: number
}

export type UserProfile = {
  id: number
  dob: string
  link: string
  status: string
  display_name: string
}

export type UserActivity = {
  user: number
  lastRenewal: number
}

export type UserRegistration = {
  email_address: string
  display_name: string
  billing_address: {
    line1: string
    line2: string
    city: string
    state: string
    zip: string
    country: string
  }
  username: string
  password: string
  site_name: string
  site_plan: string
  site: string
  dob: string
}

export type UserAttribute = {
  id?: number
  user: number
  attribute: {
    id: number
    label: string
  }
  value: string
  updated: number
  hidden?: number|null
}

export type ProfileField = {
  label: string
  value: string
}
