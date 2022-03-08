function makeResponse(content, req, hasId) {
    let url = (req.get('host') + req.originalUrl)
    if (!hasId)
        url += content.id;
    return ({
        ...content['_doc'],
        request: {
            type: 'GET',
            url: url
        }
    })
}

module.exports = {makeResponse}