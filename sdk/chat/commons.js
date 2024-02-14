function constructChatRequestOptions(from, to) {
  const requestBody = {
    from: from,
    to: to
  };
  return {
    method: 'POST',
    headers: {
      'Content-type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  };
}

module.exports = { constructChatRequestOptions };