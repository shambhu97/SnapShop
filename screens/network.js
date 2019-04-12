let baseUrl = 'https://test.snapshop.fi/api/v1/';

class APIs {


    getUserToken() {
        // username: tester01, password: test0000
        // as per snapshot token based authentication:- Base dGVzdGVyMDE6dGVzdDAwMDA=
        let authToken = 'Basic dGVzdGVyMDE6dGVzdDAwMDA='
        return authToken;

    }

    headers(token) {
        let header = {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Access-Control-Origin': '*'
        };

        if (token) {
            header.Authorization = token;
        }

        return header;
    }

    // get request
    get(url) {
        return fetch(url, {
                headers: this.headers(this.getUserToken())
            })
            .then(response => {
                return response.json();
            })
            .catch(e => {
                console.log('error: ', e);
            });
    }

    // post request for Image upload only
    post(url, body = null) {
        return fetch(url, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'multipart/form-data;',
                    'Authorization': this.getUserToken()
                },
                body: body
            })
            .then(response => {
                return response;
                // return response.json();
            })
            .catch(e => {
                console.log('error: ', e);
            });
    }

    /* ********** Required methods for snapshop app ************ */
    getUploadedImage() {
        let url = `${baseUrl}items/offset/0/count/1`;
        return this.get(url);
    }

    // during first reload
    getImageItems() {
        let url = `${baseUrl}items/offset/0/count/21`;
        return this.get(url);
    }

    uploadImageToServer(imageData) {
        let url = `${baseUrl}content`;
        return this.post(url, imageData);
    }

    fetchMoreImage(counter) {
        let url = `${baseUrl}items/offset/${counter}/count/21`;
        return this.get(url);
    }
}

export default new APIs();