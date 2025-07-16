// APIServices.js - Enhanced version
import axios from 'axios';
import './axiosConfig';

export const APIService = (function () {

    function get({ url, payload = null }) {
        return axios.get(url, payload)
            .then(res => res)
            .catch(error => error)
            .finally(function () {
                
            });
    }

    function post({ url, payload, onUploadProgress = null }) {
        const config = {
            onUploadProgress: onUploadProgress
        };
        
        return axios.post(url, payload, config)
            .then(res => res)
            .catch(error => {
                console.log(error);
                return error;
            });
    }

    function put({ url, payload }) {
        return axios.put(url, payload)
            .then(res => res)
            .catch(error => error)
    }

    // Add specific method for file uploads
    function uploadFile({ url, formData, onUploadProgress = null }) {
        return axios.post(url, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            onUploadProgress: onUploadProgress
        })
        .then(res => res)
        .catch(error => {
            console.log(error);
            return error;
        });
    }

    return {
        get: get,
        post: post,
        put: put,
        uploadFile: uploadFile
    }
})();
