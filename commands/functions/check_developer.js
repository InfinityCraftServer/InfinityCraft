module.exports = {
    check: function (userid) {
        return new Promise((res) => {
            developers = ["478260337536139264", "259782176655015937"]
            if(developers.includes(userid)){
                res(true)
            }
            else {
                res(false)
            }
        });
    }

}