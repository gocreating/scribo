export default (error) => {
  let { response } = error

  if (response) {
    return response
  }
  return {
    body: {
      error: {
        message: 'Unknown error',
      },
    },
  }
}
