import axiosClient from './axiosClient'

export async function getUserById(id) {
  const { data } = await axiosClient.get(`/student/findUsersById/${id}`)
  return data?.student
}

export async function updateUserProfile(id, payload) {
  const { data } = await axiosClient.put(`/student/updateUser/${id}`, payload)
  return data?.student
}

export async function getAllUsers() {
  const { data } = await axiosClient.get('/student/getAllUser')
  return data?.students || []
}
