

function getImageList(urlList) {
    const wrapperImageList = []
    const resList = urlList.map((url) => {
        return new Promise((resolve, reject) => {
            wrapperImageList.push({
                reject,
                resolve,
                query: () => new Image(url)
            })
        })
    });

    return resList;
}