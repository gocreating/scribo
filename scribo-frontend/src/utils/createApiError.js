export default (error) => {
  let { response } = error
  let message = 'Unknown error'

  if (response) {
    return response
  }
  return {
    body: {
      error: {
        message: error.message || message,
      },
    },
  }
}
