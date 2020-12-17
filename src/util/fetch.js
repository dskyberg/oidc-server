
import {globalStore} from '../stores/StoresContext'

const encodeFormData = (data) => {
  return Object.keys(data)
      .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
}

export default  (url, formData, method='post') => {
  const data = encodeFormData(formData)
  console.log('fetch:', formData)
    fetch(url, {
      body: data,
      headers: {
          "Content-Type": "application/x-www-form-urlencoded",
      },
      method: method,
      cache: 'no-cache',
    })
    .then(response => {
      if(response.redirected === true) {
        window.location = response.url
      }
      if(response.status > 299){
        console.log('fetch received an error:', response)
        return response.text()
      }
      console.log('Success:', response)
    })
    .then(json => {
      console.log('fetch body:', json)
    })
    .catch(error =>{
      console.log('fech error:', error)
    })
}