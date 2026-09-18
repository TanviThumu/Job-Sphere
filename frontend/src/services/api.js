import axios from 'axios'

// Get API base URL from environment or use default
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

console.log('API Base URL:', API_BASE_URL)

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,  // 30 seconds (scraping happens in background)
})

// Add response interceptor for better error handling
apiClient.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.message)
    if (error.response) {
      console.error('Response data:', error.response.data)
      console.error('Response status:', error.response.status)
    }
    return Promise.reject(error)
  }
)

export const jobsAPI = {
  // Search jobs with params
  search: (params) => {
    console.log('Searching with params:', params)
    return apiClient.get('/jobs', { params })
  },
  
  // Get single job by ID
  getJob: (id) => 
    apiClient.get(`/jobs/${id}`),
  
  // Get available platforms
  getPlatforms: () => {
    console.log('Fetching platforms...')
    return apiClient.get('/jobs/platforms/list')
  },
}

export default apiClient