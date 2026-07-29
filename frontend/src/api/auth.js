import axiosClient from './axiosClient'

// Decodes a JWT payload without verifying it (verification happens server-side).
// Used only to read { id, email } straight after login since the backend's
// /student/login response doesn't include the user object, only the token.
function decodeJwtPayload(token) {
  try {
    const base64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
  } catch {
    return null
  }
}

export async function registerUser({ name, email, password, course, skills, role }) {
  const { data } = await axiosClient.post('/student/register', {
    name, email, password, course, skills, role,
  })
  return data
}

export async function loginUser({ email, password }) {
  const { data } = await axiosClient.post('/student/login', { email, password })
  const token = data?.token
  if (!token) throw new Error(data?.message || 'Login failed')

  const payload = decodeJwtPayload(token)
  let user = { id: payload?.id, email: payload?.email }

  // Fetch the full profile now that we have an id + token.
  try {
    const profile = await axiosClient.get(`/student/findUsersById/${payload.id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (profile.data?.student) user = profile.data.student
  } catch {
    // Profile lookup can fail on a fresh/buggy backend — the decoded
    // token payload is still enough to keep the user logged in.
  }

  return { token, user }
}

export function logoutUser() {
  localStorage.removeItem('jobify_token')
  localStorage.removeItem('jobify_user')
}
