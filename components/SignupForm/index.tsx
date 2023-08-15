import React, {
  useCallback,
  useContext,
  useEffect,
  useId,
  useState
} from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  useStripe,
  useElements,
  PaymentElement
} from '@stripe/react-stripe-js'
import allCountries from 'country-region-data/data.json'

import ProgressBar from '@/components/ProgressBar'

import styles from './SignupForm.module.css'

import SessionContext from '@/contexts/SessionContext'

import * as PLAN from '@/inc/plans'

import type { Plan } from '@/types/Plan'
import type { UserRegistration } from '@/types/User'
import type { Credentials, Session } from '@/types/Session'

const MIN_PASSWORD_LENGTH: number = 8

interface YearMonthDate {
  year: number
  month: number
  date: number
}

interface Props {
  onChangePlan?: (newPlan: string) => void
  onChangeAmount?: (newAmount: number) => void
}

interface JoinResult {
  session: Session
  stripe: {
    customer: string
  }
}

export default function SignupForm({ onChangePlan, onChangeAmount }: Props) {
  const router = useRouter()

  const stripe = useStripe()
  const elements = useElements()

  const session = useContext(SessionContext)

  const emailAddressInputId: string = useId()
  const displayNameInputId: string = useId()
  const tosAcceptInputId: string = useId()
  const usernameInputId: string = useId()
  const passwordInputId: string = useId()
  const dobInputId: string = useId()

  const line1InputId: string = useId()
  const line2InputId: string = useId()
  const cityInputId: string = useId()
  const stateInputId: string = useId()
  const zipInputId: string = useId()
  const countryInputId: string = useId()

  const siteNameInputId: string = useId()
  const sitePlanSelectId: string = useId()

  const [emailAddress, setEmailAddress] = useState<string>('')
  const [displayName, setDisplayName] = useState<string>('')
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [dob, setDob] = useState<string>('')

  const [line1, setLine1] = useState<string>('')
  const [line2, setLine2] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [zip, setZip] = useState<string>('')
  const [country, setCountry] = useState<string>('AU')

  const [site, setSite] = useState<string>('')
  const [domain, setDomain] = useState<string>('.eviratecsocial.life')
  const [siteName, setSiteName] = useState<string>('')
  const [sitePlan, setSitePlan] = useState<string>(PLAN.LITE_PLAN.externalId.stripe)
  const [displayPlan, setDisplayPlan] = useState<Plan>(PLAN.LITE_PLAN)

  const [touchedFields, setTouchedFields] = useState<string[]>([])

  const [usernameAvailable, setUsernameAvailable] = useState<boolean>(false)
  const [usernameChecked, setUsernameChecked] = useState<boolean>(false)
  const [loadingUsername, setLoadingUsername] = useState<boolean>(false)
  const [usernameError, setUsernameError] = useState<string>('')
  const [acceptLegal, setAcceptLegal] = useState<boolean>(false)
  const [payError, setPayError] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [success, setSuccess] = useState<boolean>(false)
  const [error, setError] = useState<string>('')

  const [joinResult, setJoinResult] = useState<JoinResult|null>(null)
  const [generalDisabled, setGeneralDisabled] = useState<boolean>(false)

  const [askForDob, setAskForDob] = useState<boolean>(false)

  useEffect(() => {
    setSite(`${username}${domain}`)
  }, [username, domain])

  const [plans, setPlans] = useState<Plan[]>([
    PLAN.LITE_PLAN,
    PLAN.STANDARD_PLAN,
    PLAN.PREMIUM_PLAN,
  ])

  // validInputChar(input: string)
  // prevents input of invalid chars in username(domain) field
  const validInputChar = useCallback((input: string): boolean => {
    return !!input.match(/^([A-Z]{1}[A-Z0-9-]{1,}|[A-Z]{1}|)$/i)
  }, [])

  const validUsername = useCallback((input: string): boolean => {
    const isMatch: boolean = !!input.match(/^[A-Z]{1}[A-Z0-9-]{1,}[A-Z0-9]{1}$/i)
    const isGtMinLength: boolean = input.length >= 3

    return isMatch && isGtMinLength
  }, [])

  const checkUsername = useCallback((event): void => {
    if (!validUsername(username)) {
      return
    }

    setUsernameError('')
    setLoading(true)
    setLoadingUsername(true)

    const req = {
      method: 'POST',
      body: JSON.stringify({ username: username }),
      headers: { 'Content-Type': 'application/json' },
    }

    fetch('/api/checkUsername', req)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            setLoadingUsername(false)
            setLoading(false)
            setUsernameError(
              `Unable to check subdomain availability: ${username}.eviratecsocial.life`
            )
          })
        }

        result.json().then(json => {
          setLoadingUsername(false)
          setLoading(false)
          setUsernameChecked(true)
          setUsernameAvailable(json.available)
        })
      })
      .catch((err) => {
        setLoadingUsername(false)
        setLoading(false)
        setUsernameError(
          `Unable to check subdomain availability: ${username}.eviratecsocial.life`
        )
      })

  }, [username, validUsername])

  const touch = useCallback((key: string): boolean => {
    if (touchedFields.indexOf(key) > -1) {
      return true
    }

    setTouchedFields([
      ...touchedFields,
      key,
    ])

    return true
  }, [touchedFields])

  const validDob = useCallback((input: string): boolean => {
    const now: Date = new Date()

    // Empty or invalid input date
    if (!input || input.length < 10) {
      return false
    }

    const current: YearMonthDate = {
      year: now.getFullYear(),
      month: now.getMonth()+1,
      date: now.getDate(),
    }

    const compare: YearMonthDate = {
      year: Number(input.split('-')[0]),
      month: Number(input.split('-')[1]),
      date: Number(input.split('-')[2]),
    }

    const yearsBetween: number = current.year - compare.year

    // Has it been MORE THAN 18 years (e.g. 19 years) since their birth year?
    if (yearsBetween > 18) {
      return true // YES - it's more than 18 years after their birth year
    }

    // Has it been LESS THAN 18 years (e.g. 17 years) since their birth year?
    if (yearsBetween < 18) {
      return false // NO - it's less than 18 years after their birth year
    }

    // It's their birth year!
    // Is the current month: after the month they were born in
    if (true === current.month > compare.month) {
      return true // YES - it's after their birth month
    }

    // Is the current month: before the month they were born in
    if (true === current.month < compare.month) {
      return false // NO - it's before their birth month
    }

    // It's their birth month!
    // Is the current day of the month: equal to their birth day
    if (current.date === compare.date) {
      return true // YES - it's their 18th birthday today!
    }

    // Is the current day of the month: greater than their birth day
    if (true === current.date > compare.date) {
      return true // YES - it's on or after their birth date
    }

    // Is the current day of the month: less than their birth day
    if (true === current.date < compare.date) {
      return false // NO - it's before their birth date
    }

    return false
  }, [])

  const validEmail = useCallback((input: string): boolean => {
    return !!input.match(/^.+\@.+\..+$/i)
  }, [])

  const validPassword = useCallback((input: string): boolean => {
    const hasLowerCaseChar: boolean = !!input.match(/[a-z]/)
    const hasUpperCaseChar: boolean = !!input.match(/[A-Z]/)
    const hasNumber: boolean = !!input.match(/[0-9]/)
    const isGtMinLength: boolean = input.length >= MIN_PASSWORD_LENGTH

    return hasLowerCaseChar && hasUpperCaseChar && hasNumber && isGtMinLength
  }, [])

  const processPayment = useCallback(async (_joinResult) => {
    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit()

    if (submitError) {
      setError(submitError.message)
      setSuccess(false)
      setLoading(false)
      return
    }

    const customer: string = _joinResult && _joinResult.stripe
      && _joinResult.stripe.customer || joinResult.stripe.customer

    // Create the SetupIntent and obtain clientSecret
    const res = await fetch(
      `/api/setupIntent`,
      {
        method: 'POST',
        body: JSON.stringify({ customer: customer }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    const d = await res.json()

    // Confirm the SetupIntent using the details collected by the Payment Element
    const { error } = await stripe.confirmSetup({
      elements,
      clientSecret: d.clientSecret,
      confirmParams: {
        return_url: process.env.NEXT_PUBLIC_STRIPE_RETURN_URL,
      },
    });

    if (error) {
      // This point is only reached if there's an immediate error when
      // confirming the setup. Show the error to your customer (for example, payment details incomplete)
      setError(error.message);
    } else {
      // Your customer is redirected to your `return_url`. For some payment
      // methods like iDEAL, your customer is redirected to an intermediate
      // site first to authorize the payment, then redirected to the `return_url`.
    }
  }, [elements, joinResult, stripe])

  const handleSubmit = useCallback((event): void => {
    event.preventDefault()

    if (true === loading) {
      return
    }

    if (true === success && true === payError) {
      processPayment(undefined)
      return
    }

    if (!displayName) {
      touch(displayNameInputId)
      return
    }

    if (!emailAddress || !validEmail(emailAddress)) {
      touch(emailAddressInputId)
      return
    }

    if (!password || !validPassword(password)) {
      touch(passwordInputId)
      return
    }

    if (askForDob && (!dob || !validDob(dob))) {
      touch(dobInputId)
      return
    }

    if (!line1 || line1.length < 1) {
      touch(line1InputId)
      return
    }

    if (!city || city.length < 1) {
      touch(cityInputId)
      return
    }

    if (!state || state.length < 1) {
      touch(stateInputId)
      return
    }

    if (!country || country.length < 1) {
      touch(countryInputId)
      return
    }

    if (!username || !validUsername(username)) {
      touch(usernameInputId)
      return
    }

    if (!siteName || siteName.length < 1) {
      touch(siteNameInputId)
      return
    }

    if (!sitePlan || sitePlan.length < 1) {
      touch(sitePlanSelectId)
      return
    }

    if (true !== acceptLegal) {
      touch(tosAcceptInputId)
      return
    }

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      setError('Loading payment form...')
      return;
    }

    setError('')
    setLoading(true)

    // If they've already completed the signup, but are correcting a payment
    // error
    if (null !== joinResult) {
      processPayment(joinResult)
      return
    }

    const u: UserRegistration = {
      email_address: emailAddress,
      display_name: displayName,
      billing_address: {
        line1,
        line2,
        city,
        state,
        zip,
        country,
      },
      username,
      password,
      site_name: siteName,
      site_plan: sitePlan,
      site,
      dob,
    }

    const opts = {
      method: 'POST',
      body: JSON.stringify(u),
      headers: { 'Content-Type': 'application/json' },
    }

    fetch('/api/join', opts)
      .then((result) => {
        if (400 === result.status) {
          return result.json().then(json => {
            setLoading(false)
            setSuccess(false)
            setError(json.message)
          })
        }

        result.json().then(async (json) => {
          await setJoinResult(json)
          setLoading(false)
          setSuccess(true)
          session.login(json.session)
          processPayment(json)
        })
      })
      .catch((err) => {
        setLoading(false)
        setSuccess(false)
        setError(err.message)
      })
  }, [
    touch, emailAddress, displayName, username, password, siteName, sitePlan,
    site, dob, acceptLegal, displayNameInputId, emailAddressInputId,
    usernameInputId, passwordInputId, dobInputId, tosAcceptInputId, validEmail,
    validUsername, validPassword, validDob, session, stripe, elements,
    success, payError, line1, line2, city, state, zip, country, processPayment,
    loading, line1InputId, cityInputId, stateInputId, countryInputId,
    siteNameInputId, sitePlanSelectId, joinResult, askForDob
  ])

  const touched = useCallback((key: string): boolean => {
    return touchedFields.indexOf(key) > -1
  }, [touchedFields])

  useEffect(() => {
    if (!sitePlan) {
      return
    }

    const _plan = plans.filter(plan => {
      return plan.externalId.stripe === sitePlan
    })[0]

    setDisplayPlan(_plan)

    onChangePlan && onChangePlan(sitePlan)
    onChangeAmount && onChangeAmount(_plan.ppm*100)
  }, [sitePlan, plans])

  useEffect(() => {
    if (null === joinResult) {
      setGeneralDisabled(false)
      return
    }

    setGeneralDisabled(true)
  }, [joinResult])

  return (
    <div className={styles._}>
      <div className={styles.formWrapper}>
        <form name="login" onSubmit={handleSubmit}>
          <section className={styles.accountInfo}>
            <h2>Plan Selection</h2>

            <div className={styles.inputField}>
              <label htmlFor={sitePlanSelectId}>Select Plan</label>
              <select
                id={sitePlanSelectId}
                value={sitePlan}
                name="sitePlan"
                onChange={e => setSitePlan(e.target.value)}
                onBlur={e => touch(sitePlanSelectId)}
                disabled={true === generalDisabled}
              >
                {plans.length && plans.map((plan: Plan) => {
                  return (
                    <option
                      value={plan.externalId.stripe}
                      key={`opt/${plan.externalId.stripe}`}
                    >
                      {plan.title}: {plan.features.join(', ')}: ${plan.ppm}0 /month
                    </option>
                  )
                })}
              </select>
            </div>

            <h2>New Account Details</h2>

            <div className={styles.inputField}>
              <label htmlFor={displayNameInputId}>Your Full Name</label>
              <input
                id={displayNameInputId}
                value={displayName}
                name="displayName"
                placeholder="e.g. John Smith"
                onChange={e => setDisplayName(e.target.value)}
                onBlur={e => touch(displayNameInputId)}
                disabled={true === generalDisabled}
              />

              {touched(displayNameInputId) && displayName.length < 1 &&
                <p className={styles.fieldError}>
                  Please choose a display name.
                </p>
              }
            </div>

            <div className={styles.inputField}>
              <label htmlFor={emailAddressInputId}>Email Address</label>
              <input
                id={emailAddressInputId}
                value={emailAddress}
                name="emailAddress"
                type="email"
                onChange={e => setEmailAddress(e.target.value)}
                onBlur={e => touch(emailAddressInputId)}
                disabled={true === generalDisabled}
              />

              {touched(emailAddressInputId) && !validEmail(emailAddress) &&
                <p className={styles.fieldError}>
                  Please enter a valid email address.
                </p>
              }
            </div>

            <div className={styles.inputField}>
              <label htmlFor={passwordInputId}>Choose Password</label>
              <input
                id={passwordInputId}
                value={password}
                name="password"
                type="password"
                onChange={e => setPassword(e.target.value)}
                onBlur={e => touch(passwordInputId)}
                disabled={true === generalDisabled}
              />

              {touched(passwordInputId) && !validPassword(password) &&
                <p className={styles.fieldError}>
                  Passwords must contain:
                  <ul>
                    <li>At least {MIN_PASSWORD_LENGTH} characters</li>
                    <li>One upper-case letter</li>
                    <li>One lower-case letter</li>
                    <li>One number</li>
                  </ul>
                </p>
              }
            </div>

            {askForDob &&
              <div className={styles.inputField}>
                <label htmlFor={dobInputId}>Date of Birth</label>
                <input
                  id={dobInputId}
                  value={dob}
                  name="dob"
                  type="date"
                  onChange={e => setDob(e.target.value)}
                  onBlur={e => touch(dobInputId)}
                  disabled={true === generalDisabled}
                />

                {touched(dobInputId) && !validDob(dob) &&
                  <p className={styles.fieldError}>
                    You must be at least 18 years old to join.
                  </p>
                }
              </div>
            }

            <h2>Billing Details</h2>

            <div className={styles.inputField}>
              <label htmlFor={line1InputId}>Billing Address Line 1</label>
              <input
                id={line1InputId}
                value={line1}
                name="line1"
                placeholder=""
                onChange={e => setLine1(e.target.value)}
                onBlur={e => touch(line1InputId)}
                disabled={true === generalDisabled}
              />

              {touched(line1InputId) && line1.length < 2 &&
                <p className={styles.fieldError}>
                  Please enter your billing address.
                </p>
              }
            </div>

            <div className={styles.inputField}>
              <label htmlFor={line2InputId}>Billing Address Line 2</label>
              <input
                id={line2InputId}
                value={line2}
                name="line2"
                placeholder=""
                onChange={e => setLine2(e.target.value)}
                onBlur={e => touch(line2InputId)}
                disabled={true === generalDisabled}
              />
            </div>

            <div className={styles.inputField}>
              <div className={styles.geoAreaInput}>
                <div className={styles.geoCityInput}>
                  <label htmlFor={cityInputId}>City</label>
                  <input
                    id={cityInputId}
                    value={city}
                    name="city"
                    placeholder=""
                    onChange={e => setCity(e.target.value)}
                    onBlur={e => touch(cityInputId)}
                    disabled={true === generalDisabled}
                  />

                  {touched(cityInputId) && city.length < 2 &&
                    <p className={styles.fieldError}>
                      Please enter your city.
                    </p>
                  }
                </div>

                <div className={styles.geoStateInput}>
                  <label htmlFor={stateInputId}>State</label>
                  <input
                    id={stateInputId}
                    value={state}
                    name="state"
                    placeholder=""
                    onChange={e => setState(e.target.value)}
                    onBlur={e => touch(stateInputId)}
                    disabled={true === generalDisabled}
                  />

                  {touched(stateInputId) && state.length < 2 &&
                    <p className={styles.fieldError}>
                      Please enter your state.
                    </p>
                  }
                </div>
              </div>
            </div>

            <div className={styles.inputField}>
              <div className={styles.geoAreaInput}>
                <div className={styles.geoCountryInput}>
                  <label htmlFor={countryInputId}>Country</label>
                  <select
                    id={countryInputId}
                    value={country}
                    name="country"
                    onChange={e => setCountry(e.target.value)}
                    onBlur={e => touch(countryInputId)}
                    disabled={true === generalDisabled}
                  >
                    {allCountries.length && allCountries.map(country => {
                      return (
                        <option
                          value={country.countryShortCode}
                          key={`country/${country.countryShortCode}`}
                        >
                          {country.countryName}
                        </option>
                      )
                    })}
                  </select>

                  {touched(countryInputId) && country.length < 2 &&
                    <p className={styles.fieldError}>
                      Please enter your country.
                    </p>
                  }
                </div>

                <div className={styles.geoZipInput}>
                  <label htmlFor={zipInputId}>ZIP / Post Code</label>
                  <input
                    id={zipInputId}
                    value={zip}
                    name="zip"
                    placeholder=""
                    onChange={e => setZip(e.target.value)}
                    onBlur={e => touch(zipInputId)}
                    disabled={true === generalDisabled}
                  />

                  {touched(zipInputId) && zip.length < 2 &&
                    <p className={styles.fieldError}>
                      Please provide your ZIP or postal code.
                    </p>
                  }
                </div>
              </div>
            </div>
          </section>

          <section className={styles.siteInfo}>
            <h2>Site Details</h2>

            <div className={styles.inputField}>
              <label htmlFor={siteNameInputId}>Site Name</label>
              <input
                id={siteNameInputId}
                value={siteName}
                name="siteName"
                placeholder="e.g. John's Book Club"
                onChange={e => setSiteName(e.target.value)}
                onBlur={e => touch(siteNameInputId)}
                disabled={true === generalDisabled}
              />

              {touched(siteNameInputId) && siteName.length < 1 &&
                <p className={styles.fieldError}>
                  Please choose a site name.
                </p>
              }
            </div>

            <div className={styles.inputField}>
              <label htmlFor={usernameInputId}>Choose Sub-Domain</label>
              <div className={styles.urlPicker}>
                <span className={styles.urlPickerProtocol}>https://</span>
                <div className={styles.urlPickerInput}>
                  <input
                    id={usernameInputId}
                    value={username}
                    name="username"
                    placeholder="yourname"
                    className={styles.usernameInput}
                    onChange={e => validInputChar(e.target.value) && setUsername(e.target.value)}
                    onFocus={e => setUsernameChecked(false)}
                    onBlur={e => touch(usernameInputId) && e.target.value && checkUsername(e)}
                    disabled={true === generalDisabled}
                  />
                </div>

                <div className={styles.urlPickerDomain}>
                  <select
                    value={domain}
                    onChange={e => setDomain(e.target.value)}
                    disabled={true === generalDisabled}
                  >
                    <option value=".eviratecsocial.life" selected>.eviratecsocial.life</option>
                  </select>
                </div>
              </div>

              {touched(usernameInputId) && !validUsername(username) && username.length <= 2 &&
                <p className={styles.fieldError}>
                  Please enter a valid sub-domain.
                  <br />Sub-domain names must be at least 3 characters.
                </p>
              }

              {touched(usernameInputId) && !validUsername(username) && username.length > 2 &&
                <p className={styles.fieldError}>
                  Please enter a valid sub-domain. Sub-domain names may only contain:
                  <ul>
                    <li>English alphabet (A-Z)</li>
                    <li>Numbers (0-9)</li>
                    <li>Hyphens (-)</li>
                  </ul>
                </p>
              }

              {loadingUsername &&
                <p className={styles.fieldSuccess}>Checking availability...</p>
              }

              {usernameChecked && usernameAvailable &&
                <p className={styles.fieldSuccess}>
                  {username}.eviratecsocial.life is available!
                </p>
              }

              {usernameChecked && !usernameAvailable &&
                <p className={styles.fieldError}>
                  Domain {username}{domain} is not available.
                </p>
              }

              {usernameError &&
                <p className={styles.fieldError}>{usernameError}</p>
              }
            </div>

            <h2>Order Summary</h2>

            <div className={styles.inputField}>
              <table className={styles.orderSummary} cellSpacing="0">
                <thead>
                  <tr>
                    <td>Item Description</td>
                    <td>Price</td>
                  </tr>
                </thead>

                <tbody>
                  <tr>
                    <td>
                      1x {displayPlan.title} Plan
                      <span className={styles.subText}>
                        Free Website,&nbsp;
                        {displayPlan.features.join(', ')}
                      </span>
                    </td>
                    <td>
                      ${String(displayPlan.ppm).padEnd(5, '0')}
                      <span className={styles.subText}>
                        per month
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>

              <p className={styles.orderSummaryText}>
                Your card will be charged ${String(displayPlan.ppm).padEnd(5, '0')} each month, until you cancel.
              </p>

              <p className={styles.orderSummaryTextSmall}>
                Cancel at any time by contacting us:<br />
                <Link href="tel:+61482465983">
                  +61 482 465 983
                </Link>
                &nbsp;/&nbsp;
                <Link href="mailto:info@eviratecsocial.com">
                  info@eviratecsocial.com
                </Link>
              </p>
            </div>

            <h2>Payment</h2>

            <div className={styles.inputField}>
              <PaymentElement options={{
                defaultValues: {
                  billingDetails: {
                    name: displayName,
                    email: emailAddress,
                    address: {
                      line1: line1,
                      line2: line2,
                      city: city,
                      state: state,
                      country: country,
                      postal_code: zip,
                    },
                  },
                },
              }} />
            </div>

            <div className={styles.tosAcceptWrapper}>
              <label>
                <input
                  type="checkbox"
                  value="accept"
                  onChange={e => setAcceptLegal('accept' == e.target.value)}
                />

                I have read and agree to the
                <Link href={`/terms`} legacyBehavior>
                  <a target="_blank">Terms of Use</a>
                </Link>
                and
                <Link href={`/privacy`} legacyBehavior>
                  <a target="_blank">Privacy Policy</a>
                </Link>
                for EviratecSocial.
              </label>

              {touched(tosAcceptInputId) && true !== acceptLegal &&
                <p className={styles.fieldError}>
                  Please accept the Terms of Use and Privacy Policy.
                </p>
              }
            </div>

            <div className={styles.submitButtonWrapper}>
              <button type="submit" disabled={loading}>Complete Signup</button>
            </div>
          </section>
        </form>
      </div>

      {loading && (
        <div className={styles.loginResult}>
          <ProgressBar />
        </div>
      )}

      {success && (
        <div className={styles.loginResult}>
          <ProgressBar />
          <p className={styles.loginSuccess}>Signup success! Redirecting...</p>
        </div>
      )}

      {error && (
        <div className={styles.loginResult}>
          <p className={styles.loginError}>Error: {error}</p>
        </div>
      )}
    </div>
  )
}
